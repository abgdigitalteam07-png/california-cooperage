"""
Tests for the three SEO markup fixes applied to pre-rendered HTML:
  FIX 1: Bing Webmaster Tools verification meta tag on every pre-rendered file
  FIX 2: Exactly one <h1> per pre-rendered file (route-appropriate hero); others demoted to <h2>
  FIX 3: Descriptive anchor texts replace generic 'Learn More →' on homepage product cards

Also runs regressions on prior fixes:
  - PID PDF URLs (v1784556231/219/207) present on cr1/cr2/cr3
  - JSON-LD Product/offers block preserved on cr1/cr2/cr3
  - Inches-first dimensions preserved
  - Rotomold FAQ answer preserved
  - Dual-voltage heater strings preserved
  - _redirects (20 rules), _headers (15 blocks), sitemap.xml (6 urls)
"""

import json
import os
import re
import pytest

FRONTEND_DIR = "/app/frontend"

BING_META = '<meta name="msvalidate.01" content="B235E97F583FD41BF87BBFB01C874D5C" />'

ROUTES = [
    ("home",          "index.html",                    "California's Original Hot Tub"),
    ("cr1",           "cr1/index.html",                "CR1"),
    ("cr2",           "cr2/index.html",                "CR2"),
    ("cr3",           "cr3/index.html",                "CR3"),
    ("warranty",      "warranty/index.html",           "Warranty &amp; Documentation"),
    ("find-a-dealer", "find-a-dealer/index.html",      "Find a Dealer Near You"),
]

HERO_BY_ROUTE = {r[0]: r[2] for r in ROUTES}


@pytest.fixture(scope="module")
def rendered():
    """Load all pre-rendered HTML files once."""
    out = {}
    for route_id, rel, _ in ROUTES:
        fp = os.path.join(FRONTEND_DIR, rel)
        assert os.path.exists(fp), f"pre-rendered file missing: {fp}"
        with open(fp, encoding="utf-8") as fh:
            out[route_id] = fh.read()
    return out


# ─── FIX 1: Bing Webmaster Tools verification meta ──────────────────────────
class TestBingMeta:
    @pytest.mark.parametrize("route_id,_rel,_hero", ROUTES)
    def test_bing_meta_present_exactly_once(self, rendered, route_id, _rel, _hero):
        html = rendered[route_id]
        assert html.count(BING_META) == 1, (
            f"{route_id}: expected exactly 1 Bing verification meta tag, got {html.count(BING_META)}"
        )

    @pytest.mark.parametrize("route_id,_rel,_hero", ROUTES)
    def test_bing_meta_before_description(self, rendered, route_id, _rel, _hero):
        html = rendered[route_id]
        bing_idx = html.find(BING_META)
        desc_idx = html.find('<meta name="description"')
        assert bing_idx > 0, f"{route_id}: Bing meta not found"
        assert desc_idx > 0, f"{route_id}: description meta not found"
        assert bing_idx < desc_idx, (
            f"{route_id}: Bing meta (@{bing_idx}) must appear before description (@{desc_idx})"
        )

    @pytest.mark.parametrize("route_id,_rel,_hero", ROUTES)
    def test_bing_meta_inside_head(self, rendered, route_id, _rel, _hero):
        html = rendered[route_id]
        head_close = html.lower().find("</head>")
        bing_idx = html.find(BING_META)
        assert head_close > 0
        assert bing_idx < head_close, f"{route_id}: Bing meta must be inside <head>"


