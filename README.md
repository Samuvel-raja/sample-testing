# ProductHub

A Vite + React **store admin console** — a practice target for UI automation. One sign-in
page and five feature tabs, each a list with a modal editor.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build / test

```bash
npm run build      # production bundle to dist/
npm run preview    # serve the build
npm test           # node self-check for validate.js (no framework)
```

## Sign in

Demo account: **`admin@northlight.example` / `admin123`**. Any route redirects to the
sign-in page until you are signed in; the session is kept in `localStorage`. **Log out**
is in the header.

## Features

| Tab | What it does |
|-----|--------------|
| **Catalog** | Product list + search / category filter. Add / edit / delete in a pop-up: name, description, category → dependent subcategory, status radios, price, compare-at price, featured, tag chips. |
| **Inventory** | Stock lines per product / location with a derived In stock / Low / Out status. "Adjust stock" pop-up: product, location, Set / Add / Remove, quantity stepper, reason, note. |
| **Media** | Drag-and-drop image upload (stored as data URLs). Each image has a **name** and **description**, edited in a pop-up. |
| **Promotions** | Discount codes with a derived Active / Scheduled / Expired / Inactive status. Pop-up: type radios, conditional value, applies-to → dependent category, date range, spend / usage limits, eligibility, stacking, active toggle. |
| **Settings** | One form: store details, checkout options, notification checkboxes, repeatable shipping zones. Dirty-tracked **Save settings** / **Discard**. |

- **Persistence:** all data is seeded and saved to `localStorage`; **Reset data** in the
  header restores the sample store. No backend.
- **Editors** open as centered modal dialogs over the list (Esc / backdrop / Cancel to close).

## Automation notes

No `data-testid` attributes — target elements the way a normal site is tested:

- inputs / selects / textareas by their visible **label** (`getByLabel`)
- buttons / radios / checkboxes / switches by accessible name (`getByRole`)
- icon-only buttons carry `aria-label` (`Edit`, `Delete`, `Close`, …)
- rows by their text; the confirm dialog is `role="dialog"`, the toast `role="status"`
- each tab has its own URL (`/catalog`, `/inventory`, …) — deep links and back/forward work

## Project layout

```
src/
  main.jsx            entry (Router + StoreProvider)
  App.jsx             auth gate + routes
  store.jsx           auth + all data (localStorage-backed) + actions
  data.js             seed data and option lists
  validate.js         per-form validators   (+ validate.test.js)
  styles.css          design tokens + components, light / dark
  components/         AppShell, Modal, ConfirmDialog, Toast, Icon, ui.jsx
  pages/              LoginPage, CatalogPage, InventoryPage, MediaPage,
                      PromotionsPage, SettingsPage
docs/
  producthub-guide.md          end-user guide
  producthub-user-stories.md   10 test-ready user stories
```

## Stack

React 18 · React Router 6 · Vite 5 · plain CSS. No UI or form libraries.
