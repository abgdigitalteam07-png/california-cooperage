"""
Content verification tests for dual-voltage heater spec edit.

Verifies that '3 kW Heater' has been replaced with a dual-voltage variant across
/app/frontend/index.html, build-static.js, and pre-rendered pages, per five
placement variants:
  (a) SPEC TABLES: '1 kW heater (120V) / 4 kW heater (240V)'
  (b) PROSE / meta descriptions: '1 kW heater (120V) / 4 kW heater (240V)'
  (c) JSON-LD Product Heater property: '1 kW (120V) / 4 kW (240V)'
  (d) HERO TRUST PILL + SPEC CHIPS: '1 kW / 4 kW Heater (120V / 240V)'
  (e) FEATURE CARDS on CR1 & CR3: 'Dual-Voltage Heater + Full Foam'
      with sub-copy '1 kW (120V) / 4 kW (240V)' via new .feature-subcopy class

Also validates regressions:
  - offers block still present on all 3 product pre-rendered pages
  - sitemap.xml still has 6 <url> entries
  - _redirects has 20 rules, _headers has 15 blocks
  - Preview URL serves updated content
"""
import json
import os
import re

import pytest
import requests

FRONTEND_DIR = "/app/frontend"
MASTER = os.path.join(FRONTEND_DIR, "index.html")
BUILD_SCRIPT = os.path.join(FRONTEND_DIR, "build-static.js")

PRE_RENDERED = [
    "index.html",
    "cr1/index.html",
    "cr2/index.html",
    "cr3/index.html",
    "warranty/index.html",
    "find-a-dealer/index.html",
]
PRODUCT_PAGES = ["cr1/index.html", "cr2/index.html", "cr3/index.html"]

OLD_PATTERNS = [r"3 kW", r"3KW", r"3-kW", r"3kW"]

SPEC_TABLE_STR = "1 kW heater (120V) / 4 kW heater (240V)"
JSONLD_HEATER_VAL = "1 kW (120V) / 4 kW (240V)"
CHIP_STR = "1 kW / 4 kW Heater (120V / 240V)"
FEATURE_TITLE = "Dual-Voltage Heater + Full Foam"
FEATURE_SUBCOPY = '<div class="feature-subcopy">1 kW (120V) / 4 kW (240V)</div>'

PREVIEW_URL = "https://cba431d2-474c-4b3c-8ad3-a929fb18ea97.preview.emergentagent.com"


# ── helpers ──────────────────────────────────────────────────────
def read(path):
    with open(os.path.join(FRONTEND_DIR, path), "r", encoding="utf-8") as f:
        return f.read()


# ── (1) OLD strings must be gone everywhere ──────────────────────
@pytest.mark.parametrize("path", ["index.html", "build-static.js"] + PRE_RENDERED)
def test_no_old_heater_strings(path):
    content = read(path)
    for pat in OLD_PATTERNS:
        matches = re.findall(pat, content)
        assert len(matches) == 0, (
            f"{path} still contains {len(matches)} occurrences of OLD "
            f"pattern '{pat}'"
        )


# ── (2) Long-form SPEC TABLES in master (3 CR sections) ───────────
def test_master_long_form_spec_tables_have_new_heater_row():
    content = read("index.html")
    row = f"<tr><td>Heater</td><td>{SPEC_TABLE_STR}</td></tr>"
    count = content.count(row)
    assert count == 3, (
        f"Expected 3 long-form spec-table Heater rows in master index.html, "
        f"found {count}"
    )


# ── (3) COMPARISON TABLES: 3 tables × 3 columns = 9 Heater cells ──
def test_master_comparison_tables_have_new_heater_string():
    """Comparison-table rows include a col-current cell + two plain cells,
    all containing the new heater string. Across all 3 comparison tables
    (one per CR page section) we expect exactly 3 col-current rows and 9
    total heater cells."""
    content = read("index.html")
    # col-current cell for each active column
    col_current_pattern = re.compile(
        r'<td\s+class="col-current">\s*' + re.escape(SPEC_TABLE_STR) + r"\s*</td>"
    )
    assert len(col_current_pattern.findall(content)) == 3, (
        "Expected exactly 3 col-current heater cells across comparison tables"
    )
    # total heater cells (col-current + plain) across all comparison tables
    # long-form spec tables also use the same string, so we look for the
    # combined markup that only appears in comparison table rows
    # A comparison-table Heater row has 4 <td>s and 1 <td class="col-current">
    comparison_row_pattern = re.compile(
        r"<tr>\s*<td>Heater</td>"
        r"(?:\s*<td[^>]*>" + re.escape(SPEC_TABLE_STR) + r"</td>){3}\s*</tr>"
    )
    assert len(comparison_row_pattern.findall(content)) == 3, (
        "Expected exactly 3 comparison-table Heater rows (one per CR page)"
    )


