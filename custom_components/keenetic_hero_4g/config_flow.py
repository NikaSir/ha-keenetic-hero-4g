from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.const import CONF_HOST, CONF_PASSWORD, CONF_USERNAME
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .api import KeeneticAuthError, KeeneticConnectionError, KeeneticRCIClient
from .const import DEFAULT_HOST, DEFAULT_TIMEOUT, DOMAIN


class KeeneticHero4GConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Config flow for Keenetic Hero 4G+."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            host = user_input[CONF_HOST].strip().rstrip("/")
            unique_host = host.lower().removeprefix("http://").removeprefix("https://")
            await self.async_set_unique_id(unique_host)
            self._abort_if_unique_id_configured()
            client = KeeneticRCIClient(
                async_get_clientsession(self.hass),
                host,
                user_input[CONF_USERNAME],
                user_input[CONF_PASSWORD],
                timeout=DEFAULT_TIMEOUT,
            )
            try:
                system = await client.async_get_system()
            except KeeneticAuthError:
                errors["base"] = "invalid_auth"
            except KeeneticConnectionError:
                errors["base"] = "cannot_connect"
            except Exception:
                errors["base"] = "unknown"
            else:
                user_input[CONF_HOST] = host
                return self.async_create_entry(
                    title=system.get("hostname") or "Keenetic Hero 4G+",
                    data=user_input,
                )

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_HOST, default=(user_input or {}).get(CONF_HOST, DEFAULT_HOST)): str,
                    vol.Required(CONF_USERNAME, default=(user_input or {}).get(CONF_USERNAME, "admin")): str,
                    vol.Required(CONF_PASSWORD): str,
                }
            ),
            errors=errors,
        )
