"""
Tests for the _headers file emitted by build-static.js (Cloudflare Pages
/ Netlify format).

Cloudflare Pages _headers spec:
  - A block starts with a URL/pattern on its own line (must start with `/`).
  - Header lines follow, indented by exactly 2 spaces: `  Name: value`.
  - A blank line ends a block.
  - Lines starting with `#` are comments.

Contract:
- File exists at /app/frontend/_headers
- /cc-assets/*  → `Cache-Control: public, max-age=31536000, immutable`
- /*.html + /   + every product/content slug (with and without trailing slash)
  → `Cache-Control: public, max-age=0, must-revalidate`
- /sitemap.xml  → short-cache + `Content-Type: application/xml; charset=utf-8`
- /robots.txt   → short-cache + `Content-Type: text/plain; charset=utf-8`
- Syntax: path lines start with /, header lines indented by exactly 2
  spaces, blank lines separate blocks.

Also regression-checks that /_redirects still emits 20 rules and that the
pre-rendered HTML files still contain the offers JSON-LD block.
"""
import json
import os
import re
import subprocess

import pytest

FRONTEND_DIR = "/app/frontend"
HEADERS_PATH = os.path.join(FRONTEND_DIR, "_headers")
REDIRECTS_PATH = os.path.join(FRONTEND_DIR, "_redirects")
SITEMAP_PATH = os.path.join(FRONTEND_DIR, "sitemap.xml")

CONTENT_SLUGS = ["cr1", "cr2", "cr3", "warranty", "find-a-dealer"]
PRODUCT_SLUGS = ["cr1", "cr2", "cr3"]

SHORT_CACHE = "public, max-age=0, must-revalidate"
LONG_CACHE = "public, max-age=31536000, immutable"
SEO_CACHE = "public, max-age=3600, must-revalidate"

JSONLD_RE = re.compile(
    r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
    re.DOTALL | re.IGNORECASE,
)


# -------- Fixtures ------------------------------------------------------

@pytest.fixture(scope="module", autouse=True)
def run_build():
    """Run build-static.js once for the whole module."""
    result = subprocess.run(
        ["node", "build-static.js"],
        cwd=FRONTEND_DIR,
        capture_output=True,
        text=True,
        timeout=60,
    )
    assert result.returncode == 0, (
        f"build-static.js failed: stdout={result.stdout} stderr={result.stderr}"
    )
    return result


@pytest.fixture(scope="module")
def headers_raw():
    with open(HEADERS_PATH, "r", encoding="utf-8") as f:
        return f.read()


@pytest.fixture(scope="module")
def parsed_blocks(headers_raw):
    """
    Parse the _headers file into a list of dicts:
        [{"path": "/cc-assets/*", "headers": {"Cache-Control": "..."}}, ...]

    Any parse-error raises pytest.fail so downstream assertions get a clean
    signal.
    """
    blocks = []
    current = None
    lines = headers_raw.split("\n")
    for lineno, raw in enumerate(lines, start=1):
        # Strip trailing whitespace only; leading whitespace is significant.
        line = raw.rstrip()
        if line == "":
            # Blank line ends the current block.
            if current is not None:
                blocks.append(current)
                current = None
            continue
        if line.lstrip().startswith("#"):
            # Comment — must not be indented (spec: comments at column 0).
            # Also comments should not be inside a block.
            if current is not None:
                pytest.fail(
                    f"Comment inside block at line {lineno}: {line!r}"
                )
            continue
        if line.startswith("  "):
            # Header line (must start with exactly 2 spaces).
            if current is None:
                pytest.fail(
                    f"Header line without preceding path at line {lineno}: "
                    f"{line!r}"
                )
            # Must be exactly 2 leading spaces, not 3+.
            if line.startswith("   "):
                pytest.fail(
                    f"Header line indented with more than 2 spaces at line "
                    f"{lineno}: {line!r}"
                )
            header_body = line[2:]
            if ":" not in header_body:
                pytest.fail(
                    f"Header line missing ':' at line {lineno}: {line!r}"
                )
            name, _, value = header_body.partition(":")
            current["headers"][name.strip()] = value.strip()
            continue
        if line.startswith("/"):
            # Path line — must not be indented.
            if current is not None:
                # Implicit end of previous block (no blank line separator).
                blocks.append(current)
            current = {"path": line, "headers": {}, "lineno": lineno}
            continue
        pytest.fail(
            f"Unrecognized line {lineno}: {line!r} (must start with /, 2 "
            f"spaces, #, or be blank)"
        )
    if current is not None:
        blocks.append(current)
    return blocks


@pytest.fixture(scope="module")
def blocks_by_path(parsed_blocks):
    d = {}
    for b in parsed_blocks:
        d[b["path"]] = b
    return d


