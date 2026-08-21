from __future__ import annotations

import asyncio
import hashlib
import re
from http.cookies import SimpleCookie
from typing import Any

import aiohttp


class KeeneticError(Exception):
    """Base Keenetic error."""


class KeeneticAuthError(KeeneticError):
    """Authentication failed."""


class KeeneticConnectionError(KeeneticError):
    """Connection failed."""


class KeeneticCommandError(KeeneticError):
    """RCI diagnostic command failed."""


_PACKET_RE = re.compile(
    r"(?P<tx>\d+)\s+packets transmitted,\s+(?P<rx>\d+)\s+(?:packets )?received.*?"
    r"(?P<loss>\d+(?:\.\d+)?)%\s+packet loss",
    re.IGNORECASE,
)
_RTT_RE = re.compile(
    r"(?:rtt|round-trip).*?=\s*(?P<min>\d+(?:\.\d+)?)/"
    r"(?P<avg>\d+(?:\.\d+)?)/(?P<max>\d+(?:\.\d+)?)"
    r"(?:/\d+(?:\.\d+)?)?\s*ms",
    re.IGNORECASE,
)


class KeeneticRCIClient:
    """Minimal asynchronous read-only Keenetic RCI client."""

    def __init__(self, session: aiohttp.ClientSession, host: str, username: str, password: str, timeout: int = 10) -> None:
        host = host.strip().rstrip("/")
        if not host.startswith(("http://", "https://")):
            host = f"http://{host}"
        self._base_url = host
        self._session = session
        self._username = username
        self._password = password
        self._timeout = aiohttp.ClientTimeout(total=timeout)
        self._cookies: dict[str, str] = {}
        self._authenticated = False

    @property
    def configuration_url(self) -> str:
        return self._base_url

    def _cookie_header(self) -> str | None:
        if not self._cookies:
            return None
        return "; ".join(f"{key}={value}" for key, value in self._cookies.items())

    def _remember_cookies(self, response: aiohttp.ClientResponse) -> None:
        for key, morsel in response.cookies.items():
            self._cookies[key] = morsel.value
        for header in response.headers.getall("Set-Cookie", []):
            parsed = SimpleCookie()
            parsed.load(header)
            for key, morsel in parsed.items():
                self._cookies[key] = morsel.value

    def _request_headers(self) -> dict[str, str]:
        headers = {"Accept": "application/json"}
        if cookie := self._cookie_header():
            headers["Cookie"] = cookie
        return headers

    async def async_authenticate(self) -> None:
        """Perform Keenetic x-ndw2-interactive challenge-response auth."""
        try:
            async with self._session.get(f"{self._base_url}/auth", timeout=self._timeout) as response:
                self._remember_cookies(response)
                if response.status == 200:
                    self._authenticated = True
                    return
                realm = response.headers.get("X-NDM-Realm")
                challenge = response.headers.get("X-NDM-Challenge")
                if response.status != 401 or not realm or not challenge:
                    raise KeeneticAuthError(f"Unexpected authentication response HTTP {response.status}")

            md5_value = hashlib.md5(
                f"{self._username}:{realm}:{self._password}".encode(),
                usedforsecurity=False,
            ).hexdigest()
            password_hash = hashlib.sha256(f"{challenge}{md5_value}".encode()).hexdigest()
            headers = {"Content-Type": "application/json"}
            if cookie := self._cookie_header():
                headers["Cookie"] = cookie

            async with self._session.post(
                f"{self._base_url}/auth",
                json={"login": self._username, "password": password_hash},
                headers=headers,
                timeout=self._timeout,
            ) as response:
                self._remember_cookies(response)
                if response.status != 200:
                    raise KeeneticAuthError(f"Authentication failed with HTTP {response.status}")
                self._authenticated = True
        except (aiohttp.ClientError, TimeoutError) as err:
            raise KeeneticConnectionError(str(err)) from err

    async def async_get_json(self, path: str) -> Any:
        """Read one RCI endpoint as JSON, re-authenticating once on HTTP 401."""
        if not self._authenticated:
            await self.async_authenticate()

        for attempt in range(2):
            try:
                async with self._session.get(
                    f"{self._base_url}{path}",
                    headers=self._request_headers(),
                    timeout=self._timeout,
                ) as response:
                    self._remember_cookies(response)
                    if response.status == 401 and attempt == 0:
                        self._authenticated = False
                        await self.async_authenticate()
                        continue
                    if response.status == 401:
                        raise KeeneticAuthError("Router rejected the authenticated session")
                    if response.status >= 400:
                        raise KeeneticConnectionError(f"HTTP {response.status} while reading {path}")
                    return await response.json(content_type=None)
            except (aiohttp.ClientError, TimeoutError) as err:
                raise KeeneticConnectionError(str(err)) from err
        raise KeeneticAuthError("Authentication retry failed")

    async def async_post_json(self, path: str, payload: Any) -> Any:
        """POST JSON to an RCI endpoint, re-authenticating once on HTTP 401."""
        if not self._authenticated:
            await self.async_authenticate()

        for attempt in range(2):
            headers = self._request_headers()
            headers["Content-Type"] = "application/json"
            try:
                async with self._session.post(
                    f"{self._base_url}{path}",
                    json=payload,
                    headers=headers,
                    timeout=self._timeout,
                ) as response:
                    self._remember_cookies(response)
                    if response.status == 401 and attempt == 0:
                        self._authenticated = False
                        await self.async_authenticate()
                        continue
                    if response.status == 401:
                        raise KeeneticAuthError("Router rejected the authenticated session")
                    if response.status >= 400:
                        raise KeeneticConnectionError(f"HTTP {response.status} while posting {path}")
                    return await response.json(content_type=None)
            except (aiohttp.ClientError, TimeoutError) as err:
                raise KeeneticConnectionError(str(err)) from err
        raise KeeneticAuthError("Authentication retry failed")

    @staticmethod
    def _raise_rci_error(data: Any) -> None:
        if not isinstance(data, dict):
            return
        statuses = data.get("status")
        if not isinstance(statuses, list):
            return
        errors = [
            str(item.get("message") or item.get("code") or "RCI command failed")
            for item in statuses
            if isinstance(item, dict) and item.get("status") == "error"
        ]
        if errors:
            raise KeeneticCommandError("; ".join(errors))

    async def async_parse_command(self, command: str, *, max_wait: float = 15.0) -> list[str]:
        """Run one diagnostic CLI command through /rci/parse and collect streamed output."""
        data = await self.async_post_json("/rci/parse", command)
        lines: list[str] = []
        loop = asyncio.get_running_loop()
        deadline = loop.time() + max_wait

        while True:
            self._raise_rci_error(data)
            if isinstance(data, dict):
                message = data.get("message")
                if isinstance(message, list):
                    lines.extend(str(item) for item in message)
                elif isinstance(message, str):
                    lines.append(message)
                continued = bool(data.get("continued"))
            else:
                continued = False

            if not continued:
                return lines
            if loop.time() >= deadline:
                raise KeeneticCommandError(f"Diagnostic command timed out: {command}")

            await asyncio.sleep(0.25)
            data = await self.async_get_json("/rci/parse")

    async def async_ping(self, host: str, interface: str, *, count: int = 5) -> dict[str, float | None]:
        """Return factual average ping and packet loss for one source interface."""
        lines = await self.async_parse_command(
            f"tools ping {host} count {count} source {interface}"
        )
        text = "\n".join(lines)
        packet = _PACKET_RE.search(text)
        rtt = _RTT_RE.search(text)
        return {
            "ping_ms": float(rtt.group("avg")) if rtt else None,
            "packet_loss": float(packet.group("loss")) if packet else None,
        }

    async def async_get_system(self) -> dict[str, Any]:
        data = await self.async_get_json("/rci/show/system")
        return data if isinstance(data, dict) else {}

    async def async_get_version(self) -> dict[str, Any]:
        data = await self.async_get_json("/rci/show/version")
        return data if isinstance(data, dict) else {}

    async def async_get_interface(self, interface: str) -> dict[str, Any]:
        data = await self.async_get_json(f"/rci/show/interface/{interface}")
        return data if isinstance(data, dict) else {}

    async def async_get_routes(self) -> Any:
        return await self.async_get_json("/rci/show/ip/route")