# ─── FIX 2: Exactly one <h1> per pre-rendered file ──────────────────────────
class TestSingleH1:
    @pytest.mark.parametrize("route_id,_rel,_hero", ROUTES)
    def test_exactly_one_h1_opener(self, rendered, route_id, _rel, _hero):
        html = rendered[route_id]
        # Count opener tags — matches <h1>, <h1 ...>, but not <h10>, <h1x>
        openers = re.findall(r"<h1(?:\s[^>]*)?>", html, flags=re.IGNORECASE)
        closers = re.findall(r"</h1\s*>", html, flags=re.IGNORECASE)
        assert len(openers) == 1, f"{route_id}: expected 1 <h1> opener, got {len(openers)}"
        assert len(closers) == 1, f"{route_id}: expected 1 </h1> closer, got {len(closers)}"

    @pytest.mark.parametrize("route_id,_rel,hero", ROUTES)
    def test_active_hero_is_h1(self, rendered, route_id, _rel, hero):
        html = rendered[route_id]
        # The single H1 should contain the active route's hero text
        h1_match = re.search(r"<h1[^>]*>([\s\S]*?)</h1>", html, flags=re.IGNORECASE)
        assert h1_match, f"{route_id}: no <h1>...</h1> block found"
        assert hero in h1_match.group(1), (
            f"{route_id}: expected active H1 to contain '{hero}', got: {h1_match.group(1)[:200]!r}"
        )

    @pytest.mark.parametrize("route_id,_rel,_hero", ROUTES)
    def test_inactive_heroes_demoted_to_h2(self, rendered, route_id, _rel, _hero):
        """The other five hero texts should appear inside <h2>...</h2>."""
        html = rendered[route_id]
        for other_id, other_hero in HERO_BY_ROUTE.items():
            if other_id == route_id:
                continue
            # Find any <h2 ...>...hero...</h2> — hero should appear inside an h2 block
            pat = r"<h2[^>]*>[\s\S]{0,500}?" + re.escape(other_hero) + r"[\s\S]{0,500}?</h2>"
            found = re.search(pat, html)
            assert found, (
                f"{route_id}: inactive hero '{other_hero}' (from {other_id}) not found inside <h2>...</h2>"
            )


# ─── FIX 3: Descriptive anchor texts replace 'Learn More' ───────────────────
DESCRIPTIVE_ANCHORS = [
    ("cr1", "Explore the CR1 5-person rectangular hot tub →"),
    ("cr2", "Explore the CR2 7-person flagship square hot tub →"),
    ("cr3", "Explore the CR3 6-person round hot tub →"),
]


class TestDescriptiveAnchors:
    @pytest.mark.parametrize("route_id,_rel,_hero", ROUTES)
    def test_no_learn_more_text(self, rendered, route_id, _rel, _hero):
        html = rendered[route_id]
        assert "Learn More" not in html, f"{route_id}: 'Learn More' should be gone"

    @pytest.mark.parametrize("route_id,_rel,_hero", ROUTES)
    @pytest.mark.parametrize("slug,text", DESCRIPTIVE_ANCHORS)
    def test_descriptive_anchor_present(self, rendered, route_id, _rel, _hero, slug, text):
        """Anchor text present exactly once and wrapped in a proper <a> with class/href/onclick preserved."""
        html = rendered[route_id]
        assert html.count(text) == 1, (
            f"{route_id}: expected anchor text '{text}' to appear exactly once, got {html.count(text)}"
        )
        # Verify full anchor structure with preserved attributes
        pat = (
            r'<a\s+class="text-link"\s+href="/' + re.escape(slug) + r'"'
            r'\s+onclick="event\.preventDefault\(\);\s*event\.stopPropagation\(\);\s*'
            r"showPage\('" + re.escape(slug) + r"'\);\s*\"\s*>"
            + re.escape(text) + r"</a>"
        )
        assert re.search(pat, html), (
            f"{route_id}: descriptive anchor for /{slug} missing required class/href/onclick or has "
            f"lost its exact structure"
        )


# ─── REGRESSION: PID PDF URLs ───────────────────────────────────────────────
PID_URLS = {
    "cr1/index.html": "v1784556231",
    "cr2/index.html": "v1784556219",
    "cr3/index.html": "v1784556207",
}


class TestRegressionPIDUrls:
    @pytest.mark.parametrize("rel,version", list(PID_URLS.items()))
    def test_new_pid_version_present(self, rel, version):
        html = open(os.path.join(FRONTEND_DIR, rel), encoding="utf-8").read()
        assert version in html, f"{rel}: expected PID version {version} present"
        assert "info-and-content" in html, f"{rel}: expected 'info-and-content' path segment"

    @pytest.mark.parametrize("rel,_v", list(PID_URLS.items()))
    def test_old_pid_versions_absent(self, rel, _v):
        html = open(os.path.join(FRONTEND_DIR, rel), encoding="utf-8").read()
        for old in ("v1782931775", "v1782931777", "v1782931780", "info-andcontent"):
            assert old not in html, f"{rel}: legacy fragment '{old}' should be gone"


