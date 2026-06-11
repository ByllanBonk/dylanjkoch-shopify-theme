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
| DJK Hero | Full viewport homepage hero with animated signal flow visual |
| DJK Page Hero | Interior page title block |
| DJK Meet Dylan | Intro with portrait, floating badge, and animated stats |
| DJK Rented vs Owned | Two panel comparison of rented and owned attention |
| DJK Lead Magnet | Playbook email capture with floating book visual |
| DJK Framework | Expandable accordion, used for ACEMM, process steps, and FAQs |
| DJK Results | Case study metric cards |
| DJK Work With Me | Three service cards with optional gold highlight |
| DJK Drumming Feature | Drummer spotlight with video or photo |
| DJK Live Dates | Bandsintown style show listing with ticket links |
| DJK Featured Shop | Product grid pulled from any collection |
| DJK Content Hub | Resource cards plus optional blog feed |
| DJK Final CTA | Closing email capture and call to action |
| DJK Story Chapters | Documentary style alternating chapters (About page) |
| DJK Media Gallery | Mixed video and photo grid for the EPK |
| DJK Press Kit | Downloadable assets and press quotes |
| DJK Contact | Contact form with channel cards and topic dropdown |
| DJK Marquee | Scrolling credibility strip |

## One time store setup

1. **Pages**: in Shopify admin create pages with these exact handles and assign the matching template: `about` (page.about), `coaching` (page.coaching), `drumming` (page.drumming), `resources` (page.resources), `contact` (page.contact).
2. **Navigation**: edit the `main-menu` to Home, About, Coaching, Drumming, Resources, Shop, Contact. The header CTA button (Get The Playbook) is set under the Header section settings.
3. **Email capture**: the Playbook and CTA forms use Shopify customer signup and tag subscribers `newsletter`. Connect Shopify Email, Klaviyo, or similar to deliver the actual Playbook download.
4. **Shop**: create a collection and pick it in the DJK Featured Shop section on the homepage.
5. **Press kit files**: upload PDFs and ZIPs under Content, then Files, and paste the links into the DJK Press Kit blocks.
6. **Photos and video**: every media slot shows a labeled placeholder until you upload an image or paste a YouTube or Vimeo URL in the editor.

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
