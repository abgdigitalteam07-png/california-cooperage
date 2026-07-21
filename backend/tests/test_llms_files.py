"""
Tests for the two new content additions:

  FIX 1: /app/frontend/llms.txt gained a `## Common Questions` section
         AFTER `## Key Facts` with 7 verbatim bullet items.

  FIX 2: /app/frontend/llms-full.txt is a NEW auto-generated file emitted by
         `node build-static.js`. It must contain:
         - `# California Cooperage — Full Content` H1 + blockquote intro
         - `## Common Questions` block (same 7 QAs)
         - 6 top-level `## ` route sections (home + cr1 + cr2 + cr3 +
           warranty + find-a-dealer) each with a `URL: https://...` line
         - `### Specifications` sub-section on each of cr1/cr2/cr3 with
           >= 10 `- Key: Value` rows
         - `### Frequently Asked Questions` on home + cr1/cr2/cr3
         - Fully-decoded HTML entities (no &quot;) and NO raw HTML tags
         - _headers block with Cache-Control 1h + Content-Type text/plain
         - Idempotent: 2 consecutive builds → identical md5
         - Live preview URL 200 + text/plain; charset=utf-8
"""
import hashlib
import os
import re
import subprocess

import pytest
import requests

FRONTEND_DIR = "/app/frontend"
LLMS_PATH = os.path.join(FRONTEND_DIR, "llms.txt")
LLMS_FULL_PATH = os.path.join(FRONTEND_DIR, "llms-full.txt")
HEADERS_PATH = os.path.join(FRONTEND_DIR, "_headers")

PREVIEW_BASE = "https://cba431d2-474c-4b3c-8ad3-a929fb18ea97.preview.emergentagent.com"

# ─── The 7 Common Questions verbatim (order matters) ───────────────────
COMMON_QUESTIONS = [
    'Which hot tub is smallest? The CR1 at 69" × 60" × 30", seats 5.',
    'Which is largest? The CR2 at 81" × 81" × 32", seats 7.',
    'Which is round? The CR3 at 80" × 80" × 32", seats 6.',
    "What construction do all models use? Seamless rotomold polyethylene shell.",
    "What controls do all models use? Balboa (industry standard).",
    "What heater options are available? Dual-voltage 1kW (120V) or 4kW (240V) on all three models.",
    "How is California Cooperage sold? Through authorized dealer network across US and Canada.",
]


# ═══════════════════════════════════════════════════════════════════════
# Module-scoped build (also validates that build exits 0)
# ═══════════════════════════════════════════════════════════════════════

@pytest.fixture(scope="module", autouse=True)
def run_build():
    r = subprocess.run(
        ["node", "build-static.js"],
        cwd=FRONTEND_DIR,
        capture_output=True,
        text=True,
        timeout=90,
    )
    assert r.returncode == 0, (
        f"build-static.js failed: stdout={r.stdout} stderr={r.stderr}"
    )
    return r


