# Lead capture → Google Sheet

How deploy-form submissions reach the spreadsheet.

```
Deploy form / chat form
        │  submitLead()  (app/lib/leads.ts)
        ▼
POST /api/lead          (app/api/lead/route.ts)  ← reads LEADS_WEBHOOK_URL (server-only)
        │  forwards JSON
        ▼
Apps Script Web App     (google-apps-script/leads-sheet.gs)
        │  upsert by email
        ▼
Google Sheet  (1Kn-q0yfMZLEJ6mWqvMdQVfMhRfTg8dWTmSdxyW3bw6E)
```

## Setup (one time)

1. **Deploy the Apps Script** — follow the header comment in
   [`leads-sheet.gs`](./leads-sheet.gs). You'll end up with a Web App URL like
   `https://script.google.com/macros/s/XXXX/exec`.
2. **Set the server env var** wherever the site runs:
   ```
   LEADS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
   ```
   It's **server-only** (no `NEXT_PUBLIC_` prefix) so the URL never reaches the browser.
3. **Redeploy the site.**

Until `LEADS_WEBHOOK_URL` is set, `/api/lead` accepts requests and returns
`{ ok:false, reason:'not_configured' }` — the form still works, leads just aren't
written to the sheet yet (they remain in GA + the visitor's localStorage).

## Data written

| Column | Source |
|--------|--------|
| Received At | server timestamp |
| Name / Email / Phone / Brand / Website | the deploy form |
| Source | `deploy_modal` or `chat_widget` |
| Booking Date / Booking Time | filled when the visitor picks a slot on the flip-side calendar |

The lead row is written the moment the **form** completes (so you keep leads who
don't pick a slot); the **booking** updates that same row, matched by email.

## Notes / hardening
- The endpoint is public (anyone-with-the-URL can append). For a landing page that's
  usually fine. To harden: add a shared secret — set `LEADS_TOKEN` on the server,
  include it in the forwarded body, and check it at the top of `doPost`.
- Duplicate emails upsert (update the existing row) rather than stacking rows.
