# Meta Ads for Musicians landing page review

This revision follows merged PR #24 and changes only the workshop landing page. The new order is compact split hero, proof strip, ticket selector, learning topics, instructor, FAQ and final ticket CTA. The previous problem section is condensed into the learning introduction.

## Files in this revision

| File | Change |
| --- | --- |
| `templates/page.meta-ads-workshop.json` | Shorter hero copy, selected real hero photograph, supplied tour proof, touring availability note and confirmed VIP schedule |
| `sections/djk-workshop.liquid` | Independent hero photo picker, early price summary, proof blocks and earlier ticket selector |
| `snippets/djk-workshop-ticket.liquid` | Separate amount, currency and total elements; existing purchase forms and guards preserved |
| `assets/djk-workshop.css` | Balanced desktop hero, text-first mobile layout, compact tickets, at least 48px buttons, original image proportions |
| `tests/workshop.cjs` | Existing ticket tests plus section order, hero/price/proof behavior and confirmed VIP timing |
| `tests/workshop-theme.cjs` | Offline Shopify Theme Check using bundled local schemas and documentation with networking disabled |
| `docs/meta-ads-workshop-review.md` | Current review instructions, evidence and remaining configuration |

The existing workshop JavaScript, global components, other templates, pixels, consent handling, products and email workflows are unchanged. No new customer-facing libraries, fonts or scripts. No countdown, invented scarcity, testimonials or attribution claims.

## Photography and proof

The new **Hero photograph** picker is independent of **Instructor photograph**. Both initially reference the actual Dylan-on-drums photograph already used by the site's playbook page:

`shopify://shop_images/iU0O-yuA_02bee8a2-a15f-4fbf-ac07-30d89f7d5858.jpg`

The image was fetched from the existing public site and visually inspected as a real performance photo. The hero no longer falls back to product artwork. It uses an uncropped responsive image with eager loading and high fetch priority; instructor/evidence images load lazily. Clearing the hero picker gives a clean text layout without a poster or image placeholder.

The proof strip uses Dylan's supplied claims: roughly 180 shows a year, recent sold-out dates in Los Angeles, San Francisco, Carson City and Nevada City, and Meta ads used to promote those shows. It does not attribute all sales solely to advertising.

Up to four optional **Approved proof item** blocks can hold editable headings, text and actual approved evidence images. Empty blocks and missing images produce no placeholders. None are populated with fabricated evidence. No private emails were retrieved or quotations invented.

## Event and ticket verification

Read-only Shopify Admin verification on November 12, 2026 still returns:

- Product `15223839752380`: Meta Ads for Musicians | Live 2-Hour Workshop, **DRAFT**.
- GA variant `71174015025340`, SKU `META-WK-GA`, USD 27.00.
- VIP variant `71174015058108`, SKU `META-WK-VIP`, USD 57.00 total.

The main workshop is December 19, 1–3 PM Central, with replay. Current project instructions explicitly confirm VIP group Zoom coaching/Q&A at **3:30–4:30 PM Central**, including the intentional half-hour break. The page and VIP FAQ now use that schedule. Zoom joining details are described as forthcoming; the page does not claim automation is configured.

Hero prices use the live matched variants when present; ticket prices use Shopify money formatting and a separately rendered currency code. Draft/missing-product presentation uses the verified USD prices with unavailable buttons. Neither market currency configuration nor product prices are modified.

The exact existing product forms, quantity one, variant/SKU/availability checks, cart return path, existing-cart guard and duplicate-submit behavior are retained. No alternate checkout or additional purchase form is introduced. The cart guard prevents common accidental additions on this page, not parallel tabs or manual quantity changes elsewhere.

## Validation

