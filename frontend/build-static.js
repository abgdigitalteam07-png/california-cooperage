#!/usr/bin/env node
/**
 * Pre-render build script for the California Cooperage SPA.
 *
 * Reads the master /index.html and produces one physical HTML file per
 * canonical route, with the correct <title>, <meta name="description">,
 * <link rel="canonical">, and its .page div already marked .active — so
 * crawlers and non-JS clients see real content, not just an app shell.
 *
 * Also emits /sitemap.xml derived from the same route list.
 */

const fs   = require('fs');
const path = require('path');

const ROOT       = __dirname;
const MASTER     = path.join(ROOT, 'index.html');
// Canonical site URL used for <link rel="canonical">, sitemap.xml, OG tags,
// and JSON-LD structured data. Override via env for staging/preview builds;
// production must publish canonicals at the real customer-facing domain.
const SITE       = process.env.SITE_URL || 'https://californiacooperagehottubs.com';
const LASTMOD    = new Date().toISOString().slice(0, 10);

// ── Route definitions ─────────────────────────────────────────
// Note: "home" writes back to /index.html so the master file also gets
// canonical + description tags on the root URL.
const ROUTES = [
  {
    id: 'home',
    slug: '',
    pageDivId: 'page-home',
    outPath: 'index.html',
    title: "California Cooperage — California's Original Hot Tub Since 1972",
    description:
      "Explore the CR1, CR2, and CR3 hot tubs from California Cooperage — America's original rotomold spa brand since 1972. Plug-and-play simple, built to last.",
    priority: '1.0',
    changefreq: 'weekly'
  },
  {
    id: 'cr1',
    slug: 'cr1',
    pageDivId: 'page-cr1',
    outPath: path.join('cr1', 'index.html'),
    title: 'CR1 Hot Tub — 5-Person Rectangular Spa | California Cooperage',
    description:
      'The CR1 is a compact 5-person rectangular hot tub. 69" × 60" × 30", 14 jets, Balboa controls, 1kW (120V) or 4kW (240V), full-foam insulation.',
    heroImage: 'cc-assets/cr1-hero-lifestyle.jpg',
    product: {
      name: 'CR1 Hot Tub',
      model: 'CR1',
      properties: [
        { name: 'Seating Capacity', value: '5 Persons' },
        { name: 'Shape',            value: 'Rectangular' },
        { name: 'Dimensions',       value: '69" × 60" × 30"' },
        { name: 'Total Jets',       value: '14' },
        { name: 'Heater',           value: '1 kW (120V) / 4 kW (240V)' },
        { name: 'Control System',   value: 'Balboa' },
        { name: 'Insulation',       value: 'Full Foam' },
        { name: 'Dry Weight',       value: '~309 lbs' },
        { name: 'Filled Weight',    value: '~1,720 lbs' }
      ]
    },
    priority: '0.9',
    changefreq: 'monthly'
  },
  {
    id: 'cr2',
    slug: 'cr2',
    pageDivId: 'page-cr2',
    outPath: path.join('cr2', 'index.html'),
    title: 'CR2 Hot Tub — 7-Person Flagship Square Spa | California Cooperage',
    description:
      'The CR2 is our 7-person flagship square hot tub at 81" × 81" × 32". 25 jets, 2 pillows, water diverter, Balboa controls — the spa that owns the backyard.',
    heroImage: 'cc-assets/cr2-lifestyle-family.jpg',
    product: {
      name: 'CR2 Hot Tub',
      model: 'CR2',
      properties: [
        { name: 'Seating Capacity', value: '7 Persons' },
        { name: 'Shape',            value: 'Square' },
        { name: 'Dimensions',       value: '81" × 81" × 32"' },
        { name: 'Total Jets',       value: '25' },
        { name: 'Heater',           value: '1 kW (120V) / 4 kW (240V)' },
        { name: 'Control System',   value: 'Balboa' },
        { name: 'Insulation',       value: 'Full Foam' },
        { name: 'Dry Weight',       value: '~441 lbs' },
        { name: 'Filled Weight',    value: '~2,426 lbs' }
      ]
    },
    priority: '0.9',
    changefreq: 'monthly'
  },
  {
    id: 'cr3',
    slug: 'cr3',
    pageDivId: 'page-cr3',
    outPath: path.join('cr3', 'index.html'),
    title: 'CR3 Hot Tub — 6-Person Round Spa | California Cooperage',
    description:
      'The CR3 is a 6-person round hot tub at 80" × 80" × 32". 21 perimeter jets, Balboa controls, full-foam insulation — no bad seat in the house.',
    heroImage: 'cc-assets/cr3-hero-lifestyle.jpg',
    product: {
      name: 'CR3 Hot Tub',
      model: 'CR3',
      properties: [
        { name: 'Seating Capacity', value: '6 Persons' },
        { name: 'Shape',            value: 'Round' },
        { name: 'Dimensions',       value: '80" × 80" × 32"' },
        { name: 'Total Jets',       value: '21' },
        { name: 'Heater',           value: '1 kW (120V) / 4 kW (240V)' },
        { name: 'Control System',   value: 'Balboa' },
        { name: 'Insulation',       value: 'Full Foam' },
        { name: 'Dry Weight',       value: '~529 lbs' },
        { name: 'Filled Weight',    value: '~2,293 lbs' }
      ]
    },
    priority: '0.9',
    changefreq: 'monthly'
  },
  {
    id: 'warranty',
    slug: 'warranty',
    pageDivId: 'page-warranty',
    outPath: path.join('warranty', 'index.html'),
    title: 'Warranty & Documentation — California Cooperage Hot Tubs',
    description:
      'California Cooperage warranty terms, spa care guides, and technical documentation for the CR1, CR2, and CR3 rotomold hot tubs.',
    priority: '0.6',
    changefreq: 'yearly'
  },
  {
    id: 'find-a-dealer',
    slug: 'find-a-dealer',
    pageDivId: 'page-find-a-dealer',
    outPath: path.join('find-a-dealer', 'index.html'),
    title: 'Find a California Cooperage Dealer Near You',
    description:
      'Locate an authorized California Cooperage dealer and request information about the CR1, CR2, and CR3 hot tubs. Serving customers across the US and Canada.',
    priority: '0.7',
    changefreq: 'monthly'
  }
];

