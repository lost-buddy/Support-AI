# SupportAI

SupportAI is a React/Vite customer support workspace backed by an Express API, MongoDB, and server-side OpenAI analysis.

## Start locally

1. Configure `server/.env` from `server/.env.example`. Set `MONGO_URI` and `JWT_SECRET`; set `OPENAI_API_KEY` to enable ticket analysis. For an initial staff account, set `ADMIN_EMAIL` and `ADMIN_PASSWORD` together (the password must be at least 12 characters).
2. Start the API from `server/` with `npm run dev`.
3. Start the UI from `client/` with `npm run dev`.
4. Open the local Vite URL and register a customer account or sign in as staff.

The browser calls the API at `VITE_API_URL` (`http://localhost:5000/api` by default). The OpenAI key stays in the server environment and is never bundled into the frontend.

## Checks

- `npm run lint` and `npm run build` from `client/`
- `node --check server.js` from `server/`
- `GET /api/health` reports API and database readiness.
