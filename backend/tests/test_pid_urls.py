"""
Test PID sheet download URLs on CR1, CR2, CR3 product pages.

Verifies:
- Old broken URL fragments are gone (info-andcontent, old v-numbers)
- New corrected URLs (v1784556231/219/207 + info-and-content) are present
- Each new Cloudinary URL returns HTTP 200 (live check)
- Pre-rendered per-route files contain all three URLs
- Regression: offers block, dimensions, rotomold FAQ, dual-voltage heater,
  build outputs (_redirects, _headers, sitemap.xml) unchanged
"""

import os
import re
import subprocess
import requests
import pytest

FRONTEND_DIR = "/app/frontend"
ROOT_HTML = os.path.join(FRONTEND_DIR, "index.html")
CR_FILES = [os.path.join(FRONTEND_DIR, f"cr{i}/index.html") for i in (1, 2, 3)]
ALL_PRERENDERED = CR_FILES + [
    ROOT_HTML,
    os.path.join(FRONTEND_DIR, "warranty/index.html"),
    os.path.join(FRONTEND_DIR, "find-a-dealer/index.html"),
]

EXPECTED_URLS = {
    "cr1": "https://res.cloudinary.com/american-bath-group/image/upload/v1784556231/websites-product-info-and-content/california-cooperage/pid-sheets/california-cooperage-tech-datas-cr1.pdf",
    "cr2": "https://res.cloudinary.com/american-bath-group/image/upload/v1784556219/websites-product-info-and-content/california-cooperage/pid-sheets/california-cooperage-tech-datas-cr2.pdf",
    "cr3": "https://res.cloudinary.com/american-bath-group/image/upload/v1784556207/websites-product-info-and-content/california-cooperage/pid-sheets/california-cooperage-tech-datas-cr3.pdf",
}

OLD_VERSION_NUMBERS = ["1782931775", "1782931777", "1782931780"]
OLD_PATH_FRAGMENT = "info-andcontent"  # missing hyphen (bug)


# ---------- Old URL fragments should be gone ----------

class TestOldURLFragmentsAbsent:
    @pytest.mark.parametrize("path", ALL_PRERENDERED)
    def test_old_path_fragment_absent(self, path):
        assert os.path.exists(path), f"File missing: {path}"
        with open(path) as f:
            content = f.read()
        assert OLD_PATH_FRAGMENT not in content, (
            f"Old broken URL fragment '{OLD_PATH_FRAGMENT}' found in {path}"
        )

    @pytest.mark.parametrize("path", ALL_PRERENDERED)
    @pytest.mark.parametrize("old_version", OLD_VERSION_NUMBERS)
    def test_old_version_numbers_absent(self, path, old_version):
        with open(path) as f:
            content = f.read()
        assert old_version not in content, (
            f"Old Cloudinary version '{old_version}' still present in {path}"
        )

    def test_old_fragment_absent_repo_wide(self):
        """Global grep across /app/frontend for missing-hyphen fragment."""
        result = subprocess.run(
            ["grep", "-r", "-l", OLD_PATH_FRAGMENT, FRONTEND_DIR,
             "--exclude-dir=node_modules"],
            capture_output=True, text=True,
        )
        assert result.stdout.strip() == "", (
            f"Old fragment still found in repo:\n{result.stdout}"
        )


# ---------- New URLs are present and exact ----------

_PID_ANCHOR_RE = re.compile(
    r'<a\s+class="pid-download-btn"\s+href="([^"]+)"', re.IGNORECASE
)


class TestNewURLsPresent:
    def test_root_index_has_three_anchors_in_order(self):
        with open(ROOT_HTML) as f:
            content = f.read()
        hrefs = _PID_ANCHOR_RE.findall(content)
        assert len(hrefs) == 3, f"Expected 3 pid-download-btn anchors, got {len(hrefs)}"
        assert hrefs[0] == EXPECTED_URLS["cr1"], f"CR1 href mismatch:\n  got: {hrefs[0]}"
        assert hrefs[1] == EXPECTED_URLS["cr2"], f"CR2 href mismatch:\n  got: {hrefs[1]}"
        assert hrefs[2] == EXPECTED_URLS["cr3"], f"CR3 href mismatch:\n  got: {hrefs[2]}"

    @pytest.mark.parametrize("path", CR_FILES + [ROOT_HTML])
    def test_prerendered_contains_all_three_urls(self, path):
        with open(path) as f:
            content = f.read()
        for key, url in EXPECTED_URLS.items():
            assert url in content, f"{key} URL missing in {path}"