// ── Read master template ──────────────────────────────────────
if (!fs.existsSync(MASTER)) {
  console.error('[build-static] master index.html not found at', MASTER);
  process.exit(1);
}
const master = fs.readFileSync(MASTER, 'utf8');

// Locate the .page divs in the master. Each is
//   <section class="page[ active]" id="page-XYZ">
// We flip whichever one should be active for this route.
function renderForRoute(master, route) {
  let html = master;

  // 1. Replace <title>
  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(route.title)}</title>`
  );

  // 2. Inject/replace <meta name="description">
  const descTag = `<meta name="description" content="${escapeAttr(route.description)}" />`;
  if (/<meta\s+name=["']description["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, descTag);
  } else {
    html = html.replace(/<title>/i, descTag + '\n  <title>');
  }

  // 3. Inject/replace <link rel="canonical">
  const canonicalUrl = SITE + '/' + route.slug;
  const canonicalTag = `<link rel="canonical" href="${escapeAttr(canonicalUrl)}" />`;
  if (/<link\s+rel=["']canonical["'][^>]*>/i.test(html)) {
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, canonicalTag);
  } else {
    html = html.replace(/<title>/i, canonicalTag + '\n  <title>');
  }

  // 4. Open-graph + Twitter card tags (helps social previews per URL)
  const ogTags = [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${escapeAttr(canonicalUrl)}" />`,
    `<meta property="og:title" content="${escapeAttr(route.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(route.description)}" />`,
    `<meta property="og:image" content="${SITE}/cc-assets/homepage-hero-deco.png" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`,
    `<meta name="twitter:image" content="${SITE}/cc-assets/homepage-hero-deco.png" />`
  ].join('\n  ');
  // Strip existing OG/Twitter tags first (idempotent regen)
  html = html.replace(/\n\s*<meta\s+property=["']og:[^"']+["'][^>]*>/gi, '');
  html = html.replace(/\n\s*<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, '');
  html = html.replace(/<title>/i, ogTags + '\n  <title>');

  // 4b. JSON-LD structured data
  const jsonLdBlocks = buildJsonLd(route, master);
  // Strip any existing JSON-LD blocks first (idempotent regen)
  html = html.replace(/\n\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');
  if (jsonLdBlocks.length) {
    const jsonLdMarkup = jsonLdBlocks
      .map(obj => `<script type="application/ld+json">${JSON.stringify(obj, null, 2)}</script>`)
      .join('\n  ');
    html = html.replace(/<title>/i, jsonLdMarkup + '\n  <title>');
  }

  // 5. Flip .page.active to the correct section for this route.
  // Master markup is `<div id="page-XYZ" class="page[ active]">` (id before class).
  // First, strip .active from every .page div.
  html = html.replace(
    /(<div\s+id="page-[a-z0-9-]+"\s+class="page)\s+active(")/gi,
    '$1$2'
  );
  // Then add .active on the target page div.
  const activePattern = new RegExp(
    `(<div\\s+id="${escapeRegex(route.pageDivId)}"\\s+class="page)(")`,
    'i'
  );
  html = html.replace(activePattern, '$1 active$2');

  // 6. Enforce exactly one <h1> per pre-rendered page for SEO.
  // The master tags each per-page hero heading with class="page-hero".
  // For the active route, ensure that hero is <h1>; for inactive ones,
  // ensure it is <h2>. This is idempotent regardless of the master's
  // current tag state, so the build is safe to re-run even when the
  // home render writes back to /index.html.
  html = normalizePageHeroHeadings(html, route.pageDivId);

  return html;
}

