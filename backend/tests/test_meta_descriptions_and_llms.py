"""
Tests for the two SEO fixes:
  FIX 1: Shortened Bing-optimal (120-160 char) meta descriptions for home + CR1
         - DESC_BY_PAGE JS map in master index.html
         - ROUTES table in build-static.js
         - Emitted <meta name=description>, <meta property=og:description>,
           <meta name=twitter:description> on /index.html + /cr1/index.html
         - CR2, CR3, warranty, find-a-dealer MUST NOT be changed

  FIX 2: /app/frontend/llms.txt (new source file, markdown formatted)
         - _headers file has /llms.txt block with cache 1h + text/plain content-type
         - Live preview URL serves 200 OK with correct content-type
"""

import html as html_module
import os
import re
import subprocess

import pytest
import requests

FRONTEND_DIR = "/app/frontend"

# ─── Expected new short descriptions ────────────────────────────────────────
NEW_HOME_DESC = (
    "Explore the CR1, CR2, and CR3 hot tubs from California Cooperage — "
    "America's original rotomold spa brand since 1972. Plug-and-play simple, built to last."
)
NEW_CR1_DESC = (
    'The CR1 is a compact 5-person rectangular hot tub. 69" × 60" × 30", 14 jets, '
    "Balboa controls, 1kW (120V) or 4kW (240V), full-foam insulation."
)

# ─── Old long descriptions that should be gone everywhere ───────────────────
OLD_HOME_FRAGMENT = "California Cooperage — the original American hot tub brand since 1972"
OLD_CR1_FRAGMENT = (
    'The CR1 is a compact 5-person rectangular hot tub at 69" × 60" × 30" with 14 jets'
)

# ─── Untouched meta descriptions (regression) ───────────────────────────────
UNCHANGED_DESCS = {
    "cr2/index.html": "The CR2 is our 7-person flagship square hot tub",
    "cr3/index.html": "The CR3 is a 6-person round hot tub",
    "warranty/index.html": "California Cooperage warranty terms, spa care guides",
    "find-a-dealer/index.html":
        "Locate an authorized California Cooperage dealer and request information",
}

PREVIEW_BASE = "https://cba431d2-474c-4b3c-8ad3-a929fb18ea97.preview.emergentagent.com"


def _read(rel):
    with open(os.path.join(FRONTEND_DIR, rel), encoding="utf-8") as fh:
        return fh.read()


def _decode(s: str) -> str:
    """Decode HTML entities (&quot; → ", &amp; → &, &#x27; → ', etc.)."""
    return html_module.unescape(s)


# ═══ FIX 1a: pre-rendered /index.html home meta tags ═══════════════════════
class TestHomePreRendered:
    @pytest.fixture(scope="class")
    def html(self):
        return _read("index.html")

    def test_home_description_meta_exact(self, html):
        m = re.search(r'<meta\s+name="description"\s+content="([^"]*)"\s*/?>', html)
        assert m, "home: <meta name=description> not found"
        assert _decode(m.group(1)) == NEW_HOME_DESC

    def test_home_description_length_in_bing_range(self, html):
        m = re.search(r'<meta\s+name="description"\s+content="([^"]*)"\s*/?>', html)
        decoded = _decode(m.group(1))
        assert 120 <= len(decoded) <= 160, (
            f"home meta description length={len(decoded)} outside 120-160 Bing range"
        )

    def test_home_og_description_matches(self, html):
        m = re.search(r'<meta\s+property="og:description"\s+content="([^"]*)"\s*/?>', html)
        assert m, "home: og:description not found"
        assert _decode(m.group(1)) == NEW_HOME_DESC

    def test_home_twitter_description_matches(self, html):
        m = re.search(r'<meta\s+name="twitter:description"\s+content="([^"]*)"\s*/?>', html)
        assert m, "home: twitter:description not found"
        assert _decode(m.group(1)) == NEW_HOME_DESC

    def test_home_no_old_long_description(self, html):
        assert OLD_HOME_FRAGMENT not in html, (
            "home: old long description fragment still present"
        )

    def test_desc_by_page_map_has_new_home(self, html):
        # DESC_BY_PAGE JS map at line ~2979
        assert "var DESC_BY_PAGE" in html
        # Find the map block and confirm new home string is there
        m = re.search(r"var DESC_BY_PAGE\s*=\s*\{([\s\S]{0,3000}?)\};", html)
        assert m, "DESC_BY_PAGE map not found in master index.html"
        block = m.group(1)
        assert NEW_HOME_DESC in block, (
            "DESC_BY_PAGE.home: new short home description missing"
        )
        assert OLD_HOME_FRAGMENT not in block, (
            "DESC_BY_PAGE.home: old long home description still present"
        )


