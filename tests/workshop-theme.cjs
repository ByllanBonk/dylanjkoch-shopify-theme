const fs = require('node:fs');
const path = require('node:path');
const { fileURLToPath } = require('node:url');
const { getThemeAndConfig, NodeFileSystem } = require('@shopify/theme-check-node');
const { check, JSONValidator, toSchema, extractDocDefinition, filePathSupportsLiquidDoc } = require('@shopify/theme-check-common');
const rejectNetwork = () => { throw new Error('This check is offline: network access is disabled.'); };
global.fetch = rejectNetwork;
for (const module of ['node:http', 'node:https']) {
  require(module).request = rejectNetwork;
  require(module).get = rejectNetwork;
}
const root = path.resolve(__dirname, '..');
const dataDir = path.resolve(path.dirname(require.resolve('@shopify/theme-check-docs-updater')), '../data');
const read = name => fs.readFileSync(path.join(dataDir, `${name}.json`), 'utf8');
const docset = {
  filters: async () => JSON.parse(read('filters')),
  objects: async () => JSON.parse(read('objects')),
  liquidDrops: async () => JSON.parse(read('objects')),
  tags: async () => JSON.parse(read('tags')),
  systemTranslations: async () => JSON.parse(read('shopify_system_translations')),
  schemas: async () => JSON.parse(read('manifest_theme')).schemas.map(entry => ({
    uri: `https://offline.invalid/schemas/${entry.uri}`,
    fileMatch: entry.fileMatch,
    schema: read(path.basename(entry.uri, '.json'))
  }))
};
(async () => {
  const { theme, config } = await getThemeAndConfig(root);
  const validator = await JSONValidator.create(docset, config);
  const sourceFor = (dir, name) => theme.find(source => fileURLToPath(source.uri) === path.join(root, dir, `${name}.liquid`));
  const schemaFor = async (dir, name) => {
    const source = sourceFor(dir, name);
    return source && toSchema(config.context, source.uri, source, validator.isValid);
  };
  const offenses = await check(theme, config, {
    fs: NodeFileSystem,
    themeDocset: docset,
    jsonValidationSet: docset,
    getSectionSchema: name => schemaFor('sections', name),
    getBlockSchema: name => schemaFor('blocks', name),
    getAppBlockSchema: name => schemaFor('blocks', name),
    getDocDefinition: async relative => {
      const source = theme.find(source => fileURLToPath(source.uri) === path.join(root, relative));
      return source && filePathSupportsLiquidDoc(source.uri) ? extractDocDefinition(source.uri, source.ast) : undefined;
    },
    remoteFileSize: async () => 0
  });
  const files = new Set(['sections/djk-workshop.liquid', 'snippets/djk-workshop-ticket.liquid', 'templates/page.meta-ads-workshop.json', 'assets/djk-workshop.css', 'assets/djk-workshop.js']);
  const relevant = offenses.filter(offense => files.has(path.relative(root, fileURLToPath(offense.uri))));
  relevant.forEach(offense => console.log(`${path.relative(root, fileURLToPath(offense.uri))}: ${offense.check} [${offense.severity}] ${offense.message}`));
  if (relevant.some(offense => offense.severity === 0 || offense.severity === 1)) process.exitCode = 1;
  console.log(`Offline Shopify Theme Check: ${relevant.length} findings in workshop theme files. Bundled schemas only; no network calls or source uploads.`);
})().catch(error => { console.error(error); process.exit(1); });