- Offline Shopify Theme Check returned **zero findings in the workshop theme files** using installed Shopify check packages and bundled schemas/docs. The local check disables fetch and HTTP/HTTPS requests and performs no source upload.
- The Shopify toolkit validation command was blocked by automatic approval review because of possible theme-source transmission to Shopify.dev. It was not retried or bypassed. The local-only checker above was used instead.
- LiquidJS/JSDOM fixtures passed both exact form payloads, quantity one, cart return path, repeat and cross-tier submission guards, existing cart, missing product, each sold-out tier and wrong SKUs.
- New fixture assertions passed section order, CTA-before-photo DOM order, eager hero photo, independent missing-photo behavior without product-image fallback, live hero/ticket prices, distinct amount/currency/total elements, optional proof images/empty blocks, VIP timing and reduced-motion anchor focus.
- JavaScript syntax and whitespace checks passed.
- Fixture tests emulate Shopify form/image tags and do not perform a real cart request, payment, layout render, tracking test or email delivery. The earlier Chromium launch in this workspace was blocked by the environment; desktop/mobile visual review remains pending. No Shopify theme was uploaded or published to obtain a preview.

Run checks using temporary development dependencies, outside the theme assets:

```sh
npm install --prefix /tmp/djk-workshop-tests liquidjs@10 jsdom@31 @shopify/theme-check-node@4 @shopify/theme-check-common@4 @shopify/theme-check-docs-updater@4
NODE_PATH=/tmp/djk-workshop-tests/node_modules node tests/workshop.cjs
NODE_PATH=/tmp/djk-workshop-tests/node_modules node tests/workshop-theme.cjs
node --check assets/djk-workshop.js
node --check tests/workshop.cjs
node --check tests/workshop-theme.cjs
git diff --check
```

## Unpublished desktop and mobile review

1. When an unpublished preview copy is authorized, load this branch into a separate unpublished copy of the existing theme. Do not publish or connect this branch to the live theme for review.
2. Select the existing `meta-ads-workshop` page template in the editor, using a Page as its preview resource. Do not overwrite the template by creating another blank one. Page creation, assignment and visibility require separate authorization.
3. In **DJK Ads Workshop**, review or replace **Hero photograph**. The right-side photo is already selected in the template defaults. The instructor photo is separately editable. Review the supplied proof copy; add actual approved evidence through **Approved proof item** blocks if desired.
4. Review 320px, 390px, 768px and 1440px widths. Desktop should show text left and uncropped photo right. Mobile should show headline, essential introduction, event details, CTA and prices before the photo. Ticket cards follow the proof strip, side by side on desktop and stacked on mobile. Check horizontal overflow, title wrapping, price spacing and button heights.
5. Check visible keyboard focus, Enter/Space on native FAQ summaries, focus transfer to ticket selection, reduced-motion scrolling and JavaScript-disabled operation. The CTA/FAQ/form behavior remains usable without extra libraries.
6. The product remains DRAFT, so unavailable purchase buttons are expected. A theme preview alone cannot make a draft product buyable. Do not change its status just to review this PR. Real cart/checkout checks require separately authorized sellability or a suitable test store.
7. When checkout review is authorized, test each tier in a clean test cart, confirm the exact variant and quantity one through checkout, then stop before payment. Test returning to the page, double-clicking and browser Back. Never clear a customer's existing cart.

## Remaining Shopify work

- Select a different hero photo if desired, review both photo settings and alt text, and optionally supply actual approved evidence images. The old artwork picker has been removed and will no longer drive the hero.
- Review any previously saved workshop-template customizations in Shopify when code is synced. The template defaults contain the new copy and chosen photo, but theme-editor saved settings may need review.
- Configure/verify the Shopify Page handle, title, SEO, template assignment and visibility separately. Proposed address remains `/pages/meta-ads-workshop`.
- Separately approve product-description corrections: it still describes a Zoom main workshop, an unannounced date, immediate VIP start and an older bonus name. No product was edited in this task.
- Confirm product/channel availability, digital/nonshipping and inventory-policy configuration separately. Zero inventory alone does not establish sellability of an untracked digital ticket.
- Verify GA access/replay delivery and VIP main-workshop-plus-Zoom delivery independently of marketing consent. Keep the optional Klaviyo PDF flow separate. No workflow is changed or activated here.
- Review actual tracking, consent, UTM attribution and completed-order Purchase behavior using the existing integration during an authorized test process. This revision never emits a Purchase event or rewrites campaign query parameters. Fixture tests cannot establish actual attribution or delivery.

Dylan merges manually. Check which Shopify theme is connected to `main` before merging, because merge may sync theme code. Publication, product availability and automation activation remain separate decisions.
