"""
Content verification tests for California Cooperage index.html and pre-rendered pages.

Verifies two content edits:
  1. CR1 / CR3 dimensions format is now inches-first (cm in parens);
     CR2 preserved (already inches-first).
  2. Homepage FAQ answer for "What is rotomold construction?" replaced with the
     new roto-mold copy.

Also validates regression items:
  - No old cm-first dimension strings remain.
  - Old rotomold answer text is gone.
  - Product `offers` block still present in each CR pre-rendered file.
  - _redirects and _headers still emitted correctly.
  - FAQPage JSON-LD contains the new rotomold answer.
  - Preview URL serves the updated content.
"""
import os
import re
import pytest
import requests

FRONTEND_DIR = "/app/frontend"

PRE_RENDERED = [
    "index.html",
    "cr1/index.html",
    "cr2/index.html",
    "cr3/index.html",
    "warranty/index.html",
    "find-a-dealer/index.html",
]

CR1_NEW = '69" × 60" × 30" (175 × 152 × 76 cm)'
CR2_PRESERVED = '81" × 81" × 32" (205 × 205 × 81 cm)'
CR3_NEW = '80" × 80" × 32" (203 × 203 × 81 cm)'

CR1_OLD_PATTERN = "175 × 152 × 76 cm (69"
CR3_OLD_PATTERN = "203 × 203 × 81 cm (80"

NEW_ROTOMOLD_ANSWER = (
    "The roto-mold process begins with plastic pellets. "
    "As the mold rotates and heats, the pellets melt and fuse together to create "
    "a tough, seamless spa shell with exceptional durability."
)
OLD_ROTOMOLD_FRAGMENT = "Rotomold means the entire shell is molded from a single piece of polyethylene"

PREVIEW_URL = "https://cba431d2-474c-4b3c-8ad3-a929fb18ea97.preview.emergentagent.com"


def _read(rel_path: str) -> str:
    path = os.path.join(FRONTEND_DIR, rel_path)
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


# ---------------------------------------------------------------------------
# Master index.html source-of-truth tests
# ---------------------------------------------------------------------------
class TestMasterIndexContent:
    def test_cr1_new_dimension_format_present(self):
        html = _read("index.html")
        assert CR1_NEW in html, "CR1 inches-first dimension string missing"

    def test_cr2_dimension_preserved(self):
        html = _read("index.html")
        assert CR2_PRESERVED in html, "CR2 dimension string was altered"

    def test_cr3_new_dimension_format_present(self):
        html = _read("index.html")
        assert CR3_NEW in html, "CR3 inches-first dimension string missing"

    def test_no_old_cm_first_patterns(self):
        html = _read("index.html")
        assert CR1_OLD_PATTERN not in html, "Old CR1 cm-first pattern still present"
        assert CR3_OLD_PATTERN not in html, "Old CR3 cm-first pattern still present"

    def test_new_rotomold_faq_answer_present(self):
        html = _read("index.html")
        assert NEW_ROTOMOLD_ANSWER in html, "New rotomold FAQ answer not found"

    def test_old_rotomold_faq_answer_absent(self):
        html = _read("index.html")
        assert OLD_ROTOMOLD_FRAGMENT not in html, "Old rotomold FAQ answer still present"

    def test_faqpage_jsonld_contains_new_answer(self):
        html = _read("index.html")
        scripts = re.findall(
            r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>',
            html,
            re.DOTALL,
        )
        faq_scripts = [s for s in scripts if "FAQPage" in s]
        assert faq_scripts, "No FAQPage JSON-LD script found in index.html"
        assert any(NEW_ROTOMOLD_ANSWER in s for s in faq_scripts), (
            "FAQPage JSON-LD does not contain the new rotomold answer"
        )


# ---------------------------------------------------------------------------
# Pre-rendered output tests (build-static.js output)
# ---------------------------------------------------------------------------
@pytest.mark.parametrize("rel_path", PRE_RENDERED)
class TestPreRenderedContent:
    def test_cr1_new_dim_in_prerendered(self, rel_path):
        assert CR1_NEW in _read(rel_path), f"CR1 new dim missing in {rel_path}"

    def test_cr2_preserved_in_prerendered(self, rel_path):
        assert CR2_PRESERVED in _read(rel_path), f"CR2 dim missing in {rel_path}"

    def test_cr3_new_dim_in_prerendered(self, rel_path):
        assert CR3_NEW in _read(rel_path), f"CR3 new dim missing in {rel_path}"

    def test_no_old_cm_first_pattern_in_prerendered(self, rel_path):
        html = _read(rel_path)
        assert CR1_OLD_PATTERN not in html, f"Old CR1 pattern in {rel_path}"
        assert CR3_OLD_PATTERN not in html, f"Old CR3 pattern in {rel_path}"

    def test_new_rotomold_answer_in_prerendered(self, rel_path):
        assert NEW_ROTOMOLD_ANSWER in _read(rel_path), (
            f"New rotomold answer missing in {rel_path}"
        )

    def test_old_rotomold_answer_absent_in_prerendered(self, rel_path):
        assert OLD_ROTOMOLD_FRAGMENT not in _read(rel_path), (
            f"Old rotomold text still present in {rel_path}"
        )


# ---------------------------------------------------------------------------
# Regression tests for prior fixes
# ---------------------------------------------------------------------------
class TestRegression:
    @pytest.mark.parametrize("product", ["cr1", "cr2", "cr3"])
    def test_offers_block_still_present(self, product):
        html = _read(f"{product}/index.html")
        assert html.count('"offers"') == 1, (
            f'"offers" block count != 1 in {product}/index.html'
        )

    def test_redirects_has_20_rules(self):
        with open(os.path.join(FRONTEND_DIR, "_redirects"), "r", encoding="utf-8") as f:
            lines = f.read().splitlines()
        rules = [
            ln for ln in lines
            if ln.strip() and not ln.strip().startswith("#")
        ]
        assert len(rules) == 20, f"Expected 20 rules in _redirects, got {len(rules)}"

    def test_headers_has_15_blocks(self):
        with open(os.path.join(FRONTEND_DIR, "_headers"), "r", encoding="utf-8") as f:
            lines = f.read().splitlines()
        blocks = [ln for ln in lines if ln.startswith("/")]
        assert len(blocks) == 15, f"Expected 15 header blocks, got {len(blocks)}"


# ---------------------------------------------------------------------------
# Preview URL live check
# ---------------------------------------------------------------------------
class TestPreviewServesUpdatedContent:
    def _get(self, path: str) -> str:
        r = requests.get(f"{PREVIEW_URL}{path}", timeout=20)
        assert r.status_code == 200, f"GET {path} => {r.status_code}"
        return r.text

    def test_preview_cr1_new_dim(self):
        assert CR1_NEW in self._get("/cr1/")

    def test_preview_cr3_new_dim(self):
        assert CR3_NEW in self._get("/cr3/")

    def test_preview_home_has_new_faq_answer(self):
        assert NEW_ROTOMOLD_ANSWER in self._get("/")

    def test_preview_home_no_old_rotomold_text(self):
        assert OLD_ROTOMOLD_FRAGMENT not in self._get("/")

    def test_preview_home_no_old_cm_first(self):
        html = self._get("/")
        assert CR1_OLD_PATTERN not in html
        assert CR3_OLD_PATTERN not in html
