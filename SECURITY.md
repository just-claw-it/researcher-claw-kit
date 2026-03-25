# Security

## Reporting a vulnerability

Please report security issues privately so we can address them before they are disclosed publicly.

- Open a **GitHub Security Advisory** for this repository (**Security** tab → **Advisories** → **Report a vulnerability**), or
- Email the repository owner with a clear description of the issue and steps to reproduce.

Please do not open a public issue for undisclosed security vulnerabilities.

## API keys

The web app under `web/` supports **bring-your-own-key** (BYOK): keys you enter in the browser are sent from the client to the provider’s API. They are not intentionally stored on the server. Do not commit API keys, `.env` files with secrets, or tokens to the repository.
