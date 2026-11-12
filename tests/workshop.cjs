const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { Liquid } = require('liquidjs');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const template = JSON.parse(fs.readFileSync(path.join(root, 'templates/page.meta-ads-workshop.json')));
const config = template.sections.workshop;
const section = { id: 'test-workshop', settings: config.settings, blocks: Object.values(config.blocks) };
const product = { id: 15223839752380, variants: [
  { id: 71174015025340, sku: 'META-WK-GA', price: 2700, available: true },
  { id: 71174015058108, sku: 'META-WK-VIP', price: 5700, available: true }
] };
const transform = (source) => source
  .replace(/{% schema %}[\s\S]*?{% endschema %}/g, '')
  .replace(/{% doc %}[\s\S]*?{% enddoc %}/g, '')
  .replace(/{%-? form 'product', workshop, id: form_id, class: 'djk-workshop__form', return_to: routes.cart_url -?%}/g,
    '<form method="post" action="/cart/add" id="{{ form_id }}" class="djk-workshop__form"><input type="hidden" name="return_to" value="{{ routes.cart_url }}">')
  .replace(/{%-? endform -?%}/g, '</form>');
const engine = new Liquid({
  relativeReference: false,
  globals: { routes: { cart_url: '/cart' } },
  fs: {
    existsSync: () => true,
    readFileSync: (file) => transform(fs.readFileSync(path.join(root, 'snippets', path.basename(file)), 'utf8')),
    exists: async () => true,
    readFile: async (file) => transform(fs.readFileSync(path.join(root, 'snippets', path.basename(file)), 'utf8')),
    resolve: (_, file) => file + '.liquid'
  }
});
engine.registerFilter('asset_url', (v) => '/assets/' + v);
engine.registerFilter('stylesheet_tag', (v) => `<link rel="stylesheet" href="${v}">`);
engine.registerFilter('money', (v) => `$${(v / 100).toFixed(2)}`);
engine.registerFilter('money_without_trailing_zeros', (v) => `$${Number((v / 100).toFixed(2))}`);
engine.registerFilter('image_url', () => '/fixture.svg');
engine.registerFilter('image_tag', (_, ...args) => {
  const options = Object.fromEntries(args);
  return `<img src="/fixture.svg" width="900" height="600" class="${options.class || ''}" alt="Image fixture" loading="${options.loading}">`;
});
async function render(workshop = product, items = [], overrides = {}) {
  const data = structuredClone(section);
  Object.assign(data.settings, overrides.settings);
  if (overrides.blocks) data.blocks.push(...overrides.blocks);
  return engine.parseAndRender(transform(fs.readFileSync(path.join(root, 'sections/djk-workshop.liquid'), 'utf8')), {
    section: data, all_products: { 'meta-ads-for-musicians-live-2-hour-workshop': workshop }, cart: { items }, routes: { cart_url: '/cart' }
  });
}
(async () => {
  const script = fs.readFileSync(path.join(root, 'assets/djk-workshop.js'), 'utf8');
  async function dom(workshop = product, items = [], overrides = {}) {
    const instance = new JSDOM(await render(workshop, items, overrides), { url: 'https://workshop.test/?utm_source=facebook', runScripts: 'outside-only' });
    instance.window.eval(script);
    return instance;
  }
  for (const [tier, id] of [['ga', '71174015025340'], ['vip', '71174015058108']]) {
    const instance = await dom();
    const { window } = instance;
    const form = window.document.querySelector(`#WorkshopForm-test-workshop-${tier}`);
    const data = new window.FormData(form);
    assert.equal(form.method, 'post');
    assert.equal(new URL(form.action).pathname, '/cart/add');
    assert.equal(data.get('id'), id);
    assert.equal(data.get('quantity'), '1');
    assert.equal(data.get('return_to'), '/cart');
    const submit = () => form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    assert.equal(submit(), true);
    assert.equal(submit(), false);
    const other = window.document.querySelector(`.djk-workshop__form:not(#${form.id})`);
    assert.equal(other.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true })), false);
    assert.equal(window.document.querySelector('[role="status"]').textContent, 'Adding your ticket…');
    instance.window.close();
  }
  let instance = await dom(product, [{ product_id: product.id }]);
  assert.equal(instance.window.document.querySelectorAll('.djk-workshop__form').length, 0);
  assert.equal(instance.window.document.querySelectorAll('.djk-workshop__ticket a[href="/cart"]').length, 2);
  instance.window.close();
  instance = await dom({});
  assert.equal(instance.window.document.querySelectorAll('.djk-workshop__ticket button:disabled').length, 2);
  instance.window.close();
  for (const tier of [0, 1]) {
    const sold = structuredClone(product);
    sold.variants[tier].available = false;
    instance = await dom(sold);
    assert.equal(instance.window.document.querySelectorAll('.djk-workshop__form').length, 1);
    assert.equal(instance.window.document.querySelectorAll('.djk-workshop__ticket button:disabled').length, 1);
    instance.window.close();
  }
  const wrong = structuredClone(product);
  wrong.variants.forEach(v => v.sku = 'WRONG');
  instance = await dom(wrong);
  assert.equal(instance.window.document.querySelectorAll('.djk-workshop__form').length, 0);
  instance.window.close();
  instance = await dom();
  const { window } = instance;
  assert.equal(window.document.querySelectorAll('h1').length, 1);
  assert.equal(window.document.querySelectorAll('.djk-workshop__topic').length, 6);
  assert.equal(window.document.querySelectorAll('details summary').length, 6);
  assert.deepEqual([...window.document.querySelectorAll('[data-workshop-part]')].map(node => node.dataset.workshopPart),
    ['hero', 'proof', 'tickets', 'learning', 'instructor', 'faq', 'final']);
  assert.equal(window.document.querySelectorAll('.djk-workshop__evidence').length, 0);
  assert.match(window.document.querySelector('.djk-workshop__price-summary').textContent, /General Admission \$27[\s\S]*VIP \$57 total/);
  assert.equal(window.document.querySelector('.djk-workshop__amount').textContent.trim(), '$27.00');
  assert.equal(window.document.querySelector('.djk-workshop__currency').textContent, 'USD');
  assert.equal(window.document.querySelector('.djk-workshop__total').textContent, 'total');
  const hero = window.document.querySelector('[data-workshop-part="hero"]');
  const heroPhoto = hero.querySelector('.djk-workshop__photo img');
  assert.equal(heroPhoto.getAttribute('loading'), 'eager');
  assert.ok(hero.querySelector('[data-workshop-scroll]').compareDocumentPosition(heroPhoto) & window.Node.DOCUMENT_POSITION_FOLLOWING);
  assert.match(window.document.querySelector('.djk-workshop__ticket-section').textContent, /3:30–4:30 PM Central/);
  const target = window.document.querySelector('#WorkshopTickets-test-workshop');
  let scroll;
  target.scrollIntoView = options => { scroll = options; };
  window.matchMedia = () => ({ matches: true });
  window.document.querySelector('[data-workshop-scroll]').click();
  assert.equal(window.document.activeElement, target);
  assert.equal(scroll.behavior, 'instant');
  instance.window.close();
  const withFallbackImage = structuredClone(product);
  withFallbackImage.featured_image = { alt: 'Event poster should not appear' };
  instance = await dom(withFallbackImage, [], { settings: { hero_image: null }, blocks: [{ type: 'proof', settings: {} }] });
  assert.equal(instance.window.document.querySelectorAll('.djk-workshop__photo').length, 0);
  assert.equal(instance.window.document.querySelectorAll('.djk-workshop__evidence').length, 0);
  instance.window.close();
  instance = await dom(product, [], { blocks: [{ type: 'proof', settings: { title: 'Approved example', text: '<p>Supplied evidence</p>', image: { fixture: true } } }] });
  assert.equal(instance.window.document.querySelectorAll('.djk-workshop__evidence').length, 1);
  assert.equal(instance.window.document.querySelector('.djk-workshop__evidence img').getAttribute('loading'), 'lazy');
  instance.window.close();
  const repriced = structuredClone(product);
  repriced.variants[0].price = 2900;
  instance = await dom(repriced);
  assert.match(instance.window.document.querySelector('.djk-workshop__price-summary').textContent, /General Admission \$29/);
  assert.equal(instance.window.document.querySelector('.djk-workshop__amount').textContent.trim(), '$29.00');
  instance.window.close();
  console.log('PASS: section order; hero photo and missing-photo behavior; early live prices; price/currency separation; optional proof images; VIP timing; both ticket form payloads; repeat and cross-tier submit prevention; existing-cart guard; missing product; each sold-out tier; wrong SKUs; six topics and FAQs; reduced-motion anchor focus.');
  console.log('LiquidJS/JSDOM fixtures emulate Shopify form tags and image filters. No network cart request, charge, layout rendering, real Shopify checkout, tracking or email test is performed.');
})().catch(error => { console.error(error); process.exit(1); });
