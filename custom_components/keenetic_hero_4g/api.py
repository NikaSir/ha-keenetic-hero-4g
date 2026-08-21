from __future__ import annotations

import hashlib
from http.cookies import SimpleCookie
from typing import Any

import aiohttp


class KeeneticError(Exception):
    """Base Keenetic error."""


class KeeneticAuthError(KeeneticError):
    """Authentication failed."""


class KeeneticConnectionError(KeeneticError):
    """Connection failed."""


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
            headers: dict[str, str] = {"Accept": "application/json"}
            if cookie := self._cookie_header():
                headers["Cookie"] = cookie
            try:
                async with self._session.get(
                    f"{self._base_url}{path}", headers=headers, timeout=self._timeout
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
