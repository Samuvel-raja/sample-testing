# ProductHub User Guide

## Getting Started

### What is ProductHub?

ProductHub is a store admin console for running the back office of a small online shop. From one place you can manage the product catalog, stock levels, product images, discount codes, and store-wide settings.

It replaces spreadsheets and scattered tools with a single, structured workspace: every product, stock line, image, and promotion lives in one screen you can search and filter.

---

### Who is it for?

**Store managers / merchandisers** — Keep products, prices, and descriptions current.

**Operations** — Track stock by location and record adjustments.

**Marketing** — Set up and schedule discount codes.

**Store owners** — Configure checkout behaviour, notifications, and shipping.

---

### What can you do in ProductHub?

- Add and edit **products** in the Catalog
- Track and adjust **inventory** across warehouse locations
- Upload and organize **images** in the Media library
- Create and schedule **promotions**
- Configure **store settings** — checkout, email notifications, shipping zones

---

### Signing in

The app opens on a **Sign in** page; any other URL redirects there until you sign in.

1.  Enter your **Email** and **Password**.
2.  Click **Sign in**.

For this demo use `admin@northlight.example` / `admin123`. Wrong details show an inline error; correct ones open the **Catalog**, scoped to the store in the header (**Northlight Goods**).

Your session is remembered in this browser, so a reload keeps you signed in. Click **Log out** in the header to end it.

The store data is also **saved in this browser** (localStorage), so your changes survive a reload. Click **Reset data** in the header to restore the original sample store. Uploaded images are stored too; very large images can exceed the browser's storage limit, in which case only some changes are kept after a reload.

---

## Quick Start Guide

1.  **Add a product** — Catalog → *New product*.
2.  **Set its stock** — Inventory → *Adjust stock*.
3.  **Add images** — Media → drag files in, then attach them to the product.
4.  **Create a promotion** — Promotions → *New promotion*.
5.  **Review store settings** — Settings.

---

## Navigation

The left sidebar has five sections: **Catalog**, **Inventory**, **Media**, **Promotions**, **Settings**. The header shows which store you are editing.

Each section opens as a list. When you add or edit an item, the editor form opens in a **pop-up dialog** over the list; it closes when you save, cancel, press Esc, or click outside it. Deleting anything asks for confirmation first, and a short message confirms every successful save.

---

# Catalog

The Catalog is the full list of products, with their category, price, status, and last edit.

## Adding a product

1.  Go to **Catalog**
2.  Click **New product**
3.  Fill in:
    -   **Product Name** (required)
    -   **Description**
    -   **Category** and **Subcategory** (subcategory options depend on the category)
    -   **Status** — Draft / Published / Archived
    -   **Price** (required)
    -   **Compare-at price** (optional; used to show a markdown)
    -   **Featured product**
    -   **Tags**
4.  Click **Add product**

## Editing and deleting

-   Click a product row, or its **Edit** button, to open it in the panel. Change the fields and click **Save changes**.
-   Click **Delete** on a row (or in the panel) and confirm. Deleting a product also removes its stock lines.

## Finding a product

Use the **Search** box and the **Category** filter above the table. **Clear** resets both.

---

# Inventory

Inventory shows one stock line per product and location, with on-hand, reserved, and available quantities, the reorder point, and a status of **In stock**, **Low**, or **Out**.

## Reviewing stock

Filter the list with the **Search** box, the **Location** filter, or the **Low / out only** checkbox.

## Adjusting stock

1.  Go to **Inventory**
2.  Click **Adjust stock** (or click a stock row to start with that product)
3.  Fill in:
    -   **Product** (required)
    -   **Location**
    -   **Adjustment** — Set to / Add / Remove
    -   **Quantity** (required)
    -   **Reorder point** (leave blank to keep the current value)
    -   **Reason**
    -   **Note** (optional)
4.  Click **Apply adjustment**

---

# Media

The Media library holds all uploaded images.

## Uploading images

Drag image files onto the upload area at the top of the page, or click it to choose files. JPG, PNG, and WEBP are accepted, and you can add several at once. Each card shows the image, its **name**, and its **description**.

## Editing an image

1.  Click an image card
2.  Update the **Name** and the **Description**
3.  Click **Save**

Delete an image from its card or from the pop-up, then confirm.

---

# Promotions

Promotions are discount codes with their own rules and schedule.

## Creating a promotion

1.  Go to **Promotions**
2.  Click **New promotion**
3.  Fill in:
    -   **Promo code** (required; stored in capitals)
    -   **Discount type** — Percentage / Fixed amount / Free shipping
    -   **Discount value** (for Percentage or Fixed amount)
    -   **Applies to** — Entire order / Specific category / Specific products
    -   **Start date** and **End date**
    -   **Minimum spend**
    -   **Usage limit** (0 means unlimited)
    -   **Customer eligibility** — All / First-time / Returning
    -   **Can be combined with other promotions**
    -   **Status** — Active or Inactive
4.  Click **Create promotion**

## Promotion status

The list shows each code as **Active**, **Scheduled** (start date in the future), **Expired** (past its end date), or **Inactive** (switched off). Open a promotion to change its dates or details, or turn **Status** off to pause it. Filter the list by status or search by code.

---

# Settings

Settings holds store-wide options. Change any field and click **Save settings**, or **Discard** to undo unsaved changes. The Save bar is inactive until something changes.

## Store details

Store name, support email, store description, store logo, timezone, currency, and weight unit.

## Checkout

Whether prices include or exclude tax, whether a phone number is required, whether guest checkout is allowed, and whether an order-note field is shown.

## Email notifications

Choose which events send an email: new order, low stock, refund issued, weekly summary.

## Shipping zones

1.  Click **Add zone**
2.  Set the **Zone name**, choose one or more **Countries**, and enter a **Rate**
3.  Click **Save settings**

Remove a zone with the delete button on its row.

---

*ProductHub is a local demo with no backend. Data is saved in your browser's localStorage and persists across reloads; use **Reset data** in the header to restore the original sample store.*