# ── (4) HERO TRUST PILL (CR1) ────────────────────────────────────
def test_master_hero_trust_pill():
    content = read("index.html")
    trust_pill = (
        '<div class="trust-pill"><span class="tp-icon" aria-hidden="true">✦</span> '
        + CHIP_STR
        + "</div>"
    )
    assert trust_pill in content, "Hero trust-pill markup not found in master"


# ── (5) SPEC CHIPS: exactly 3 chip markup occurrences ────────────
def test_master_spec_chips_count():
    content = read("index.html")
    chip_markup = f'<span class="spec-chip">{CHIP_STR}</span>'
    count = content.count(chip_markup)
    assert count == 3, f"Expected exactly 3 spec-chip occurrences, found {count}"

    # 3 chips + 1 trust-pill = 4 total occurrences of CHIP_STR
    total = content.count(CHIP_STR)
    assert total == 4, (
        f"Expected 4 total occurrences of the chip string (3 chips + 1 "
        f"trust-pill), found {total}"
    )


# ── (6) FEATURE CARDS: CR1 + CR3 have Dual-Voltage title + subcopy ─
def test_master_feature_cards_dual_voltage():
    content = read("index.html")
    title_count = content.count(
        f'<div class="feature-name">{FEATURE_TITLE}</div>'
    )
    assert title_count == 2, (
        f"Expected 2 'Dual-Voltage Heater + Full Foam' feature-name markups "
        f"(CR1 + CR3), found {title_count}"
    )
    subcopy_count = content.count(FEATURE_SUBCOPY)
    assert subcopy_count == 2, (
        f"Expected 2 .feature-subcopy markups (CR1 + CR3), found {subcopy_count}"
    )


# ── (7) NEW CSS class .feature-subcopy exists and is styled ──────
def test_master_feature_subcopy_css_class_exists():
    content = read("index.html")
    # find the .feature-subcopy { ... } declaration
    match = re.search(r"\.feature-subcopy\s*\{([^}]+)\}", content)
    assert match is not None, ".feature-subcopy CSS class not defined"
    body = match.group(1).lower()
    # smaller font
    assert "font-size" in body, ".feature-subcopy missing font-size"
    # muted color (opacity or a color property)
    assert (
        "color" in body or "opacity" in body
    ), ".feature-subcopy missing muted color/opacity"


# ── (8) CR1 PROSE meta description in dynamic descriptions object ─
def test_master_cr1_prose_description_updated():
    content = read("index.html")
    # Multiple 'cr1': entries exist (slug map, title map, description map).
    # Pick the longest value (the prose description).
    matches = re.findall(r"'cr1':\s*'([^']+)'", content)
    assert matches, "no 'cr1': entries found in master"
    desc = max(matches, key=len)
    # After Bing-optimal SEO shortening, description carries dual-voltage
    # heater info in condensed form: "1kW (120V) or 4kW (240V)" — the verbose
    # spec-table string no longer fits the 120–160 char budget.
    assert "1kW (120V)" in desc and "4kW (240V)" in desc, (
        f"CR1 prose description missing dual-voltage heater info. Got: {desc}"
    )
    assert "3 kW" not in desc, "CR1 prose description still contains old '3 kW'"