# ═══ FIX 1b: pre-rendered /cr1/index.html meta tags ═════════════════════════
class TestCr1PreRendered:
    @pytest.fixture(scope="class")
    def html(self):
        return _read("cr1/index.html")

    def test_cr1_description_meta_exact_decoded(self, html):
        m = re.search(r'<meta\s+name="description"\s+content="([^"]*)"\s*/?>', html)
        assert m, "cr1: <meta name=description> not found"
        assert _decode(m.group(1)) == NEW_CR1_DESC

    def test_cr1_description_length_in_bing_range(self, html):
        m = re.search(r'<meta\s+name="description"\s+content="([^"]*)"\s*/?>', html)
        decoded = _decode(m.group(1))
        assert 120 <= len(decoded) <= 160, (
            f"cr1 meta description decoded length={len(decoded)} outside 120-160 Bing range"
        )

    def test_cr1_og_description_matches_decoded(self, html):
        m = re.search(r'<meta\s+property="og:description"\s+content="([^"]*)"\s*/?>', html)
        assert m, "cr1: og:description not found"
        assert _decode(m.group(1)) == NEW_CR1_DESC

    def test_cr1_twitter_description_matches_decoded(self, html):
        m = re.search(r'<meta\s+name="twitter:description"\s+content="([^"]*)"\s*/?>', html)
        assert m, "cr1: twitter:description not found"
        assert _decode(m.group(1)) == NEW_CR1_DESC

    def test_cr1_no_old_long_description(self, html):
        assert OLD_CR1_FRAGMENT not in html, (
            "cr1: old long description fragment still present"
        )


# ═══ FIX 1c: source files (master index.html DESC_BY_PAGE + build-static.js) ══
class TestSourceFiles:
    def test_master_desc_map_has_new_cr1(self):
        master = _read("index.html")
        m = re.search(r"var DESC_BY_PAGE\s*=\s*\{([\s\S]{0,3000}?)\};", master)
        assert m
        block = m.group(1)
        # In JS source, the 69" 60" etc are literal " inside a JS string
        assert NEW_CR1_DESC in block, (
            "DESC_BY_PAGE.cr1: new short cr1 description missing"
        )
        assert OLD_CR1_FRAGMENT not in block, (
            "DESC_BY_PAGE.cr1: old long cr1 description still present"
        )

    def test_build_static_routes_has_new_home_and_cr1(self):
        with open(os.path.join(FRONTEND_DIR, "build-static.js"), encoding="utf-8") as fh:
            js = fh.read()
        assert NEW_HOME_DESC in js, "build-static.js: new home description missing"
        assert NEW_CR1_DESC in js, "build-static.js: new cr1 description missing"
        assert OLD_HOME_FRAGMENT not in js, (
            "build-static.js: old home description still present"
        )
        assert OLD_CR1_FRAGMENT not in js, (
            "build-static.js: old cr1 description still present"
        )


# ═══ FIX 1d: unchanged descriptions (regression) ════════════════════════════
class TestUnchangedDescriptions:
    @pytest.mark.parametrize("rel,marker", list(UNCHANGED_DESCS.items()))
    def test_meta_description_unchanged(self, rel, marker):
        html = _read(rel)
        m = re.search(r'<meta\s+name="description"\s+content="([^"]*)"\s*/?>', html)
        assert m, f"{rel}: description meta missing"
        decoded = _decode(m.group(1))
        assert marker in decoded, (
            f"{rel}: expected description containing '{marker}', got: {decoded!r}"
        )