// Normalize <h1|h2 class="page-hero"> across the SPA's page divs.
// The active page div's hero becomes <h1>; every other page div's hero
// becomes <h2>. Self-healing (promotes h2→h1 or demotes h1→h2 as needed),
// so repeated invocations of the build are safe even though the home route
// overwrites the master file on disk.
function normalizePageHeroHeadings(html, activePageDivId) {
  const openerRe = /<div\s+id="(page-[a-z0-9-]+)"\s+class="page[^"]*">/gi;
  const boundaries = [];
  let m;
  while ((m = openerRe.exec(html)) !== null) {
    boundaries.push({ id: m[1], start: m.index });
  }
  if (!boundaries.length) return html;
  const footerIdx = html.search(/<footer\b/i);
  const endIdx = footerIdx !== -1 ? footerIdx : html.length;
  for (let i = 0; i < boundaries.length; i++) {
    boundaries[i].end = (i + 1 < boundaries.length)
      ? boundaries[i + 1].start
      : endIdx;
  }
  // Matches <h1 class="... page-hero ..."> or <h2 class="... page-hero ...">.
  // The class="page-hero" attribute is REQUIRED (not optional) — only the
  // stably-marked hero heading in each page div gets rewritten.
  const heroRe = /<h([12])(\s+[^>]*?\bclass="[^"]*\bpage-hero\b[^"]*"[^>]*)>([\s\S]*?)<\/h\1>/gi;
  const parts = [];
  let cursor = 0;
  for (const b of boundaries) {
    if (b.start > cursor) parts.push(html.slice(cursor, b.start));
    const section = html.slice(b.start, b.end);
    const targetTag = b.id === activePageDivId ? 'h1' : 'h2';
    parts.push(section.replace(heroRe, (_full, _lvl, attrs, inner) => {
      return `<${targetTag}${attrs}>${inner}</${targetTag}>`;
    }));
    cursor = b.end;
  }
  if (cursor < html.length) parts.push(html.slice(cursor));
  return parts.join('');
}

