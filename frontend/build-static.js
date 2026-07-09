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
const SITE       = 'https://californiacooperagehottubs.com';
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
      "California Cooperage — the original American hot tub brand since 1972. Explore the CR1, CR2, and CR3 rotomold spas with Balboa controls, full-foam insulation, and California heritage. Plug-and-play simplicity, built to last.",
    priority: '1.0',
    changefreq: 'weekly'
  },
  {
    id: 'cr1',
    slug: 'CR1',
    pageDivId: 'page-cr1',
    outPath: path.join('CR1', 'index.html'),
    title: 'CR1 Hot Tub — 5-Person Rectangular Spa | California Cooperage',
    description:
      'The CR1 is a compact 5-person rectangular hot tub at 69" × 60" × 30" with 14 jets, Balboa controls, 3 kW heater, and full-foam insulation. Fits standard decks and patios.',
    priority: '0.9',
    changefreq: 'monthly'
  },
  {
    id: 'cr2',
    slug: 'CR2',
    pageDivId: 'page-cr2',
    outPath: path.join('CR2', 'index.html'),
    title: 'CR2 Hot Tub — 7-Person Flagship Square Spa | California Cooperage',
    description:
      'The CR2 is our 7-person flagship square hot tub at 81" × 81" × 32". 25 jets, 2 pillows, water diverter, Balboa controls — the spa that owns the backyard.',
    priority: '0.9',
    changefreq: 'monthly'
  },
  {
    id: 'cr3',
    slug: 'CR3',
    pageDivId: 'page-cr3',
    outPath: path.join('CR3', 'index.html'),
    title: 'CR3 Hot Tub — 6-Person Round Spa | California Cooperage',
    description:
      'The CR3 is a 6-person round hot tub at 80" × 80" × 32". 21 perimeter jets, Balboa controls, full-foam insulation — no bad seat in the house.',
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

  return html;
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

// ── Emit HTML files ────────────────────────────────────────────
let written = 0;
for (const route of ROUTES) {
  const html = renderForRoute(master, route);
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

console.log('[build-static] done —', written, 'route file(s) + sitemap.xml');