# ═══ FIX 2a: /app/frontend/llms.txt content shape ═══════════════════════════
class TestLlmsTxtFile:
    @pytest.fixture(scope="class")
    def content(self):
        fp = os.path.join(FRONTEND_DIR, "llms.txt")
        assert os.path.isfile(fp), "llms.txt missing at /app/frontend/llms.txt"
        with open(fp, encoding="utf-8") as fh:
            return fh.read()

    def test_file_size_around_2400(self, content):
        size = len(content.encode("utf-8"))
        # llms.txt was ~1854 bytes before the Common Questions section was
        # appended; post-fix expected around 2365 bytes.
        assert 2100 <= size <= 2700, f"llms.txt size {size} bytes outside ~2400 range"

    def test_starts_with_h1(self, content):
        lines = content.splitlines()
        assert lines[0] == "# California Cooperage", (
            f"llms.txt line 1 must be '# California Cooperage', got {lines[0]!r}"
        )

    def test_second_line_blockquote(self, content):
        lines = content.splitlines()
        assert lines[1].startswith(">"), (
            f"llms.txt line 2 must start with '>', got {lines[1][:80]!r}"
        )

    def test_products_section_with_three_links(self, content):
        assert "## Products" in content
        for slug in ("cr1", "cr2", "cr3"):
            url = f"https://californiacooperagehottubs.com/{slug}"
            assert url in content, f"llms.txt: canonical URL {url} missing"

    def test_resources_section(self, content):
        assert "## Resources" in content
        assert "https://californiacooperagehottubs.com/warranty" in content
        assert "https://californiacooperagehottubs.com/find-a-dealer" in content

    def test_key_facts_section(self, content):
        assert "## Key Facts" in content
        # covers founding year, product line, construction, control, insulation,
        # heater, distribution, partner brands
        required = [
            "1972",
            "CR1", "CR2", "CR3",
            "roto-mold",
            "Balboa",
            "Full-foam",
            "1kW", "4kW",
            "dealer network",
            "MAAX",
        ]
        for token in required:
            assert token.lower() in content.lower(), (
                f"llms.txt Key Facts: missing token {token!r}"
            )


# ═══ FIX 2b: _headers file has /llms.txt block ══════════════════════════════
class TestHeadersLlmsBlock:
    @pytest.fixture(scope="class")
    def headers(self):
        with open(os.path.join(FRONTEND_DIR, "_headers"), encoding="utf-8") as fh:
            return fh.read()

    def test_llms_txt_path_present(self, headers):
        assert "\n/llms.txt\n" in headers or headers.startswith("/llms.txt\n"), (
            "_headers: /llms.txt path directive missing"
        )

    def test_llms_txt_cache_and_content_type(self, headers):
        # Find the /llms.txt block and its two following indented lines
        pat = (
            r"^/llms\.txt\s*\n"
            r"\s+Cache-Control:\s*public,\s*max-age=3600,\s*must-revalidate\s*\n"
            r"\s+Content-Type:\s*text/plain;\s*charset=utf-8\s*$"
        )
        assert re.search(pat, headers, flags=re.MULTILINE), (
            "_headers: /llms.txt block must have Cache-Control 1h + Content-Type text/plain; charset=utf-8"
        )

    def test_headers_has_17_path_directives(self, headers):
        path_lines = [ln for ln in headers.splitlines() if ln.startswith("/")]
        assert len(path_lines) == 17, (
            f"_headers: expected 17 path directives (llms-full.txt added to prior 16), got {len(path_lines)}"
        )


