SSO for admin module
=====================

How it works
------------

1. A visitor opens `/admin` without a valid `token` cookie.
2. `middleware.ts` redirects them to `/admin/sso`.
3. `/admin/sso` redirects the browser to the URL defined in `NEXT_PUBLIC_SSO_URL`, adding a `from` query param.
4. Your SSO provider authenticates the user and should redirect back to `/api/auth/sso` with at least `email=...` (or `token=...`).
5. `/api/auth/sso` looks up an admin by email, issues the `token` HttpOnly cookie and redirects to the original `from` path.

Local testing
-------------

You can test locally without a real SSO provider by pointing `NEXT_PUBLIC_SSO_URL` to the local callback endpoint itself. Example `.env` entries:

```
NEXT_PUBLIC_SSO_URL=http://localhost:3000/api/auth/sso
```

Then visit `/admin` in the browser — the flow will redirect to `/admin/sso` then immediately to `/api/auth/sso` (which accepts the `from` parameter and will look for `email` or `token` in query params). For a test you can directly open:

```
http://localhost:3000/api/auth/sso?email=napatalama%40gmail.com&from=/admin
```

This will set the admin cookie and redirect to `/admin`.

Security note
-------------

This implementation accepts `email` as proof from the provider for convenience in local testing. For production you must validate the SSO provider's token/signature (e.g., via OIDC id_token validation, signed JWT, or provider SDK) before trusting the email claim.
