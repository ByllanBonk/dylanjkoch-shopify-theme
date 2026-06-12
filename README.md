# DylanJKoch.com Shopify Theme

A premium personal brand theme for Dylan J Koch: professional drummer, educator, and direct-to-fan strategist. Built on Shopify Dawn 15.3 with a full custom design system and 18 custom sections, all editable in the Shopify Theme Customizer. No code needed for day to day updates.

## Design system

- Deep cinematic dark palette: `#05070A` and `#0B1020` backgrounds, `#38BDF8` accent, `#D6B15E` gold, `#F8FAFC` text, `#94A3B8` muted text
- Space Grotesk headlines and Inter body text, loaded from Google Fonts (toggle under Theme settings, Dylan Koch brand)
- Glassmorphism cards, soft glows, ambient aurora gradients, scroll reveals, and an animated signal flow hero visual
- All motion respects reduced motion preferences and can be switched off globally in Theme settings

## Custom sections

Every section ships with schema settings for text, images, buttons, colors, and padding. Add them to any page from the section picker. All are prefixed `DJK`.

| Section | Purpose |
| --- | --- |
| DJK Hero | Full viewport homepage hero, photo mode by default with an optional signal flow animation mode, selectable in the editor |
| DJK Signal Flow | The animated signal flow graphic with explanatory copy, used lower on the homepage to show how attention becomes owned audience and revenue |
| DJK Page Hero | Interior page title block |
| DJK Meet Dylan | Intro with portrait, floating badge, and animated stats |
| DJK Featured Musician | Performance video or photo with gold highlight cards for touring, recording, and teaching |
| DJK Rented vs Owned | Two panel comparison of rented and owned attention |
| DJK Lead Magnet | Playbook email capture with floating book visual |
| DJK Capture Form | First name, email, phone, and consent capture with Shopify mode or a custom endpoint for MailerLite, Klaviyo, and others |
| DJK Landing Hero | Lead generation hero with the capture form above the fold, book mockup or custom visual, and optional background image or video |
| DJK Ownership Flow | Rented platforms flowing into owned channels with an animated arrow |
| DJK Statement | Centered positioning statement |
| DJK Content Cards | Large cards with kicker, title, and bullet list, used for what's inside |
| DJK ACEMM Showcase | Five connected stage cards presenting the ACEMM framework |
| DJK Steps | Numbered next-step cards with optional gold highlight |
| DJK Framework | Expandable accordion, used for ACEMM, work topics, process steps, and FAQs |
| DJK Results | Case study metric cards |
| DJK Work With Me | Three service cards with optional gold highlight |
| DJK Offer | Price, duration, and included checklist card for paid offers like the Strategy Intensive |
| DJK Audience Cards | Check and cross card lists for who this is for, deliverables, and outcomes |
| DJK Testimonials | Quote cards with name, role, and optional photo |
| DJK Drumming Feature | Drummer spotlight with video or photo |
| DJK Live Dates | Bandsintown style listing with artist or project per date, country, ticket links, sold out and featured states |
| DJK Featured Shop | Product grid from any collection plus an optional featured product spotlight |
| DJK Content Hub | Resource cards, category link chips, featured wide cards, and an optional blog feed |
| DJK Final CTA | Closing email capture and call to action |
| DJK Story Chapters | Documentary style alternating chapters (About page) |
| DJK Media Gallery | Mixed video and photo grid for the EPK |
| DJK Press Kit | Downloadable assets and press quotes |
| DJK Contact | Contact form with channel cards and topic dropdown |
| DJK Marquee | Scrolling credibility strip |

## One time store setup

1. **Pages**: in Shopify admin create pages with these exact handles and assign the matching template: `about` (page.about), `coaching` (page.coaching), `drumming` (page.drumming), `resources` (page.resources), `playbook` (page.playbook), `contact` (page.contact).
2. **Navigation**: edit the `main-menu` to Home, About, Coaching, Drumming, Resources, Shop, Contact. The header CTA button (Get The Playbook) is set under the Header section settings and points to /pages/playbook.
3. **Email and SMS capture**: every capture surface (the Playbook landing hero, the capture sections) shares one form layer in `snippets/djk-capture-fields.liquid`. In Shopify mode leads are stored as customers with an editable tag, which syncs to Klaviyo, MailerLite, Zapier, Make, n8n, or anything that reads Shopify customers. In custom mode, paste any platform's form endpoint and field names (MailerLite, Klaviyo, ConvertKit, ActiveCampaign, HubSpot, GoHighLevel, custom APIs) into the section settings. Switching platforms never requires rebuilding the page.
4. **The Strategy Intensive**: the coaching page sells a 90 minute paid session at $297. Price, duration, inclusions, and every line of copy are editable in the DJK Offer and surrounding sections.
5. **Shop**: create a collection and pick it in the DJK Featured Shop section. Optionally pick a featured product for the spotlight card.
6. **Live dates**: set the default artist (Koch Marshall Trio) once per section, then override per date for side projects or guest appearances. Mark big shows as featured.
7. **Press kit files**: upload PDFs and ZIPs under Content, then Files, and paste the links into the DJK Press Kit blocks.
8. **Photos and video**: every media slot shows a labeled placeholder until you upload an image or paste a YouTube or Vimeo URL in the editor. The homepage hero is set to photo mode; upload a portrait or switch it back to the signal animation in the hero settings.

## Everyday editing

Everything below happens in Online Store, Themes, Customize:

- Headlines, subheadlines, buttons, and copy: click any section and edit its settings
- Live dates: open the Live Dates section and add, edit, or remove date blocks
- Results and testimonials: blocks inside DJK Results and DJK Press Kit
- Brand colors, fonts, and motion: Theme settings, Dylan Koch brand
- Section visibility: hide or reorder sections from the left sidebar

## Development

Standard Dawn workflow:

```sh
shopify theme dev    # local preview
shopify theme push   # deploy
```

Custom code lives in `assets/djk-theme.css`, `assets/djk.js`, `snippets/djk-newsletter-form.liquid`, and `sections/djk-*.liquid`.