# ═══ FIX 2c: live preview URL returns llms.txt correctly ════════════════════
class TestLlmsTxtLivePreview:
    URL = PREVIEW_BASE + "/llms.txt"

    def _fetch(self):
        try:
            return requests.get(self.URL, timeout=15)
        except Exception as e:
            pytest.skip(f"preview unreachable: {e}")

    def test_preview_status_200(self):
        r = self._fetch()
        assert r.status_code == 200, f"preview /llms.txt returned {r.status_code}"

    def test_preview_content_type_text_plain_utf8(self):
        r = self._fetch()
        ctype = r.headers.get("content-type", "").lower()
        assert "text/plain" in ctype, f"content-type should be text/plain, got {ctype!r}"
        assert "utf-8" in ctype, f"content-type should include charset=utf-8, got {ctype!r}"

    def test_preview_body_starts_with_h1(self):
        r = self._fetch()
        assert r.text.startswith("# California Cooperage"), (
            f"preview /llms.txt body should start with '# California Cooperage', "
            f"got: {r.text[:80]!r}"
        )

    def test_preview_body_has_products_section(self):
        r = self._fetch()
        assert "## Products" in r.text
        for slug in ("cr1", "cr2", "cr3"):
            assert f"https://californiacooperagehottubs.com/{slug}" in r.text


# ═══ IDEMPOTENCY REGRESSION: build-static twice, llms.txt unchanged ═════════
class TestBuildIdempotency:
    def _hash_llms(self):
        import hashlib
        with open(os.path.join(FRONTEND_DIR, "llms.txt"), "rb") as fh:
            return hashlib.md5(fh.read()).hexdigest()

    def test_build_twice_no_error_and_llms_untouched(self):
        before = self._hash_llms()
        for i in range(2):
            r = subprocess.run(
                ["node", "build-static.js"],
                cwd=FRONTEND_DIR,
                capture_output=True,
                text=True,
                timeout=90,
            )
            assert r.returncode == 0, (
                f"build-static invocation #{i + 1} failed:\nstdout: {r.stdout}\nstderr: {r.stderr}"
            )
        after = self._hash_llms()
        assert before == after, "llms.txt was modified/deleted by build (should be a source file)"

    def test_llms_txt_still_exists_after_build(self):
        assert os.path.isfile(os.path.join(FRONTEND_DIR, "llms.txt")), (
            "llms.txt was removed by build (should be a preserved source file)"
        )


# ═══ H1 REGRESSION: exactly ONE <h1 class="page-hero"> per pre-rendered ═════
class TestH1Regression:
    ROUTES = [
        ("index.html", "California's Original Hot Tub"),
        ("cr1/index.html", "CR1"),
        ("cr2/index.html", "CR2"),
        ("cr3/index.html", "CR3"),
        ("warranty/index.html", "Warranty &amp; Documentation"),
        ("find-a-dealer/index.html", "Find a Dealer Near You"),
    ]

    @pytest.mark.parametrize("rel,hero", ROUTES)
    def test_single_page_hero_h1(self, rel, hero):
        html = _read(rel)
        openers = re.findall(
            r'<h1[^>]*class="page-hero"[^>]*>([\s\S]*?)</h1>', html, flags=re.IGNORECASE
        )
        assert len(openers) == 1, (
            f"{rel}: expected exactly 1 <h1 class=\"page-hero\">, got {len(openers)}"
        )
        assert hero in openers[0], (
            f"{rel}: H1 does not contain expected hero {hero!r}, got: {openers[0][:200]!r}"
        )


# ═══ REGRESSION SPOT-CHECKS ═════════════════════════════════════════════════
class TestGeneralRegression:
    @pytest.mark.parametrize("rel", ["cr1/index.html", "cr2/index.html", "cr3/index.html"])
    def test_offers_once(self, rel):
        html = _read(rel)
        assert html.count('"offers"') == 1

    def test_redirects_20_rules(self):
        with open(os.path.join(FRONTEND_DIR, "_redirects"), encoding="utf-8") as fh:
            content = fh.read()
        lines = [ln for ln in content.splitlines() if ln.strip()]
        assert len(lines) == 20

    def test_sitemap_six_urls(self):
        with open(os.path.join(FRONTEND_DIR, "sitemap.xml"), encoding="utf-8") as fh:
            content = fh.read()
        assert content.count("<url>") == 6

    def test_no_learn_more_anywhere(self):
        for rel, _ in TestH1Regression.ROUTES:
            html = _read(rel)
            assert "Learn More" not in html, f"{rel}: 'Learn More' should be gone"
