# Security Policy

## Supported versions

Only the `main` branch is maintained. Deploy from a recent commit.

## Reporting a vulnerability

Please **do not open a public issue** for security problems.

Email the maintainer with:

- a description of the issue and its impact,
- steps to reproduce (a proof-of-concept request is ideal),
- the affected route(s), file(s), and the commit you tested against.

You can expect an acknowledgement within a few days.

## Security controls in this codebase

For context, the application already implements:

- **CSRF protection** — HMAC tokens bound to the session identity, verified on
  every unsafe method (`src/middleware/security.js`).
- **Role guards** — `requireRole()` re-reads the user from the database on every
  request, enforcing the active flag and a post-password-change session
  watermark (`src/auth.js`).
- **Output escaping** — all user-supplied strings are HTML-escaped in the EJS
  views; the only raw sink, `h.linkify()`, escapes its input before building
  markup (`src/helpers.js`).
- **Auth rate limiting** — sliding-window limiter keyed on IP + email + user id
  for `/login` and password changes.
- **Password storage** — bcrypt with a per-request dummy-hash comparison to
  flatten login timing.
- **Security headers** — CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy` (`src/middleware/security.js`).

Known hardening items are tracked in the project README / issues (CSP still
allows `script-src 'unsafe-inline'`; role allowlists are currently hardcoded in
`src/auth.js`).
