"""
Tests for the _redirects file emitted by build-static.js (Cloudflare Pages
/ Netlify format).

Contract:
- File exists at /app/frontend/_redirects
- Contains exactly 20 rules
- Ends with a trailing newline
- First 10 rules are uppercase->lowercase 301! force redirects (for /CR1,
  /CR2, /CR3, /WARRANTY, /FIND-A-DEALER — each with and without trailing
  slash)
- Next 10 rules are 200 rewrites mapping extensionless path to
  /<slug>/index.html (for cr1, cr2, cr3, warranty, find-a-dealer — each
  with and without trailing slash)
- 301 rules appear BEFORE 200 rewrite rules (Cloudflare Pages first-match-wins)
- Each rule is: "<from>  <to>  <status>" (two-space separator)

Also verifies (regression) that the pre-rendered HTML files still contain
the Product `offers` JSON-LD block after the build.
"""
import json
import os
import re
import subprocess

import pytest

FRONTEND_DIR = "/app/frontend"
REDIRECTS_PATH = os.path.join(FRONTEND_DIR, "_redirects")
SITEMAP_PATH = os.path.join(FRONTEND_DIR, "sitemap.xml")

UPPERCASE_SLUGS = ["CR1", "CR2", "CR3", "WARRANTY", "FIND-A-DEALER"]
LOWERCASE_SLUGS = ["cr1", "cr2", "cr3", "warranty", "find-a-dealer"]
PRODUCT_SLUGS = ["cr1", "cr2", "cr3"]

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
def redirects_raw():
    with open(REDIRECTS_PATH, "r", encoding="utf-8") as f:
        return f.read()


@pytest.fixture(scope="module")
def redirects_lines(redirects_raw):
    # Non-empty content lines (preserves ordering)
    return [ln for ln in redirects_raw.split("\n") if ln.strip()]


# -------- File-existence & basic-format checks -------------------------

def test_redirects_file_exists():
    assert os.path.isfile(REDIRECTS_PATH), f"{REDIRECTS_PATH} missing"


def test_redirects_has_20_rules(redirects_lines):
    assert len(redirects_lines) == 20, (
        f"Expected 20 rules, got {len(redirects_lines)}"
    )


def test_redirects_trailing_newline(redirects_raw):
    assert redirects_raw.endswith("\n"), "_redirects must end with newline"


def test_each_line_has_three_fields_double_space_separated(redirects_lines):
    """Cloudflare Pages / Netlify format: `<from>  <to>  <status>`."""
    for ln in redirects_lines:
        # split on runs of whitespace of 2+ spaces to be tolerant
        parts = re.split(r" {2,}", ln)
        assert len(parts) == 3, (
            f"Line does not have 3 fields separated by 2+ spaces: {ln!r} "
            f"(got {len(parts)} parts: {parts})"
        )


# -------- 301 uppercase->lowercase rules -------------------------------

def test_first_ten_lines_are_301_force_redirects(redirects_lines):
    for i, ln in enumerate(redirects_lines[:10]):
        parts = re.split(r" {2,}", ln)
        assert parts[2] == "301!", (
            f"Line {i+1} status should be '301!' (force), got: {ln!r}"
        )


def test_301_rules_cover_all_uppercase_slugs(redirects_lines):
    first_ten = redirects_lines[:10]
    expected = set()
    for slug in UPPERCASE_SLUGS:
        expected.add(f"/{slug}")
        expected.add(f"/{slug}/")
    found_sources = set()
    for ln in first_ten:
        parts = re.split(r" {2,}", ln)
        found_sources.add(parts[0])
    assert found_sources == expected, (
        f"Missing uppercase sources.\nExpected: {sorted(expected)}\nFound: "
        f"{sorted(found_sources)}"
    )


def test_301_rules_target_lowercase(redirects_lines):
    first_ten = redirects_lines[:10]
    for ln in first_ten:
        src, dst, _ = re.split(r" {2,}", ln)
        # dst should be the lowercase equivalent of src (stripped of trailing /)
        expected_dst = "/" + src.strip("/").lower()
        assert dst == expected_dst, (
            f"301 rule maps {src} -> {dst}, expected {expected_dst}"
        )


# -------- 200 rewrite rules --------------------------------------------

def test_last_ten_lines_are_200_rewrites(redirects_lines):
    for i, ln in enumerate(redirects_lines[10:], start=10):
        parts = re.split(r" {2,}", ln)
        assert parts[2] == "200", (
            f"Line {i+1} status should be '200' (rewrite), got: {ln!r}"
        )