// Fail-fast post-build assertion: every pre-rendered file must have
// exactly one <h1> tag. Prevents silent SEO corruption from any future
// idempotency bug or master-file regression.
function assertSingleH1(filePath, html) {
  const count = (html.match(/<h1[\s>]/gi) || []).length;
  if (count !== 1) {
    throw new Error(
      `[build-static] H1 invariant violated in ${filePath}: expected 1, found ${count}`
    );
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>]/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]
  ));
}
function escapeAttr(str) {
  return String(str).replace(/[&<>"]/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]
  ));
}
function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── FAQ extraction ────────────────────────────────────────────
// Extracts { question, answer } pairs from the .page div of the given route.
function extractFaqs(master, pageDivId) {
  // Find the page div in the master and grab its inner HTML up to the next page div
  const startRe = new RegExp(`<div\\s+id="${escapeRegex(pageDivId)}"\\s+class="page[^"]*">`, 'i');
  const startMatch = startRe.exec(master);
  if (!startMatch) return [];
  const startIdx = startMatch.index + startMatch[0].length;
  // Slice until the next page opener OR end of file
  const nextPageRe = /<div\s+id="page-[a-z0-9-]+"\s+class="page[^"]*">/i;
  nextPageRe.lastIndex = startIdx;
  const rest = master.slice(startIdx);
  const nextMatch = nextPageRe.exec(rest);
  const scope = nextMatch ? rest.slice(0, nextMatch.index) : rest;

  const faqs = [];
  // Match each faq-item: question is text before <span class="faq-icon", answer is inside <div class="faq-answer"[optional attrs]>...</div>
  const itemRe = /<div class="faq-item">[\s\S]*?<button class="faq-question"[^>]*>([\s\S]*?)<span class="faq-icon"[\s\S]*?<div class="faq-answer"[^>]*>([\s\S]*?)<\/div>/gi;
  let m;
  while ((m = itemRe.exec(scope)) !== null) {
    const question = stripTags(m[1]).replace(/\s+/g, ' ').trim();
    const answer   = stripTags(m[2]).replace(/\s+/g, ' ').trim();
    if (question && answer) faqs.push({ question, answer });
  }
  return faqs;
}
function stripTags(s) { return String(s).replace(/<[^>]+>/g, ''); }

// ── JSON-LD blocks per route ──────────────────────────────────
function buildJsonLd(route, master) {
  const blocks = [];

  // Organization — on every page
  blocks.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'California Cooperage',
    url: SITE,
    logo: SITE + '/cc-assets/california-cooperage-logo-color.png',
    foundingDate: '1972',
    foundingLocation: {
      '@type': 'Place',
      name: 'Sonoma, California'
    },
    description: "California's original hot tub brand since 1972. Rotomold construction, Balboa controls, full-foam insulation.",
    sameAs: [
      'https://www.maaxsaunas.com/',
      'https://maaxchillers.com/'
    ]
  });

  const isProduct = route.id === 'cr1' || route.id === 'cr2' || route.id === 'cr3';
  if (isProduct && route.product) {
    // Product schema
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: route.product.name,
      image: SITE + '/' + route.heroImage,
      description: route.description,
      brand: {
        '@type': 'Brand',
        name: 'California Cooperage'
      },
      model: route.product.model,
      category: 'Hot Tub',
      additionalProperty: route.product.properties.map(p => ({
        '@type': 'PropertyValue',
        name: p.name,
        value: p.value
      })),
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceCurrency: 'USD',
        price: '0',
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'USD',
          valueAddedTaxIncluded: false,
          description: 'Contact an authorized California Cooperage dealer for current pricing.'
        },
        seller: {
          '@type': 'Organization',
          name: 'California Cooperage Authorized Dealer Network',
          url: SITE + '/find-a-dealer'
        },
        url: SITE + '/find-a-dealer'
      }
    });

    // BreadcrumbList schema
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE + '/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: route.product.model,
          item: SITE + '/' + route.slug
        }
      ]
    });
  }

  // FAQPage — on home + cr1/cr2/cr3
  if (route.id === 'home' || isProduct) {
    const faqs = extractFaqs(master, route.pageDivId);
    if (faqs.length) {
      blocks.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer
          }
        }))
      });
    }
  }

  return blocks;
}

// ── Emit HTML files ────────────────────────────────────────────
let written = 0;
for (const route of ROUTES) {
  const html = renderForRoute(master, route);
  assertSingleH1(route.outPath, html);
  const outFile = path.join(ROOT, route.outPath);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html, 'utf8');
  written++;
  console.log('[build-static] wrote', route.outPath, '(' + Buffer.byteLength(html) + ' bytes)');
}