# ---------- Cloudinary URLs live-reachable ----------

class TestCloudinaryLive:
    @pytest.mark.parametrize("key,url", list(EXPECTED_URLS.items()))
    def test_url_returns_200(self, key, url):
        # HEAD first, fallback GET if HEAD unsupported
        resp = requests.head(url, allow_redirects=True, timeout=15)
        if resp.status_code >= 400:
            resp = requests.get(url, allow_redirects=True, timeout=20, stream=True)
        assert resp.status_code == 200, (
            f"{key} PDF returned HTTP {resp.status_code} for {url}"
        )
        ctype = resp.headers.get("Content-Type", "").lower()
        assert "pdf" in ctype or "octet-stream" in ctype, (
            f"{key} URL returned non-PDF content-type: {ctype}"
        )


# ---------- Regression checks ----------

class TestRegression:
    @pytest.mark.parametrize("path", CR_FILES)
    def test_offers_block_present(self, path):
        with open(path) as f:
            content = f.read()
        assert '"offers"' in content, f"offers block missing in {path}"
        assert '"@type": "Offer"' in content, f"@type Offer missing in {path}"

    @pytest.mark.parametrize("path", CR_FILES)
    def test_dimensions_inches_first(self, path):
        """Dimensions must appear as e.g. 69\" × 60\" (inches first)."""
        with open(path) as f:
            content = f.read()
        matches = re.findall(r'\d+"\s*×\s*\d+"', content)
        assert matches, f"No inches-first dimension pattern in {path}"

    @pytest.mark.parametrize("path", CR_FILES)
    def test_rotomold_faq_answer_unchanged(self, path):
        expected_snippet = (
            "The roto-mold process begins with plastic pellets. "
            "As the mold rotates and heats, the pellets melt and fuse together "
            "to create a tough, seamless spa shell with exceptional durability."
        )
        with open(path) as f:
            content = f.read()
        assert expected_snippet in content, (
            f"Rotomold FAQ answer modified/missing in {path}"
        )

    @pytest.mark.parametrize("path", CR_FILES)
    def test_dual_voltage_heater_intact(self, path):
        with open(path) as f:
            content = f.read()
        # Both voltages should appear on product pages that use dual-voltage heater
        assert "120V" in content, f"120V missing in {path}"
        assert "240V" in content, f"240V missing in {path}"

    def test_redirects_has_20_rules(self):
        path = os.path.join(FRONTEND_DIR, "_redirects")
        with open(path) as f:
            lines = [
                ln for ln in f.read().splitlines()
                if ln.strip() and not ln.strip().startswith("#")
            ]
        assert len(lines) == 20, f"Expected 20 redirect rules, got {len(lines)}"

    def test_headers_has_15_blocks(self):
        path = os.path.join(FRONTEND_DIR, "_headers")
        with open(path) as f:
            content = f.read()
        # Each block starts with a path line beginning with '/'
        blocks = [ln for ln in content.splitlines() if ln.startswith("/")]
        assert len(blocks) == 15, f"Expected 15 header blocks, got {len(blocks)}"

    def test_sitemap_has_6_urls(self):
        path = os.path.join(FRONTEND_DIR, "sitemap.xml")
        with open(path) as f:
            content = f.read()
        count = content.count("<url>")
        assert count == 6, f"Expected 6 <url> entries, got {count}"


# ---------- Preview URL live test (frontend serve) ----------

PREVIEW_URL = os.environ.get(
    "REACT_APP_BACKEND_URL",
    "https://california-cooperage.preview.emergentagent.com",
).rstrip("/")


class TestPreviewLive:
    @pytest.mark.parametrize("key,expected", list(EXPECTED_URLS.items()))
    def test_preview_route_serves_correct_pid_url(self, key, expected):
        url = f"{PREVIEW_URL}/{key}"
        resp = requests.get(url, timeout=20)
        if resp.status_code != 200:
            pytest.skip(f"Preview URL {url} returned {resp.status_code}")
        assert expected in resp.text, (
            f"Preview {url} does not contain expected {key} PID URL"
        )