def _read(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read()


# ═══════════════════════════════════════════════════════════════════════
# FIX 1: /app/frontend/llms.txt — Common Questions block
# ═══════════════════════════════════════════════════════════════════════

class TestLlmsTxtCommonQuestions:
    @pytest.fixture(scope="class")
    def content(self):
        assert os.path.isfile(LLMS_PATH), f"{LLMS_PATH} missing"
        return _read(LLMS_PATH)

    # --- regression: previous top-level shape still intact ---

    def test_starts_with_h1_and_blockquote(self, content):
        lines = content.splitlines()
        assert lines[0] == "# California Cooperage"
        assert lines[1].startswith(">"), (
            f"line 2 must be a '>' blockquote, got: {lines[1][:80]!r}"
        )

    def test_still_has_products_resources_key_facts(self, content):
        for h in ("## Products", "## Resources", "## Key Facts"):
            assert h in content, f"llms.txt missing regression header {h!r}"

    # --- new Common Questions block ---

    def test_common_questions_header_present(self, content):
        assert "## Common Questions" in content, (
            "llms.txt: '## Common Questions' header missing"
        )

    def test_common_questions_after_key_facts(self, content):
        idx_kf = content.find("## Key Facts")
        idx_cq = content.find("## Common Questions")
        assert idx_kf != -1
        assert idx_cq != -1
        assert idx_cq > idx_kf, (
            "llms.txt: '## Common Questions' must appear AFTER '## Key Facts' "
            f"(got Key Facts at {idx_kf}, Common Questions at {idx_cq})"
        )

    @pytest.mark.parametrize("qa", COMMON_QUESTIONS)
    def test_each_common_question_present_as_bullet(self, content, qa):
        # each Q&A must appear on its own line as a `- ` bullet
        expected = f"- {qa}"
        assert expected in content, (
            f"llms.txt Common Questions: missing bullet line {expected!r}"
        )

    def test_common_questions_in_exact_order(self, content):
        cq_block = content[content.find("## Common Questions"):]
        indices = []
        for qa in COMMON_QUESTIONS:
            i = cq_block.find(f"- {qa}")
            assert i != -1, f"Common Question missing in block: {qa!r}"
            indices.append(i)
        assert indices == sorted(indices), (
            f"Common Questions out of order — positions={indices}"
        )

    def test_common_questions_has_exactly_7_bullets(self, content):
        cq_block = content[content.find("## Common Questions"):]
        # bullets before the next `## ` (or EOF)
        next_h2 = cq_block.find("\n## ", 1)
        block = cq_block if next_h2 == -1 else cq_block[:next_h2]
        bullets = [ln for ln in block.splitlines() if ln.startswith("- ")]
        assert len(bullets) == 7, (
            f"Expected exactly 7 bullets in Common Questions, got {len(bullets)}: "
            f"{bullets!r}"
        )


# ═══════════════════════════════════════════════════════════════════════
# FIX 2: /app/frontend/llms-full.txt — content shape
# ═══════════════════════════════════════════════════════════════════════

class TestLlmsFullTxtFile:
    @pytest.fixture(scope="class")
    def content(self):
        assert os.path.isfile(LLMS_FULL_PATH), (
            f"{LLMS_FULL_PATH} missing (build should emit it)"
        )
        return _read(LLMS_FULL_PATH)

    def test_size_gt_4000_bytes(self, content):
        size = len(content.encode("utf-8"))
        assert size > 4000, f"llms-full.txt only {size} bytes (expected >4000)"

    def test_starts_with_h1_full_content(self, content):
        first_line = content.splitlines()[0]
        assert first_line == "# California Cooperage — Full Content", (
            f"First line must be '# California Cooperage — Full Content', got {first_line!r}"
        )

    def test_second_line_is_blockquote(self, content):
        second = content.splitlines()[1]
        assert second.startswith(">"), (
            f"Second line must start with '>', got: {second[:80]!r}"
        )

    # ─── Common Questions block ────────────────────────────────────────

    def test_common_questions_section_present(self, content):
        assert "## Common Questions" in content

    @pytest.mark.parametrize("qa", COMMON_QUESTIONS)
    def test_each_common_question_as_bullet(self, content, qa):
        assert f"- {qa}" in content, (
            f"llms-full.txt Common Questions: missing bullet {qa!r}"
        )

    def test_common_questions_before_first_route_section(self, content):
        cq = content.find("## Common Questions")
        # The first ## after CQ block should be a route section, not another CQ
        first_route = content.find("## California Cooperage", cq)
        assert cq != -1 and first_route != -1
        assert first_route > cq, (
            "Common Questions must appear before the first route section"
        )

    # ─── Six route sections + URL lines ────────────────────────────────

    EXPECTED_URLS = {
        "## California Cooperage\n": "https://californiacooperagehottubs.com/",
        "## CR1 Hot Tub\n": "https://californiacooperagehottubs.com/cr1",
        "## CR2 Hot Tub\n": "https://californiacooperagehottubs.com/cr2",
        "## CR3 Hot Tub\n": "https://californiacooperagehottubs.com/cr3",
        "## Warranty": "https://californiacooperagehottubs.com/warranty",
        "## Find a": "https://californiacooperagehottubs.com/find-a-dealer",
    }

    @pytest.mark.parametrize("heading,url", list(EXPECTED_URLS.items()))
    def test_route_section_and_url_line_present(self, content, heading, url):
        assert heading in content, f"Missing route section header: {heading!r}"
        # `URL: <url>` line should appear anywhere in the file
        assert f"URL: {url}" in content, (
            f"Missing 'URL: {url}' line for section {heading!r}"
        )

    def test_six_top_level_route_sections(self, content):
        # count `\n## ` (top-level) excluding `## Common Questions`
        # Strip Common Questions section then count remaining `## ` headers
        # It's easier: find all lines starting with `## ` and filter.
        h2_headers = [
            ln for ln in content.splitlines() if ln.startswith("## ")
        ]
        # Exclude the Common Questions H2
        route_h2 = [h for h in h2_headers if h != "## Common Questions"]
        assert len(route_h2) == 6, (
            f"Expected 6 top-level route sections, got {len(route_h2)}: {route_h2!r}"
        )

    # ─── Specifications on cr1/cr2/cr3 ─────────────────────────────────

    def _extract_section(self, content, start_marker, end_marker=None):
        i = content.find(start_marker)
        assert i != -1, f"section marker not found: {start_marker!r}"
        if end_marker is None:
            # end at next `\n## ` (top-level) or EOF
            j = content.find("\n## ", i + len(start_marker))
            return content[i:] if j == -1 else content[i:j]
        j = content.find(end_marker, i + len(start_marker))
        return content[i:] if j == -1 else content[i:j]

    @pytest.mark.parametrize("model,heading", [
        ("CR1", "## CR1 Hot Tub"),
        ("CR2", "## CR2 Hot Tub"),
        ("CR3", "## CR3 Hot Tub"),
    ])
    def test_specifications_subsection_with_10plus_rows(self, content, model, heading):
        section = self._extract_section(content, heading)
        assert "### Specifications" in section, (
            f"{heading}: missing '### Specifications' subsection"
        )
        # Get the Specifications block up until the next `###` or EOF
        spec_start = section.find("### Specifications")
        rest = section[spec_start + len("### Specifications"):]
        next_h3 = rest.find("\n### ")
        spec_block = rest if next_h3 == -1 else rest[:next_h3]
        spec_rows = [
            ln for ln in spec_block.splitlines()
            if re.match(r"^- [^:]+:\s+.+", ln)
        ]
        assert len(spec_rows) >= 10, (
            f"{model} Specifications: expected >= 10 `- Key: Value` rows, "
            f"got {len(spec_rows)}: {spec_rows!r}"
        )

    def test_cr1_specs_key_values(self, content):
        section = self._extract_section(content, "## CR1 Hot Tub")
        # spot-check spec rows called out in the review request
        for row in [
            "- Model: CR1",
            "- Seating: 5 Persons",
            '- Dimensions: 69" × 60" × 30" (175 × 152 × 76 cm)',
            "- Heater: 1 kW heater (120V) / 4 kW heater (240V)",
        ]:
            assert row in section, f"CR1 spec row missing: {row!r}"

    def test_cr2_specs_dimensions_row(self, content):
        section = self._extract_section(content, "## CR2 Hot Tub")
        assert '- Dimensions: 81" × 81" × 32"' in section, (
            "CR2: expected dimensions row with inches-first (81\" × 81\" × 32\")"
        )
        assert "- Seating: 7 Persons" in section

    def test_cr3_specs_dimensions_row(self, content):
        section = self._extract_section(content, "## CR3 Hot Tub")
        assert '- Dimensions: 80" × 80" × 32"' in section, (
            "CR3: expected dimensions row with inches-first"
        )
        assert "- Seating: 6 Persons" in section

    # ─── Frequently Asked Questions subsections ────────────────────────

    @pytest.mark.parametrize("heading", [
        "## California Cooperage",
        "## CR1 Hot Tub",
        "## CR2 Hot Tub",
        "## CR3 Hot Tub",
    ])
    def test_faq_subsection_with_qa_pairs(self, content, heading):
        section = self._extract_section(content, heading + "\n")
        assert "### Frequently Asked Questions" in section, (
            f"{heading}: missing '### Frequently Asked Questions'"
        )
        # section should have at least one Q:/A: pair
        assert re.search(r"^Q: .+", section, flags=re.MULTILINE), (
            f"{heading}: no 'Q: ' line found"
        )
        assert re.search(r"^A: .+", section, flags=re.MULTILINE), (
            f"{heading}: no 'A: ' line found"
        )

    def test_home_faq_has_rotomold_answer(self, content):
        section = self._extract_section(content, "## California Cooperage\n")
        # exact updated home FAQ answer
        assert "The roto-mold process begins with plastic pellets" in section, (
            "Home FAQ: expected 'The roto-mold process begins with plastic pellets...' answer"
        )

    # ─── HTML entity decoding & no raw HTML tags ───────────────────────

    def test_no_html_entities(self, content):
        # &quot; must be decoded to "
        assert "&quot;" not in content, "llms-full.txt: raw &quot; entity leak"
        assert "&amp;" not in content, "llms-full.txt: raw &amp; entity leak"
        assert "&#x27;" not in content and "&#39;" not in content, (
            "llms-full.txt: raw apostrophe entity leak"
        )
        # inches sign is a literal ASCII double-quote
        assert '69"' in content

    def test_no_html_tags_leak(self, content):
        # regex-scan for any HTML tag-like pattern
        forbidden = re.findall(
            r"<(br|span|div|p|a|strong|em|ul|li|table|tr|td|th|h1|h2|h3|h4|h5|h6)\b[^>]*>",
            content,
            flags=re.IGNORECASE,
        )
        assert not forbidden, (
            f"llms-full.txt: raw HTML tags leaked into output: {forbidden!r}"
        )
        # generic angle-bracket scan (allow markdown blockquote `>` line-starts)
        # any `<X...>` sequence that looks like a tag is forbidden
        stray = re.findall(r"<[a-zA-Z/][^>]*>", content)
        assert not stray, (
            f"llms-full.txt: raw HTML-tag-like sequences leaked: {stray!r}"
        )


# ═══════════════════════════════════════════════════════════════════════
# FIX 2b: _headers block for /llms-full.txt
# ═══════════════════════════════════════════════════════════════════════

class TestHeadersLlmsFullBlock:
    @pytest.fixture(scope="class")
    def headers(self):
        return _read(HEADERS_PATH)

    def test_llms_full_block_present(self, headers):
        pat = (
            r"^/llms-full\.txt\s*\n"
            r"\s+Cache-Control:\s*public,\s*max-age=3600,\s*must-revalidate\s*\n"
            r"\s+Content-Type:\s*text/plain;\s*charset=utf-8\s*$"
        )
        assert re.search(pat, headers, flags=re.MULTILINE), (
            "_headers: /llms-full.txt block must have Cache-Control 1h + "
            "Content-Type text/plain; charset=utf-8"
        )

    def test_headers_now_has_17_path_directives(self, headers):
        path_lines = [ln for ln in headers.splitlines() if ln.startswith("/")]
        assert len(path_lines) == 17, (
            "_headers: expected 17 path directives (llms-full.txt added to prior 16), "
            f"got {len(path_lines)}: {path_lines!r}"
        )

    def test_llms_txt_block_still_present(self, headers):
        # regression — the prior iteration's block must still be here
        pat = (
            r"^/llms\.txt\s*\n"
            r"\s+Cache-Control:\s*public,\s*max-age=3600,\s*must-revalidate\s*\n"
            r"\s+Content-Type:\s*text/plain;\s*charset=utf-8\s*$"
        )
        assert re.search(pat, headers, flags=re.MULTILINE), (
            "_headers: /llms.txt block regressed (must still be present)"
        )


# ═══════════════════════════════════════════════════════════════════════
# Idempotency: build twice → llms-full.txt md5 identical; llms.txt untouched
# ═══════════════════════════════════════════════════════════════════════

class TestBuildIdempotency:
    def _md5(self, path):
        with open(path, "rb") as fh:
            return hashlib.md5(fh.read()).hexdigest()

    def test_llms_full_md5_stable_across_two_builds(self):
        first = self._md5(LLMS_FULL_PATH)
        for i in range(2):
            r = subprocess.run(
                ["node", "build-static.js"],
                cwd=FRONTEND_DIR,
                capture_output=True,
                text=True,
                timeout=90,
            )
            assert r.returncode == 0, (
                f"build-static invocation #{i + 1} failed: "
                f"stdout={r.stdout} stderr={r.stderr}"
            )
        second = self._md5(LLMS_FULL_PATH)
        assert first == second, (
            f"llms-full.txt md5 changed across builds: {first} -> {second}"
        )

    def test_llms_txt_untouched_across_two_builds(self):
        first = self._md5(LLMS_PATH)
        for _ in range(2):
            r = subprocess.run(
                ["node", "build-static.js"],
                cwd=FRONTEND_DIR,
                capture_output=True,
                text=True,
                timeout=90,
            )
            assert r.returncode == 0
        second = self._md5(LLMS_PATH)
        assert first == second, (
            f"llms.txt was modified by build (should be a source file). "
            f"md5 {first} -> {second}"
        )


# ═══════════════════════════════════════════════════════════════════════
# Live preview URL
# ═══════════════════════════════════════════════════════════════════════

class TestLlmsFullLivePreview:
    URL = PREVIEW_BASE + "/llms-full.txt"

    def _fetch(self):
        try:
            return requests.get(self.URL, timeout=20)
        except Exception as e:
            pytest.skip(f"preview unreachable: {e}")

    def test_status_200(self):
        r = self._fetch()
        assert r.status_code == 200, (
            f"preview /llms-full.txt returned {r.status_code}"
        )

    def test_content_type_text_plain_utf8(self):
        r = self._fetch()
        ctype = r.headers.get("content-type", "").lower()
        assert "text/plain" in ctype, (
            f"expected text/plain content-type, got {ctype!r}"
        )
        assert "utf-8" in ctype, (
            f"expected charset=utf-8, got {ctype!r}"
        )

    def test_body_starts_with_full_content_h1(self):
        r = self._fetch()
        assert r.text.startswith("# California Cooperage — Full Content"), (
            f"body should start with H1, got: {r.text[:80]!r}"
        )

    def test_body_has_common_questions(self):
        r = self._fetch()
        assert "## Common Questions" in r.text
        for qa in COMMON_QUESTIONS:
            assert f"- {qa}" in r.text, (
                f"preview /llms-full.txt: missing bullet {qa!r}"
            )


class TestLlmsTxtLivePreviewCommonQuestions:
    URL = PREVIEW_BASE + "/llms.txt"

    def _fetch(self):
        try:
            return requests.get(self.URL, timeout=20)
        except Exception as e:
            pytest.skip(f"preview unreachable: {e}")

    def test_status_200(self):
        r = self._fetch()
        assert r.status_code == 200, (
            f"preview /llms.txt returned {r.status_code}"
        )

    def test_body_has_common_questions_section(self):
        r = self._fetch()
        assert "## Common Questions" in r.text, (
            "preview /llms.txt: '## Common Questions' section missing"
        )
        for qa in COMMON_QUESTIONS:
            assert f"- {qa}" in r.text, (
                f"preview /llms.txt: missing Common Question bullet {qa!r}"
            )


# ═══════════════════════════════════════════════════════════════════════
# H1 regression + build returncode already validated by autouse fixture
# ═══════════════════════════════════════════════════════════════════════

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
    def test_single_h1_per_page(self, rel, hero):
        html = _read(os.path.join(FRONTEND_DIR, rel))
        h1s = re.findall(r"<h1[^>]*>([\s\S]*?)</h1>", html, flags=re.IGNORECASE)
        assert len(h1s) == 1, (
            f"{rel}: expected exactly 1 <h1>, got {len(h1s)}"
        )
        assert hero in h1s[0], (
            f"{rel}: H1 does not contain {hero!r}, got: {h1s[0][:200]!r}"
        )