// ── Emit sitemap.xml ───────────────────────────────────────────
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...ROUTES.map(r => {
    const loc = SITE + '/' + r.slug;
    return [
      '  <url>',
      `    <loc>${escapeHtml(loc)}</loc>`,
      `    <lastmod>${LASTMOD}</lastmod>`,
      `    <changefreq>${r.changefreq}</changefreq>`,
      `    <priority>${r.priority}</priority>`,
      '  </url>'
    ].join('\n');
  }),
  '</urlset>',
  ''
].join('\n');
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
console.log('[build-static] wrote sitemap.xml (' + ROUTES.length + ' urls)');

// ── Emit _redirects (Cloudflare Pages / Netlify format) ───────
// Production is served by a static CDN (Cloudflare Pages), so the Node
// server.js redirect logic never runs. This file replicates that logic at
// the CDN edge:
//   1. Force uppercase product slugs → lowercase with 301
//   2. Explicitly rewrite extensionless routes to their pre-rendered
//      /<slug>/index.html file. This MUST come before any SPA catch-all
//      the platform might inject, otherwise /cr1 falls through to
//      /index.html and users see the home page instead of the product.
const redirectLines = [];
// 1. Case-sensitive uppercase → lowercase 301s (must come first)
for (const route of ROUTES) {
  if (!route.slug) continue;
  const upper = route.slug.toUpperCase();
  if (upper !== route.slug) {
    redirectLines.push(`/${upper}  /${route.slug}  301!`);
    redirectLines.push(`/${upper}/  /${route.slug}  301!`);
  }
}
// 2. Explicit rewrites: /cr1 → /cr1/index.html (200), same for trailing slash
for (const route of ROUTES) {
  if (!route.slug) continue;
  redirectLines.push(`/${route.slug}  /${route.slug}/index.html  200`);
  redirectLines.push(`/${route.slug}/  /${route.slug}/index.html  200`);
}
const redirectsFile = redirectLines.join('\n') + '\n';
fs.writeFileSync(path.join(ROOT, '_redirects'), redirectsFile, 'utf8');
console.log('[build-static] wrote _redirects (' + redirectLines.length + ' rules)');

// ── Emit _headers (Cloudflare Pages / Netlify format) ─────────
// Cache policy:
//   /cc-assets/*   → 1 year, immutable (images, WebP, .glb 3D models — content-addressed by filename)
//   HTML routes    → no-cache, must-revalidate (so redeploys propagate immediately)
//   sitemap/robots → short cache (1 hour) so search engines re-fetch reasonably often
const headersFile = [
  '# Long-cache static assets (fingerprinted / rarely-changed)',
  '/cc-assets/*',
  '  Cache-Control: public, max-age=31536000, immutable',
  '',
  '# HTML — always revalidate so content edits go live on next request after redeploy',
  '/*.html',
  '  Cache-Control: public, max-age=0, must-revalidate',
  '',
  '/',
  '  Cache-Control: public, max-age=0, must-revalidate',
  '',
  ...ROUTES.filter(r => r.slug).flatMap(r => [
    `/${r.slug}`,
    '  Cache-Control: public, max-age=0, must-revalidate',
    '',
    `/${r.slug}/`,
    '  Cache-Control: public, max-age=0, must-revalidate',
    ''
  ]),
  '# SEO discovery files — short cache so crawlers pick up updates',
  '/sitemap.xml',
  '  Cache-Control: public, max-age=3600, must-revalidate',
  '  Content-Type: application/xml; charset=utf-8',
  '',
  '/robots.txt',
  '  Cache-Control: public, max-age=3600, must-revalidate',
  '  Content-Type: text/plain; charset=utf-8',
  '',
  '/llms.txt',
  '  Cache-Control: public, max-age=3600, must-revalidate',
  '  Content-Type: text/plain; charset=utf-8',
  '',
  '/llms-full.txt',
  '  Cache-Control: public, max-age=3600, must-revalidate',
  '  Content-Type: text/plain; charset=utf-8',
  ''
].join('\n');
fs.writeFileSync(path.join(ROOT, '_headers'), headersFile, 'utf8');
console.log('[build-static] wrote _headers');

