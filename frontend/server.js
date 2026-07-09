#!/usr/bin/env node
/**
 * Tiny wrapper around serve-handler that adds a case-sensitive redirect
 * for /CR1 → /cr1 (etc). serve.json's redirects use path-to-regexp which
 * is case-insensitive, so we can't express "match uppercase only" there —
 * doing it here in ~5 lines is the simplest correct fix.
 */

const http    = require('http');
const path    = require('path');
const fs      = require('fs');
const handler = require('serve-handler');

const ROOT = __dirname;
const PORT = 3000;
const HOST = '0.0.0.0';

// Load serve.json once so serve-handler can honor rewrites/headers/redirects
const config = fs.existsSync(path.join(ROOT, 'serve.json'))
  ? JSON.parse(fs.readFileSync(path.join(ROOT, 'serve.json'), 'utf8'))
  : {};

// Case-sensitive product-page redirect: /CR1 → /cr1
const UPPERCASE_CR = /^\/(CR[123])(\/?)(\?.*)?$/;

const server = http.createServer((req, res) => {
  const url = req.url || '/';
  const m = UPPERCASE_CR.exec(url);
  if (m) {
    const slug = m[1].toLowerCase();
    const qs   = m[3] || '';
    const dest = '/' + slug + qs;
    res.writeHead(301, {
      Location: dest,
      'Cache-Control': 'public, max-age=3600'
    });
    res.end();
    return;
  }
  handler(req, res, config);
});

server.listen(PORT, HOST, () => {
  console.log(`[server] California Cooperage static site listening on http://${HOST}:${PORT}`);
});
