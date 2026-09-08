# ProductHub — User Stories

**US-1 – US-5** each cover one tab on its own. **US-6** is an integration check. **US-7 – US-9** span all tabs (validation, edit/teardown, navigation). **US-10** is sign in / out. Every step uses concrete values and names fields/buttons by their visible label — no locators. Matches [producthub-guide.md](producthub-guide.md).

**Persona:** *Priya*, store manager at Northlight Goods.

**Seed data:** products *Aurora Wireless Headphones*, *Trailhead 30L Backpack*, *Terracotta Planter Set*, *Linen Weekend Shirt*, *The Maker's Almanac* · promos **WELCOME10** (active), **SUMMER25** (scheduled), **FREESHIP** (inactive) · images *aurora-hero.png*, *aurora-detail.png*, *trailhead-lifestyle.jpg*, *linen-packshot.webp* · store *Northlight Goods*, `help@northlight.example`, America/New_York, USD, zones *Domestic* / *International*.

**Test image:** `C:\Users\Equipp\Downloads\WhatsApp Image 2026-08-03 at 4.35.02 PM.jpeg`

**Sign in:** `admin@northlight.example` / `admin123` (demo). The session is kept in the browser; **US-10** covers sign in / out. US-1 – US-9 assume you are already signed in.

**Before each run:** data is saved in the browser (localStorage). Click **Reset data** in the header and confirm to return to the seed.

---

## Epic

> **As a** store manager, **I want** to run the catalog and its supporting config from one admin console, **so that** the storefront stays accurate without engineering help.

---

## US-1 — Add a product (Catalog)

> **As a** store manager, **I want** to create a product with all its details, **so that** it is ready to publish.

**Flow** — Reset data.

1. **Catalog** → **New product**.
2. Enter: **Name** `Vertex 5 Smartphone` · **Description** `6.5-inch OLED, 128 GB, dual SIM` · **Category** `Electronics` → **Subcategory** `Phones` · **Status** `Published` · **Price** `499.00` · **Compare-at price** `549.00` · **Featured** ticked · **Tags** `New`, `Limited`.
3. Click **Add product**, then reopen the new row.

**Acceptance**

- The form opens in a pop-up, hidden until **New product**.
- Subcategory options follow Category and are disabled until one is picked.
- A blank Name or invalid Price blocks the save with an inline message.
- Save → toast, pop-up closes, row shows *Electronics · $499.00 · Published* with a featured marker.
- The reopened row keeps Description, Subcategory, Compare-at price, and both tags.

---

## US-2 — Upload an image (Media)

> **As a** store manager, **I want** to upload an image and give it a name and description, **so that** the library stays tidy.

**Flow** — Reset data.

1. **Media** → drop `C:\Users\Equipp\Downloads\WhatsApp Image 2026-08-03 at 4.35.02 PM.jpeg` on the upload area (or click to pick it).
2. Open the new card → **Name** `aurora-lifestyle.jpeg` · **Description** `Aurora headphones in a home setting` → **Save**.

**Acceptance**

- Drag-and-drop and the picker both accept the `.jpeg`; non-images are ignored; a toast reports the upload.
- The pop-up holds only **Name** and **Description**; the tab has no search / sort / filter.
- Save → pop-up closes, the card shows the new name and description.

---

## US-3 — Record a stock receipt (Inventory)

> **As a** store manager, **I want** to add received stock to an existing line, **so that** counts stay accurate.

**Flow** — Reset data.

1. **Inventory** → **Adjust stock** (or click the *Aurora Wireless Headphones* / *Main Warehouse* row).
2. **Product** `Aurora Wireless Headphones` · **Location** `Main Warehouse` · **Adjustment** `Add` · **Quantity** `75` · **Reorder point** `20` · **Reason** `Received shipment` · **Note** `Restock from PO-4471` → **Apply adjustment**.

**Acceptance**

- Panel hidden until **Adjust stock** or a row; a row click pre-selects that product.
- No product or a blank / negative Quantity blocks the save.
- **Add** takes the *Aurora Wireless Headphones* / *Main Warehouse* line 48 → **123** on hand, status *In stock*; no second line is created.
- Save → toast.