# -------- File-existence & basic-format checks -------------------------

def test_headers_file_exists():
    assert os.path.isfile(HEADERS_PATH), f"{HEADERS_PATH} missing"


def test_headers_file_nonempty(headers_raw):
    assert headers_raw.strip(), "_headers file is empty"


def test_paths_start_with_slash(parsed_blocks):
    for b in parsed_blocks:
        assert b["path"].startswith("/"), (
            f"Path line does not start with /: {b['path']!r} "
            f"(line {b['lineno']})"
        )


def test_header_lines_have_exactly_two_space_indent(headers_raw):
    """
    Every non-blank line must be either:
      - a comment (starts with #)
      - a path (starts with /)
      - a header line indented with EXACTLY 2 spaces (not tabs, not 3+)
    """
    for lineno, raw in enumerate(headers_raw.split("\n"), start=1):
        if raw == "" or raw.strip() == "":
            continue
        if raw.startswith("#"):
            continue
        if raw.startswith("/"):
            continue
        # Must start with exactly 2 spaces, not 1, not 3, no tabs.
        assert raw.startswith("  ") and not raw.startswith("   "), (
            f"Line {lineno} not indented with exactly 2 spaces: {raw!r}"
        )
        assert "\t" not in raw[:2], (
            f"Line {lineno} uses tab indentation: {raw!r}"
        )


def test_blocks_separated_by_blank_lines(headers_raw):
    """
    A path line (unindented, starts with /) should be preceded by either
    the top-of-file, a comment, or a blank line — never immediately by a
    header line. This checks that the emitter uses blank-line separators
    between blocks.
    """
    lines = headers_raw.split("\n")
    for i, ln in enumerate(lines):
        if i == 0:
            continue
        if ln.startswith("/"):
            prev = lines[i - 1]
            assert (
                prev == ""
                or prev.startswith("#")
            ), (
                f"Path line at index {i+1} ({ln!r}) not preceded by blank "
                f"line or comment; previous line: {prev!r}"
            )


# -------- /cc-assets/* long-cache block --------------------------------

def test_cc_assets_block_exists(blocks_by_path):
    assert "/cc-assets/*" in blocks_by_path, (
        "Missing /cc-assets/* block for long-cache immutable assets"
    )


def test_cc_assets_has_long_cache(blocks_by_path):
    b = blocks_by_path["/cc-assets/*"]
    assert b["headers"].get("Cache-Control") == LONG_CACHE, (
        f"/cc-assets/* Cache-Control mismatch — expected {LONG_CACHE!r}, "
        f"got {b['headers'].get('Cache-Control')!r}"
    )


# -------- HTML short-cache blocks --------------------------------------

def test_html_glob_block_exists(blocks_by_path):
    assert "/*.html" in blocks_by_path, "Missing /*.html glob block"


def test_html_glob_has_short_cache(blocks_by_path):
    b = blocks_by_path["/*.html"]
    assert b["headers"].get("Cache-Control") == SHORT_CACHE, (
        f"/*.html Cache-Control mismatch — expected {SHORT_CACHE!r}, "
        f"got {b['headers'].get('Cache-Control')!r}"
    )


def test_root_path_block_exists(blocks_by_path):
    assert "/" in blocks_by_path, "Missing '/' block for root path cache"


def test_root_path_has_short_cache(blocks_by_path):
    b = blocks_by_path["/"]
    assert b["headers"].get("Cache-Control") == SHORT_CACHE, (
        f"/ Cache-Control mismatch — expected {SHORT_CACHE!r}, got "
        f"{b['headers'].get('Cache-Control')!r}"
    )


@pytest.mark.parametrize("slug", CONTENT_SLUGS)
def test_slug_no_trailing_slash_block(blocks_by_path, slug):
    path = f"/{slug}"
    assert path in blocks_by_path, f"Missing {path} block"
    b = blocks_by_path[path]
    assert b["headers"].get("Cache-Control") == SHORT_CACHE, (
        f"{path} Cache-Control mismatch — expected {SHORT_CACHE!r}, got "
        f"{b['headers'].get('Cache-Control')!r}"
    )


@pytest.mark.parametrize("slug", CONTENT_SLUGS)
def test_slug_with_trailing_slash_block(blocks_by_path, slug):
    path = f"/{slug}/"
    assert path in blocks_by_path, f"Missing {path} block"
    b = blocks_by_path[path]
    assert b["headers"].get("Cache-Control") == SHORT_CACHE, (
        f"{path} Cache-Control mismatch — expected {SHORT_CACHE!r}, got "
        f"{b['headers'].get('Cache-Control')!r}"
    )


# -------- SEO discovery files ------------------------------------------