# ── (9) build-static.js CR1 route description + Heater properties ─
def test_build_static_cr1_description_and_heater_props():
    content = read("build-static.js")
    # CR1 description carries dual-voltage heater in condensed form after
    # Bing-optimal SEO shortening.
    assert (
        "1kW (120V) or 4kW (240V)" in content
    ), "build-static.js CR1 description missing condensed dual-voltage heater string"
    # 3 Heater properties (one per CR) with JSON-LD value form
    heater_prop_pattern = re.compile(
        r"\{\s*name:\s*'Heater',\s*value:\s*'"
        + re.escape(JSONLD_HEATER_VAL)
        + r"'\s*\}"
    )
    matches = heater_prop_pattern.findall(content)
    assert len(matches) == 3, (
        f"Expected 3 Heater properties with value '{JSONLD_HEATER_VAL}' in "
        f"build-static.js, found {len(matches)}"
    )


# ── (10) JSON-LD Product schema in each product pre-rendered page ─
@pytest.mark.parametrize("path", PRODUCT_PAGES)
def test_prerendered_jsonld_product_heater_property(path):
    content = read(path)
    # extract all ld+json blocks
    blocks = re.findall(
        r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        content,
        re.DOTALL,
    )
    assert blocks, f"No ld+json blocks found in {path}"

    found_product_heater = False
    for raw in blocks:
        try:
            data = json.loads(raw.strip())
        except json.JSONDecodeError:
            continue
        items = data if isinstance(data, list) else [data]
        for item in items:
            if not isinstance(item, dict):
                continue
            if item.get("@type") != "Product":
                continue
            props = item.get("additionalProperty", [])
            for p in props:
                if (
                    isinstance(p, dict)
                    and p.get("name") == "Heater"
                    and p.get("value") == JSONLD_HEATER_VAL
                ):
                    found_product_heater = True
                    break
    assert found_product_heater, (
        f"{path} JSON-LD Product schema missing Heater PropertyValue with "
        f"value '{JSONLD_HEATER_VAL}'"
    )


# ── (11) REGRESSION: offers block still present ──────────────────
@pytest.mark.parametrize("path", PRODUCT_PAGES)
def test_prerendered_offers_block_intact(path):
    content = read(path)
    assert content.count('"offers"') == 1, (
        f"{path} does not have exactly 1 '\"offers\"' occurrence"
    )


# ── (12) REGRESSION: sitemap.xml has 6 urls ──────────────────────
def test_sitemap_has_6_urls():
    content = read("sitemap.xml")
    assert content.count("<url>") == 6


# ── (13) REGRESSION: _redirects (20 rules) and _headers (15 blocks) ─
def test_redirects_has_20_rules():
    content = read("_redirects")
    rules = [
        ln
        for ln in content.splitlines()
        if ln.strip() and not ln.strip().startswith("#")
    ]
    assert len(rules) == 20, f"Expected 20 _redirects rules, got {len(rules)}"


def test_headers_has_16_blocks():
    content = read("_headers")
    blocks = [
        ln for ln in content.splitlines() if ln.startswith("/")
    ]
    # 15 prior blocks + 1 new /llms.txt block
    assert len(blocks) == 16, f"Expected 16 _headers path blocks, got {len(blocks)}"


# ── (14) REGRESSION: pre-rendered spec tables have new heater row ─
@pytest.mark.parametrize("path", PRODUCT_PAGES)
def test_prerendered_pages_have_new_heater_row(path):
    content = read(path)
    row = f"<tr><td>Heater</td><td>{SPEC_TABLE_STR}</td></tr>"
    assert content.count(row) == 3, (
        f"{path} does not have 3 long-form spec-table Heater rows"
    )


# ── (15) Preview URL serves updated content ──────────────────────
def test_preview_url_cr1_serves_updated_content():
    try:
        r = requests.get(f"{PREVIEW_URL}/cr1", timeout=15)
    except requests.RequestException as e:
        pytest.skip(f"Preview URL unreachable: {e}")
    assert r.status_code == 200, f"Preview /cr1 returned {r.status_code}"
    body = r.text
    # title spot-check
    assert "CR1 Hot Tub" in body, "Preview /cr1 missing 'CR1 Hot Tub' title"
    # new heater string present
    assert SPEC_TABLE_STR in body, (
        "Preview /cr1 body missing new heater spec-table string"
    )
    # no old strings
    for pat in OLD_PATTERNS:
        assert not re.search(pat, body), (
            f"Preview /cr1 still contains OLD pattern '{pat}'"
        )