---

## US-4 — Create a discount code (Promotions)

> **As a** store manager, **I want** a percentage discount with a schedule and rules, **so that** a campaign runs cleanly.

**Flow** — Reset data.

1. **Promotions** → **New promotion**.
2. **Promo code** `vertex10` · **Discount type** `Percentage` · **Discount value** `10` · **Applies to** `Specific category` → **Category** `Electronics` · **Start date** today · **End date** today + 30 days · **Minimum spend** `100` · **Usage limit** `500` · **Customer eligibility** `First-time only` · **Can be combined** unticked · **Status** `Active` → **Create promotion**.

**Acceptance**

- **Discount value** shows for Percentage / Fixed only; **Specific category** reveals a required **Category**.
- A blank code, a value over 100, or an end date before the start blocks the save.
- Save → **VERTEX10** row (Percentage, 10%, window `today → +30d`, *Active*) with a toast.

---

## US-5 — Configure store settings (Settings)

> **As a** store manager, **I want** one screen for store-wide options with clear save/discard, **so that** checkout and shipping behave as intended.

**Flow** — Reset data.

1. **Store details:** **Store name** `Northlight Goods Co.` · **Support email** `support@northlight.example` · edit **Description** · pick any **Store logo** file · **Timezone** `Europe/London` · **Currency** `GBP` · **Weight unit** `Pounds`.
2. **Checkout:** **Tax handling** `Prices include tax` · tick **Require a phone number** · turn **Allow guest checkout** and **Show an order-note field** off.
3. **Email notifications:** also tick **Refund issued** and **Weekly summary**.
4. **Shipping zones:** **Add zone** → **Zone name** `EU` · **Countries** `Germany`, `France`, `Italy` · **Rate** `15.00`.
5. **Save settings**, then reload the page.
6. Change **Currency** to `USD`, click **Discard**.

**Acceptance**

- Every field type is editable (the logo stores only its filename); the Save bar is inactive until a change.
- A blank Store name, an invalid email, or a zone missing a name / rate blocks the save.
- Save persists across the reload; **Discard** reverts Currency to `GBP`; **Reset data** would restore the original store.

---

## US-6 — A new product flows across tabs (integration)

> **As a** store manager, **I want** a product I just created to be usable on the other tabs right away, **so that** I can finish setting it up without leaving.

**Flow** — Reset data, run in order, **no reload**.

1. **Catalog** → **New product**: **Name** `Nimbus Earbuds` · **Category** `Electronics` · **Subcategory** `Accessories` · **Status** `Published` · **Price** `79.00` → **Add product**.
2. **Inventory** → **Adjust stock**: open the **Product** list, confirm *Nimbus Earbuds* is there, select it, **Location** `Main Warehouse`, **Add** `40` → **Apply adjustment**.
3. **Promotions** → **New promotion**: code `nimbus15`, `Percentage` `15`, **Applies to** `Specific category` → `Electronics` → **Create promotion**.
4. **Catalog** → delete the *Nimbus Earbuds* row, confirm.

**Acceptance**

- *Nimbus Earbuds* appears in the Inventory **Product** list as soon as step 1 is saved — no reload.
- Step 2 creates a new stock line for it at *Main Warehouse* with 40 on hand.
- Deleting it in Catalog also removes that stock line.

---

## US-7 — Validation blocks a bad save

> **As a** store manager, **I want** each form to stop me on a bad value, **so that** I never save incomplete data.

**Flow** — Reset data. (Media has no save-blocking validation.)

1. **Catalog:** Name `Test Item`, Price `-5` → blocked. Price `499`, Compare-at `400` → blocked. Compare-at `559` → saves.
2. **Inventory:** Quantity `-10` → blocked. Product `Aurora Wireless Headphones`, Quantity `5` → saves.
3. **Promotions:** blank code → blocked. `save20`, value `150` → blocked. value `20`, `Specific category`, no Category → blocked. Category `Apparel`, End date before Start → blocked. End date today + 40 days → saves.
4. **Settings:** Store name blank, email `priya@northlight`, zone Rate `-1` → blocked. Restore `Northlight Goods`, `help@northlight.example`, Rate `18.00` → saves.