def test_sitemap_block_exists(blocks_by_path):
    assert "/sitemap.xml" in blocks_by_path, "Missing /sitemap.xml block"


def test_sitemap_cache_and_content_type(blocks_by_path):
    b = blocks_by_path["/sitemap.xml"]
    assert b["headers"].get("Cache-Control") == SEO_CACHE, (
        f"/sitemap.xml Cache-Control mismatch — expected {SEO_CACHE!r}, "
        f"got {b['headers'].get('Cache-Control')!r}"
    )
    assert (
        b["headers"].get("Content-Type") == "application/xml; charset=utf-8"
    ), (
        f"/sitemap.xml Content-Type mismatch — expected "
        f"'application/xml; charset=utf-8', got "
        f"{b['headers'].get('Content-Type')!r}"
    )


def test_robots_block_exists(blocks_by_path):
    assert "/robots.txt" in blocks_by_path, "Missing /robots.txt block"


def test_robots_cache_and_content_type(blocks_by_path):
    b = blocks_by_path["/robots.txt"]
    assert b["headers"].get("Cache-Control") == SEO_CACHE, (
        f"/robots.txt Cache-Control mismatch — expected {SEO_CACHE!r}, "
        f"got {b['headers'].get('Cache-Control')!r}"
    )
    assert (
        b["headers"].get("Content-Type") == "text/plain; charset=utf-8"
    ), (
        f"/robots.txt Content-Type mismatch — expected 'text/plain; "
        f"charset=utf-8', got {b['headers'].get('Content-Type')!r}"
    )


# -------- Total block count sanity -------------------------------------

def test_expected_block_count(parsed_blocks):
    """
    Blocks expected:
      1  /cc-assets/*
      1  /*.html
      1  /
      10 content slugs (5 slugs × with and without trailing slash)
      1  /sitemap.xml
      1  /robots.txt
      1  /llms.txt
    Total: 16
    """
    assert len(parsed_blocks) == 16, (
        f"Expected 16 blocks in _headers, got {len(parsed_blocks)}: "
        f"{[b['path'] for b in parsed_blocks]}"
    )


# -------- Regression: _redirects still 20 rules ------------------------

def test_redirects_still_has_20_rules():
    assert os.path.isfile(REDIRECTS_PATH), f"{REDIRECTS_PATH} missing"
    with open(REDIRECTS_PATH, "r", encoding="utf-8") as f:
        lines = [ln for ln in f.read().split("\n") if ln.strip()]
    assert len(lines) == 20, (
        f"Regression: expected 20 rules in _redirects, got {len(lines)}"
    )


def test_redirects_301_before_200():
    with open(REDIRECTS_PATH, "r", encoding="utf-8") as f:
        lines = [ln for ln in f.read().split("\n") if ln.strip()]
    first_200 = None
    last_301 = None
    for i, ln in enumerate(lines):
        parts = re.split(r" {2,}", ln)
        status = parts[2]
        if status == "301!":
            last_301 = i
        elif status == "200" and first_200 is None:
            first_200 = i
    assert first_200 is not None and last_301 is not None
    assert last_301 < first_200, (
        f"Regression: 301s must appear before 200s (last 301 at {last_301}, "
        f"first 200 at {first_200})"
    )


# -------- Regression: pre-rendered HTML still has offers ---------------

@pytest.mark.parametrize("slug", PRODUCT_SLUGS)
def test_prerendered_html_still_has_offers(slug):
    html_path = os.path.join(FRONTEND_DIR, slug, "index.html")
    assert os.path.isfile(html_path), f"{html_path} missing after build"
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()

    blocks = []
    for m in JSONLD_RE.finditer(html):
        try:
            blocks.append(json.loads(m.group(1).strip()))
        except json.JSONDecodeError as e:
            pytest.fail(f"Un-parseable JSON-LD in /{slug}: {e}")

    product = None
    for b in blocks:
        if isinstance(b, dict) and b.get("@type") == "Product":
            product = b
            break
    assert product is not None, f"No Product schema on /{slug}"
    offers = product.get("offers")
    assert offers is not None, f"'offers' missing on /{slug}"
    assert offers.get("@type") == "Offer"
    assert offers.get("availability") == "https://schema.org/InStock"
    assert offers.get("priceCurrency") == "USD"


# -------- Regression: sitemap still 6 urls -----------------------------

def test_sitemap_still_has_6_urls():
    assert os.path.isfile(SITEMAP_PATH), "sitemap.xml missing"
    with open(SITEMAP_PATH, "r", encoding="utf-8") as f:
        body = f.read()
    url_count = body.count("<url>")
    assert url_count == 6, (
        f"Regression: expected 6 <url> entries, got {url_count}"
    )
