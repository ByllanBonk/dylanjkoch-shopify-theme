# Meta Ads for Musicians landing page review

This branch adds an isolated `page.meta-ads-workshop` JSON template. It does not create a Shopify Page, change the live theme, change products or automation, or publish anything. The proposed address is `/pages/meta-ads-workshop`.

## Files

| File | Purpose |
| --- | --- |
| `templates/page.meta-ads-workshop.json` | Populated workshop copy, six learning topics, six FAQs, existing instructor photo reference |
| `sections/djk-workshop.liquid` | Seven-part landing page and editable image, copy, timing and CTA settings |
| `snippets/djk-workshop-ticket.liquid` | Exact existing variant forms, availability checks and cart guard |
| `assets/djk-workshop.css` | Page-scoped responsive styling using existing type and spacing conventions |
| `assets/djk-workshop.js` | Reduced-motion-aware ticket anchors, duplicate submit lock and back-navigation refresh |
| `tests/workshop.cjs` | Isolated LiquidJS/JSDOM tests with no Shopify mutations or charges |
| `docs/meta-ads-workshop-review.md` | Review evidence, preview instructions and remaining Admin work |

Existing templates, global components, settings, fonts, pixels and consent code are untouched. Approximately 572 words of initial sales copy, excluding FAQs and unavailable/cart status messages. No new fonts, dependencies or tracking scripts ship to customers.

## Verified Shopify data

Read-only Admin product verification on November 12, 2026:

- Product `15223839752380`: Meta Ads for Musicians | Live 2-Hour Workshop. Status **DRAFT**.
- GA variant `71174015025340`, SKU `META-WK-GA`, USD 27.00.
- VIP variant `71174015058108`, SKU `META-WK-VIP`, USD 57.00 total.
- No product images returned. Approved workshop artwork must be assigned with the image picker. There is no generated substitute or customer-facing image placeholder. Without artwork the hero uses its text layout.
- Instructor image reuses the exact `shopify://shop_images/iU0O-yuA_02bee8a2-a15f-4fbf-ac07-30d89f7d5858.jpg` reference from the existing playbook page. Review that it resolves in the target store; the image picker can replace it.
- Existing product description still refers to a Zoom main workshop, an unannounced date, and an older bonus name. These need a separately approved Admin correction before launch.

Forms require the exact product ID, variant ID, SKU and availability. They use Shopify's product form with quantity one and normal cart navigation, where the customer continues through the existing checkout. Prices render from variant data when available; the draft/missing-product presentation shows the verified USD prices and disabled buttons. No hardcoded buy links bypass availability. Page CTA price copy should be reviewed if pricing changes later or if localized currency markets are enabled.

A server-rendered cart check replaces both purchase forms with review-cart links if any variant of this workshop is already in the cart. JavaScript blocks repeat submissions and switching tiers while submission is pending. Returning through the browser's back/forward cache reloads the cart state. This prevents common accidental duplicates on this page; it is not a store-wide quantity rule and does not prevent parallel tabs or manual additions elsewhere. No cart items are removed, replaced or silently cleared.

## Validation performed

- Shopify AI Toolkit's full-theme validator passed all five new theme files: section, snippet, JSON template, CSS and JavaScript. It used packaged fallback documentation/schema after the remote documentation refresh timed out.
- `node --check assets/djk-workshop.js` and `git diff --check` passed.
- Fixture tests exercise both form payloads, exact variant distinction, quantity one, cart return path, repeat and cross-tier submit prevention, existing cart, missing product, each sold-out tier, wrong SKUs, topic/FAQ counts, reduced-motion anchor behavior and focus.
- Tests emulate Shopify's form tag and image filters. They do not execute Shopify's own renderer or send a cart request. No payment or order was created.
- Chromium launch was blocked by this execution environment. Actual responsive rendering, keyboard accordion behavior, image loading, and real cart/checkout remain pending on the unpublished Shopify preview. CSS includes 750px and 990px breakpoints, single-column mobile tickets, explicit focus states and 54px minimum buttons.

Run the fixture checks outside the theme directory without adding storefront dependencies:

```sh
npm install --prefix /tmp/djk-workshop-tests liquidjs@10 jsdom@31
NODE_PATH=/tmp/djk-workshop-tests/node_modules node tests/workshop.cjs
node --check assets/djk-workshop.js
git diff --check
```

## Unpublished desktop and mobile review

Do this only when an unpublished review copy is authorized. Do not connect this feature branch to the live theme or publish it for review.

1. Load this branch into a separate unpublished copy of the existing theme. In its theme editor, use Pages > Create template only if needed to preview the existing `meta-ads-workshop` template, based on a page preview resource. The template file already exists; do not overwrite it with a blank template.
2. Select the existing `meta-ads-workshop` template in the editor's page-template selector. Keep the Shopify Page itself uncreated until approved; template preview can use another Page as its preview resource. If the editor requires a dedicated Page, create it hidden only with approval.
3. In **DJK Ads Workshop**, choose the approved workshop artwork and verify the reused Dylan photo. Both images and all copy/CTA labels are editable. Learning topics and FAQs are blocks.
4. Review the editor's desktop and mobile modes, then inspect 320px, 390px, 768px and 1440px widths in a browser. Check wrapping, horizontal overflow, button legibility, complete artwork, and the date/time/offer above the first CTA. No fixed/floating CTA obscures content.
5. Tab to each CTA and FAQ. Confirm visible focus, Enter/Space toggling on native summaries, ticket-section focus after anchors and reduced-motion behavior. Test with JavaScript disabled: native links, product forms and FAQs should still work.
6. With the real product still DRAFT, unavailable buttons are expected. An unpublished theme does not make a draft product buyable. Do not change status simply to test this PR. A real GA/VIP cart-to-checkout pass must wait for separately approved sellability or an appropriate test-store setup. Do not place a paid order.
7. When real checkout review is authorized, start with a clean cart; select GA; confirm exact variant and one ticket in cart and checkout, then stop before payment. Repeat VIP in a clean cart. Return to the landing page and confirm review-cart links prevent another addition. Check double-click and back-navigation behavior. Do not clear a customer's existing cart.

## Admin and launch dependencies

These are **not** completed or activated by this PR:

- Approve and configure the Shopify Page handle, title, SEO text, visibility and template assignment. Proposed handle: `meta-ads-workshop`, template: `page.meta-ads-workshop`.
- Assign approved workshop artwork and verify the instructor image. The product currently has no image fallback.
- Approve product-description corrections and product/channel availability separately. Check digital/nonshipping and inventory-policy configuration. Inventory count zero alone does not establish whether an untracked digital ticket is sellable.
- Confirm VIP Zoom start time/link and complete or verify VIP delivery. Verify GA delivery and replay instructions. The page states how access will be delivered but does not claim VIP email automation is already configured.
- Verify receipt at the checkout email for both ticket tiers, independently of marketing consent. Keep the optional Klaviyo PDF flow separate. No email workflow is modified here.
- Confirm actual pixel/consent behavior and UTM attribution in an authorized Shopify preview/checkout session. Existing tracking code is preserved; this implementation never calls `fbq`, emits a Purchase event, or strips/rewrites query parameters. Completed-order Purchase behavior and absence of duplicate events require the existing integration's test tools and a separately authorized test-order process. Fixture form tests cannot prove attribution or completed-order tracking.

The owner merges the PR manually. A merge can sync code into the Shopify theme connected to `main`; inspect that connection before merging. Page creation/publication and product availability are separate approval decisions.
