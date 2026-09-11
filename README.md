# Imperial Bank of Terra — Frontend

The React interface for **Bank App v2**, styled as a Warhammer 40,000 Imperial banking terminal. Dark metal surfaces, brass details, crimson actions, and Administratum-inspired language carry through the dashboard, vaults, ledger, notifications, and administrative tools.

Built with React 19, React Router 7, Axios, and Create React App (`react-scripts` 5). It connects to the companion [backend repository](https://github.com/MAThatcher/bank-app-v2-backend).

## Features

| Area | What you can do |
| --- | --- |
| Dashboard | View and reorder vaults, hide balances, choose a default account, and personalize shortcuts |
| Vaults | Create accounts, review entries, manage members, transfer ownership, configure overdrafts, and close eligible vaults |
| Transfers | Move funds between accessible vaults through review and confirmation |
| Ledger Archives | Search and filter transactions, inspect spending summaries, and export CSV files |
| Categories and tags | Create colored personal labels, rename or archive them, filter entries, and review bulk assignments |
| Astropathic Inbox | Read and filter alerts, dismiss notifications, and see unread counts |
| Preferences | Choose in-app and email channels independently and customize the dashboard |
| Security Sanctum | Change passwords, inspect active sessions, and revoke access |
| Disputes | Flag transactions, explain issues, and track case history and resolution |
| Admin panel | Search users and vaults, manage administrator roles, revoke sessions, review disputes, and inspect audits |
| Support access | Administrators can temporarily view an eligible member's account in read-only impersonation mode |

Categories and tags are personal: reorganizing shared-vault entries does not change another member's view or any balances. Email delivery, account permissions, monetary operations, and administrator authorization are enforced by the backend.

## Run locally

Run commands from this repository's root with Node.js and npm installed:

```sh
npm ci
```

Create a root **`.env`** file:

```dotenv
REACT_APP_API_BASE=http://localhost:5000
```

This is the backend origin, **without `/api`**. API modules supply their own route paths. It defaults to `http://localhost:5000` when omitted. Frontend environment values are embedded in the browser bundle; keep database credentials, JWT secrets, and email passwords in the backend configuration only.

Follow the backend README to configure its database, apply upgrades, generate Prisma Client, and start the API. Its `CLIENT_URL` should match the frontend origin, normally `http://localhost:3000`.

```sh
npm start
```

Open [http://localhost:3000](http://localhost:3000). Register, verify your email, and sign in. Verification and password-recovery emails require the backend's mail transport to be configured.

The development server reloads source changes. Restart it after changing `.env`.

## Pages and navigation

| Route | Purpose |
| --- | --- |
| `/` | Public landing page |
| `/login`, `/register` | Sign-in and registration |
| `/verify-email/:token` | Email verification |
| `/forgot-password`, `/reset-password/:token` | Password recovery |
| `/dashboard` | Personal vault overview |
| `/account/create` | Create a vault |
| `/account/:accountId` | Vault balance and transaction ledger |
| `/account/:accountId/settings` | Membership, ownership, and vault configuration |
| `/transfer` | Transfer funds |
| `/archives` | Search, reporting, exports, and bulk label assignment |
| `/labels` | Personal categories and tags |
| `/notifications` | Astropathic Inbox |
| `/settings/preferences` | Notification and dashboard preferences |
| `/settings/security` | Password and session management |
| `/disputes`, `/disputes/:disputeId` | Personal dispute cases |
| `/admin` | Administrator workspace |
| `/admin/disputes/:disputeId` | Administrator case review |

Public information pages also exist at `/about`, `/help`, `/contact`, `/security`, `/privacy`, `/terms`, and `/compliance`. `/security` is public information; `/settings/security` contains authenticated controls.

### Organize your ledger

Open **Categories & Tags** at `/labels` to create categories and colored tags. In **Ledger Archives**, select up to 100 loaded entries, choose a category or tag action, review it, and confirm. Choosing the original category removes your personal override.

Archived labels remain visible on existing entries and available as filters. Restore them before assigning them again. Category renames update historical views and spending groups. CSV exports include effective categories and tags.

### Administrator access

An existing verified account must receive the backend's `super_user` role. The backend README documents the local first-admin bootstrap command. Sign in again after a role change and open `/admin`.

Admin → Users → Impersonate requires a reason and typed email confirmation. A persistent banner identifies the member and provides **Return to admin**. Support access is read-only and expires after at most 15 minutes. Expired or invalid access hides member content until the administrator exits the context.

## Development structure

```text
src/
  index.js                 Browser entry point
  App.js                   Application composition
  router.jsx               Routes and protected page wrappers
  api/                     Endpoint helpers and shared Axios client
  components/
    common/                Shared controls and feedback components
    layout/                Header, footer, and impersonation shell
  contexts/                Authentication and shared context
  hooks/                   Reusable React hooks
  pages/                   Public, authenticated, and admin screens
  services/                Auth, token, and support-context helpers
  styles/imperial.css       Main theme and responsive styles
test/                     Feature regression suites
```

The shared [Axios client](src/api/axiosClient.js) attaches access tokens, includes cookies, coordinates token refresh, and adds the active impersonation context. Keep API calls in `src/api` so they share that behavior.

The theme lives in [imperial.css](src/styles/imperial.css); shared loading, error, and confirmation components live under `src/components/common`. Extend these patterns when adding pages to maintain consistent styling and interactions.

## Testing

Run the combined feature suite:

```sh
npm run test:features
```

It covers transfers, notifications, vault settings, archives, security, preferences, disputes, administration, impersonation, and labels. Tests use Jest, jsdom, and React Testing Library with mocked API calls; they do not require a live backend.

Focused suites are available through:

```sh
npm run test:transfers
npm run test:notifications
npm run test:vault
npm run test:archives
npm run test:security
npm run test:preferences
```

Use `test:features` for the combined configuration, including admin and label coverage. Backend authorization, transaction atomicity, and real database behavior have separate tests in the backend repository.

## Production build

Set `REACT_APP_API_BASE` for the target API, then run:

```sh
npm run build
```

Static output is written to `build/`. Environment values are set at build time, so changing the API origin requires rebuilding. Configure the web server to serve `index.html` for client-side routes such as `/archives` and `/account/123`; otherwise direct links and refreshes can return 404.

Match backend `CLIENT_URL` to the deployed frontend origin. Production authentication uses secure, same-site refresh cookies; use HTTPS and a deployment arrangement compatible with that policy. `npm start` runs the development server, not a production host.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| API requests fail or use the wrong URL | Confirm `REACT_APP_API_BASE` has no `/api` suffix, restart the dev server, and check backend availability |
| Browser reports CORS errors | Match backend `CLIENT_URL` to the exact frontend origin, including port |
| Features report missing database tables | Apply backend upgrades, regenerate Prisma, and restart the API |
| Admin tools are unavailable | Verify the account's administrator role and sign in again after it changes |
| Impersonation actions are disabled | Support mode is read-only; use Return to admin to leave it |
| Refreshing a deployed page returns 404 | Configure the host's SPA fallback to `index.html` |
| Build emits Browserslist or Babel preset warnings | The project uses the existing Create React App toolchain; inspect the final build result separately from dependency warnings |

For API contracts, database setup, email delivery, and detailed security behavior, see the [backend documentation](https://github.com/MAThatcher/bank-app-v2-backend#readme).