// ── Emit /llms-full.txt (auto-derived from route content) ─────
// Full-content dossier for LLM crawlers (ChatGPT / Claude / Perplexity /
// Copilot). Consolidates per-route hero copy + spec tables + FAQs into a
// single Markdown file so AI answer engines can cite exact figures without
// having to fetch and parse individual HTML pages.
fs.writeFileSync(path.join(ROOT, 'llms-full.txt'), buildLlmsFull(master), 'utf8');
console.log('[build-static] wrote llms-full.txt');

console.log('[build-static] done —', written, 'route file(s) + sitemap.xml + _redirects + _headers + llms-full.txt');

// ─────────────────────────────────────────────────────────────
function buildLlmsFull(masterHtml) {
  const commonQuestions = [
    'Which hot tub is smallest? The CR1 at 69" × 60" × 30", seats 5.',
    'Which is largest? The CR2 at 81" × 81" × 32", seats 7.',
    'Which is round? The CR3 at 80" × 80" × 32", seats 6.',
    'What construction do all models use? Seamless rotomold polyethylene shell.',
    'What controls do all models use? Balboa (industry standard).',
    'What heater options are available? Dual-voltage 1kW (120V) or 4kW (240V) on all three models.',
    'How is California Cooperage sold? Through authorized dealer network across US and Canada.'
  ];
  const lines = [
    '# California Cooperage — Full Content',
    '> California Cooperage is the original American hot tub brand, founded in 1972 in Sonoma, California. We produce three rotomold hot tub models (CR1, CR2, CR3) with Balboa controls, full-foam insulation, and dual-voltage heaters. Products are sold through an authorized dealer network across the US and Canada.',
    '',
    '## Common Questions',
    ...commonQuestions.map(q => '- ' + q),
    ''
  ];
  const productLabelBySlug = { cr1: 'CR1', cr2: 'CR2', cr3: 'CR3' };
  for (const route of ROUTES) {
    const sectionHeading = route.h1 || route.title.split('—')[0].trim();
    const routeUrl = SITE + '/' + (route.slug || '');
    lines.push('## ' + sectionHeading);
    lines.push('URL: ' + routeUrl);
    if (route.description) lines.push(route.description);
    lines.push('');
    // Product specs (CR1/CR2/CR3 only)
    if (route.slug && productLabelBySlug[route.slug]) {
      const specs = extractSpecTable(masterHtml, productLabelBySlug[route.slug]);
      if (specs.length) {
        lines.push('### Specifications');
        for (const s of specs) lines.push('- ' + s.key + ': ' + s.value);
        lines.push('');
      }
    }
    // Route FAQ
    const faqs = extractFaqs(masterHtml, route.pageDivId);
    if (faqs.length) {
      lines.push('### Frequently Asked Questions');
      for (const f of faqs) {
        lines.push('Q: ' + f.question);
        lines.push('A: ' + f.answer);
        lines.push('');
      }
    }
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

// Extract rows from <table class="specs-table" aria-label="LABEL specification table">.
// Returns [{ key, value }, ...] with HTML entities decoded.
function extractSpecTable(masterHtml, productLabel) {
  const tableRe = new RegExp(
    `<table\\s+class="specs-table"\\s+aria-label="${escapeRegex(productLabel)} specification table">([\\s\\S]*?)</table>`,
    'i'
  );
  const tm = tableRe.exec(masterHtml);
  if (!tm) return [];
  const rowRe = /<tr>\s*<td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<\/tr>/gi;
  const rows = [];
  let m;
  while ((m = rowRe.exec(tm[1])) !== null) {
    const key = decodeEntities(stripTags(m[1])).replace(/\s+/g, ' ').trim();
    const value = decodeEntities(stripTags(m[2])).replace(/\s+/g, ' ').trim();
    if (key && value) rows.push({ key, value });
  }
  return rows;
}

function decodeEntities(s) {
  return String(s)
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}