def test_200_rewrites_cover_all_lowercase_slugs(redirects_lines):
    last_ten = redirects_lines[10:]
    expected = {}
    for slug in LOWERCASE_SLUGS:
        expected[f"/{slug}"] = f"/{slug}/index.html"
        expected[f"/{slug}/"] = f"/{slug}/index.html"
    found = {}
    for ln in last_ten:
        src, dst, _ = re.split(r" {2,}", ln)
        found[src] = dst
    assert found == expected, (
        f"200 rewrite rules mismatch.\nExpected: {expected}\nFound: {found}"
    )


# -------- Ordering: 301s BEFORE 200s -----------------------------------

def test_301_rules_appear_before_200_rules(redirects_lines):
    # Find the index of the first 200 line and the last 301 line.
    first_200_idx = None
    last_301_idx = None
    for i, ln in enumerate(redirects_lines):
        parts = re.split(r" {2,}", ln)
        status = parts[2]
        if status == "301!" and (last_301_idx is None or i > last_301_idx):
            last_301_idx = i
        if status == "200" and first_200_idx is None:
            first_200_idx = i
    assert first_200_idx is not None, "No 200 rules found"
    assert last_301_idx is not None, "No 301 rules found"
    assert last_301_idx < first_200_idx, (
        f"Ordering broken: last 301 at line {last_301_idx+1}, first 200 "
        f"at line {first_200_idx+1} — 301s MUST come first."
    )


# -------- Regression: pre-rendered HTML still has offers block --------

@pytest.mark.parametrize("slug", PRODUCT_SLUGS)
def test_prerendered_html_has_offers_block(slug):
    html_path = os.path.join(FRONTEND_DIR, slug, "index.html")
    assert os.path.isfile(html_path), f"{html_path} missing after build"
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()

    blocks = []
    for m in JSONLD_RE.finditer(html):
        blocks.append(json.loads(m.group(1).strip()))

    # Locate Product block
    product = None
    for b in blocks:
        if isinstance(b, dict) and b.get("@type") == "Product":
            product = b
            break
    assert product is not None, f"No Product JSON-LD in /{slug}/index.html"

    offers = product.get("offers")
    assert offers is not None, f"'offers' missing on /{slug}"
    assert offers.get("@type") == "Offer"
    assert offers.get("availability") == "https://schema.org/InStock"
    assert offers.get("priceCurrency") == "USD"
    assert str(offers.get("price")) == "0"
    # seller + priceSpecification present
    assert offers.get("priceSpecification", {}).get("@type") == "PriceSpecification"
    seller = offers.get("seller", {})
    assert seller.get("@type") == "Organization"
    assert seller.get("name") == "California Cooperage Authorized Dealer Network"
    # canonical URL
    assert offers.get("url", "").endswith("/find-a-dealer")


# -------- Sitemap regression ------------------------------------------

def test_sitemap_still_has_6_urls():
    assert os.path.isfile(SITEMAP_PATH), "sitemap.xml missing"
    with open(SITEMAP_PATH, "r", encoding="utf-8") as f:
        body = f.read()
    url_count = body.count("<url>")
    assert url_count == 6, f"Expected 6 <url> entries in sitemap, got {url_count}"
    for slug in ["cr1", "cr2", "cr3", "warranty", "find-a-dealer"]:
        assert f"/{slug}" in body, f"/{slug} missing from sitemap"


# -------- Syntax hygiene ----------------------------------------------

def test_no_comment_or_blank_junk_lines(redirects_raw):
    """
    Cloudflare Pages tolerates # comments, but we don't emit any and shouldn't
    have stray blank lines between rules. Ensure only the terminating newline
    creates a trailing empty split.
    """
    lines = redirects_raw.split("\n")
    # Last element should be '' due to trailing newline
    assert lines[-1] == "", "File must end with exactly one newline"
    # No other blanks
    inner_blanks = [i for i, ln in enumerate(lines[:-1]) if ln.strip() == ""]
    assert not inner_blanks, (
        f"Unexpected blank lines at positions {inner_blanks}"
    )
    # No comment lines
    assert "#" not in redirects_raw, (
        "Emitted _redirects should not contain '#' comments"
    )


def test_force_flag_only_on_301_rules(redirects_lines):
    for ln in redirects_lines:
        parts = re.split(r" {2,}", ln)
        status = parts[2]
        if "!" in status:
            assert status == "301!", (
                f"Force flag should only appear on 301, got: {ln!r}"
            )