**Acceptance**

- Every bad save is blocked with an inline message under (or on the row of) the field; nothing changes.
- Each fix clears the message and the next save succeeds with a toast.

---

## US-8 — Edit and tear down

> **As a** store manager, **I want** to change and remove existing records, **so that** the console stays current without duplicates or accidents.

**Flow** — Reset data.

1. **Catalog:** *Terracotta Planter Set* → Status `Published`, **Save changes**. Delete *The Maker's Almanac*, confirm.
2. **Inventory:** *Trailhead 30L Backpack* (12 on hand) → **Remove** `20` → **Apply**. On hand is 0, not −8.
3. **Media:** *linen-packshot.webp* → **Name** `linen-shirt.webp`, **Description** `Folded linen weekend shirt`, **Save**. Delete *aurora-detail.png*, confirm.
4. **Promotions:** **SUMMER25** → **Status** off, **Save changes** → *Inactive*. Delete **FREESHIP**, confirm.
5. **Settings:** **Currency** `USD` → `EUR`, **Discard** → back to `USD`. Set `EUR` again, **Save settings**.

**Acceptance**

- Edits update in place — no duplicate rows.
- **Remove** clamps on hand at 0.
- Every delete opens a dialog naming the item; **Cancel** does nothing, **Delete** removes it with a toast; deleting a Catalog product also removes its stock line.
- **Discard** reverts; the later **Save settings** persists `EUR`.

---

## US-9 — Navigate and filter

> **As a** store manager, **I want** to reach each tab by URL and narrow every list, **so that** I get to a record fast.

**Flow** — Reset data.

1. While signed in, load the app → opens on **Catalog** at `/catalog`.
2. Click each sidebar item — **Inventory**, **Media**, **Promotions**, **Settings**, back to **Catalog** — checking the URL (`/inventory` … `/catalog`), the heading, and that no pop-up is open.
3. **Catalog:** Search `aurora` → 1 row. Clear, **Category** `Sports` → *Trailhead 30L Backpack*. **Clear** → all 5.
4. **Inventory:** **Location** `Returns Bin` → *The Maker's Almanac*. Clear, **Low / out only** → *Trailhead 30L Backpack*, *Terracotta Planter Set*, *The Maker's Almanac*.
5. **Media:** grid shows all 4 images; no filter controls.
6. **Promotions:** **Status** `Expired` → **FREESHIP**. Clear, Search `summer` → **SUMMER25**.
7. Open `/promotions` directly; use **Back** / **Forward**; visit `/nope` → lands on Catalog.

**Acceptance**

- Lands on `/catalog`; sidebar always lists all five with the active one highlighted; the store name shows in the header on every tab.
- Each nav sets the URL and heading with no pop-up on screen.
- The filters return exactly the rows above; **Back** / **Forward** move between visited tabs; `/nope` redirects to Catalog.

---

## US-10 — Sign in and out

> **As a** store manager, **I want** to sign in before the console opens, **so that** it isn't left open to anyone.

**Flow**

1. Open the app (or any URL) → the **Sign in** page shows.
2. Enter `admin@northlight.example` and a wrong password → **Sign in** → an error appears, still on the page.
3. Enter `admin@northlight.example` / `admin123` → **Sign in**.
4. Reload the page.
5. In the header, click **Log out**.

**Acceptance**

- Every route redirects to **Sign in** until you are signed in.
- Wrong credentials show an inline error and do not sign you in.
- Correct credentials land on **Catalog** (`/catalog`); the session survives the reload.
- **Log out** returns to **Sign in** and blocks the tabs again.

---

## Out of scope (current build)

- Real auth — the sign-in is a single hard-coded demo account, no server.
- Multiple users, multiple stores — the console is single-store.
- No backend — data lives in the browser's localStorage; **Reset data** restores the seed.
- Image hosting, tax/shipping calculation, order data — simulated or absent.
- Pagination and column sorting on the tables.
- Variant-level inventory — one line per product / location.