# ─── REGRESSION: JSON-LD Product / offers ───────────────────────────────────
class TestRegressionJsonLd:
    @pytest.mark.parametrize("route_id", ["cr1", "cr2", "cr3"])
    def test_offers_block_present_once(self, rendered, route_id):
        html = rendered[route_id]
        assert html.count('"offers"') == 1, f"{route_id}: expected one 'offers' key in JSON-LD"

    @pytest.mark.parametrize("route_id", ["cr1", "cr2", "cr3"])
    def test_jsonld_blocks_parseable(self, rendered, route_id):
        html = rendered[route_id]
        blocks = re.findall(
            r'<script type="application/ld\+json">([\s\S]*?)</script>', html
        )
        assert len(blocks) >= 3, f"{route_id}: expected >=3 JSON-LD blocks, got {len(blocks)}"
        types_found = set()
        for b in blocks:
            obj = json.loads(b)
            t = obj.get("@type")
            types_found.add(t)
        for expected in ("Organization", "Product", "BreadcrumbList", "FAQPage"):
            assert expected in types_found, f"{route_id}: missing @type {expected}"


# ─── REGRESSION: dimensions, rotomold FAQ, heater strings, CSS ─────────────
class TestRegressionContent:
    def test_cr1_dimensions(self):
        html = open(os.path.join(FRONTEND_DIR, "cr1/index.html"), encoding="utf-8").read()
        assert '69" × 60" × 30"' in html
        assert "(175 × 152 × 76 cm)" in html

    def test_cr3_dimensions(self):
        html = open(os.path.join(FRONTEND_DIR, "cr3/index.html"), encoding="utf-8").read()
        assert '80" × 80" × 32"' in html
        assert "(203 × 203 × 81 cm)" in html

    def test_rotomold_faq_answer(self):
        html = open(os.path.join(FRONTEND_DIR, "index.html"), encoding="utf-8").read()
        assert "The roto-mold process begins with plastic pellets" in html

    @pytest.mark.parametrize("route_id", ["cr1", "cr2", "cr3"])
    def test_heater_strings(self, rendered, route_id):
        html = rendered[route_id]
        assert "1 kW / 4 kW Heater (120V / 240V)" in html, f"{route_id}: spec-chip missing"
        assert "1 kW heater (120V) / 4 kW heater (240V)" in html, f"{route_id}: spec-table missing"

    def test_feature_subcopy_css(self):
        html = open(os.path.join(FRONTEND_DIR, "index.html"), encoding="utf-8").read()
        assert ".feature-subcopy" in html


# ─── REGRESSION: _redirects, _headers, sitemap.xml ─────────────────────────
class TestRegressionAncillary:
    def test_redirects_20_rules(self):
        content = open(os.path.join(FRONTEND_DIR, "_redirects"), encoding="utf-8").read()
        lines = [ln for ln in content.splitlines() if ln.strip()]
        assert len(lines) == 20, f"_redirects: expected 20 rules, got {len(lines)}"

    def test_headers_15_blocks(self):
        content = open(os.path.join(FRONTEND_DIR, "_headers"), encoding="utf-8").read()
        # Count path-directive lines (lines that start with '/') — one per header block
        path_lines = [ln for ln in content.splitlines() if ln.startswith("/")]
        assert len(path_lines) == 15, f"_headers: expected 15 path directives, got {len(path_lines)}"

    def test_sitemap_six_urls(self):
        content = open(os.path.join(FRONTEND_DIR, "sitemap.xml"), encoding="utf-8").read()
        assert content.count("<url>") == 6
        assert content.count("</url>") == 6


# ─── LIVE PREVIEW smoke check (best-effort, non-fatal) ─────────────────────
class TestLivePreview:
    BASE = "https://cba431d2-474c-4b3c-8ad3-a929fb18ea97.preview.emergentagent.com"

    def _fetch(self, path):
        import requests
        try:
            r = requests.get(self.BASE + path, timeout=15)
            return r
        except Exception as e:
            pytest.skip(f"preview unreachable: {e}")

    def test_preview_cr1(self):
        r = self._fetch("/cr1")
        assert r.status_code == 200
        assert BING_META in r.text, "preview /cr1 missing Bing meta"
        openers = re.findall(r"<h1(?:\s[^>]*)?>", r.text, flags=re.IGNORECASE)
        assert len(openers) == 1, f"preview /cr1: expected 1 <h1>, got {len(openers)}"
        assert "<h1>CR1</h1>" in r.text
        assert "Learn More" not in r.text

    def test_preview_home_has_descriptive_anchors(self):
        r = self._fetch("/")
        assert r.status_code == 200
        for _slug, text in DESCRIPTIVE_ANCHORS:
            assert text in r.text, f"preview /: missing anchor text '{text}'"
        assert "Learn More" not in r.text
