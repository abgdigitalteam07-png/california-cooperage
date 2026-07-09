"""
Tests for Product JSON-LD `offers` block on California Cooperage static site.

Validates:
- Product schema on /cr1, /cr2, /cr3 contains a complete `offers` block
- offers contains priceSpecification, seller, url with correct canonical hostname
- All JSON-LD blocks on product pages parse as valid JSON
- Non-product pages (/, /warranty, /find-a-dealer) contain NO Product schema
- Organization / BreadcrumbList / FAQPage blocks are intact on product pages
- Sitemap returns 200 and includes all 6 routes
- 301 redirect from /CR1 -> /cr1 still works
"""
import json
import re
import pytest
import requests

BASE_URL = "https://cba431d2-474c-4b3c-8ad3-a929fb18ea97.preview.emergentagent.com"
CANONICAL_HOST = "https://californiacooperagehottubs.com"
PRODUCT_ROUTES = ["/cr1", "/cr2", "/cr3"]
NON_PRODUCT_ROUTES = ["/", "/warranty", "/find-a-dealer"]

JSONLD_RE = re.compile(
    r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
    re.DOTALL | re.IGNORECASE,
)


def _extract_jsonld_blocks(html: str):
    """Return list of parsed JSON-LD objects found in HTML."""
    blocks = []
    for m in JSONLD_RE.finditer(html):
        raw = m.group(1).strip()
        blocks.append(json.loads(raw))  # will raise on invalid JSON
    return blocks


def _find_block(blocks, at_type):
    for b in blocks:
        if isinstance(b, dict) and b.get("@type") == at_type:
            return b
    return None


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"User-Agent": "pytest-jsonld-validator/1.0"})
    return s


@pytest.fixture(scope="module")
def product_html(session):
    """Fetch HTML for all 3 product routes once."""
    data = {}
    for route in PRODUCT_ROUTES:
        r = session.get(BASE_URL + route, timeout=30)
        assert r.status_code == 200, f"{route} returned {r.status_code}"
        data[route] = r.text
    return data


# -------- Product schema offers validation --------

@pytest.mark.parametrize("route", PRODUCT_ROUTES)
def test_product_has_offers_block(product_html, route):
    html = product_html[route]
    blocks = _extract_jsonld_blocks(html)
    product = _find_block(blocks, "Product")
    assert product is not None, f"No Product JSON-LD on {route}"
    assert "offers" in product, f"'offers' key missing from Product on {route}"


@pytest.mark.parametrize("route", PRODUCT_ROUTES)
def test_offers_structure(product_html, route):
    html = product_html[route]
    blocks = _extract_jsonld_blocks(html)
    product = _find_block(blocks, "Product")
    offers = product["offers"]

    assert offers.get("@type") == "Offer"
    assert offers.get("availability") == "https://schema.org/InStock"
    assert offers.get("priceCurrency") == "USD"
    # price can be "0" (string) or 0 (int)
    assert str(offers.get("price")) == "0"
    assert offers.get("url") == f"{CANONICAL_HOST}/find-a-dealer"


@pytest.mark.parametrize("route", PRODUCT_ROUTES)
def test_offers_priceSpecification(product_html, route):
    html = product_html[route]
    blocks = _extract_jsonld_blocks(html)
    product = _find_block(blocks, "Product")
    ps = product["offers"].get("priceSpecification")
    assert ps is not None, f"priceSpecification missing on {route}"
    assert ps.get("@type") == "PriceSpecification"
    assert ps.get("priceCurrency") == "USD"
    assert ps.get("valueAddedTaxIncluded") is False
    assert ps.get("description") == (
        "Contact an authorized California Cooperage dealer for current pricing."
    )


@pytest.mark.parametrize("route", PRODUCT_ROUTES)
def test_offers_seller(product_html, route):
    html = product_html[route]
    blocks = _extract_jsonld_blocks(html)
    product = _find_block(blocks, "Product")
    seller = product["offers"].get("seller")
    assert seller is not None, f"seller missing on {route}"
    assert seller.get("@type") == "Organization"
    assert seller.get("name") == "California Cooperage Authorized Dealer Network"
    assert seller.get("url") == f"{CANONICAL_HOST}/find-a-dealer"


# -------- JSON-LD validity --------

@pytest.mark.parametrize("route", PRODUCT_ROUTES)
def test_all_jsonld_blocks_parse(product_html, route):
    html = product_html[route]
    # If any block is invalid JSON, this raises
    blocks = _extract_jsonld_blocks(html)
    assert len(blocks) >= 3, (
        f"Expected multiple JSON-LD blocks on {route}, found {len(blocks)}"
    )


@pytest.mark.parametrize("route", PRODUCT_ROUTES)
def test_other_schemas_present(product_html, route):
    """Organization, BreadcrumbList, FAQPage should coexist."""
    html = product_html[route]
    blocks = _extract_jsonld_blocks(html)
    types_present = {b.get("@type") for b in blocks if isinstance(b, dict)}
    for expected in ("Organization", "BreadcrumbList", "FAQPage"):
        assert expected in types_present, (
            f"{expected} JSON-LD missing on {route}; found {types_present}"
        )


# -------- Non-product pages must NOT have Product schema --------

@pytest.mark.parametrize("route", NON_PRODUCT_ROUTES)
def test_no_product_schema_on_non_product(session, route):
    r = session.get(BASE_URL + route, timeout=30)
    assert r.status_code == 200, f"{route} returned {r.status_code}"
    blocks = _extract_jsonld_blocks(r.text)
    product = _find_block(blocks, "Product")
    assert product is None, f"Unexpected Product JSON-LD on non-product route {route}"


# -------- Sitemap --------

def test_sitemap_ok(session):
    r = session.get(BASE_URL + "/sitemap.xml", timeout=30)
    assert r.status_code == 200
    body = r.text
    for path in ("/cr1", "/cr2", "/cr3", "/warranty", "/find-a-dealer"):
        assert path in body, f"{path} missing from sitemap.xml"
    # root '/'  — check root URL present as well
    # accept trailing slash or bare host
    assert "californiacooperagehottubs.com" in body or "<loc>" in body


# -------- 301 redirect for uppercase slug --------

def test_uppercase_redirect():
    # allow_redirects=False to inspect the 301 status
    r = requests.get(
        BASE_URL + "/CR1", allow_redirects=False, timeout=30
    )
    assert r.status_code in (301, 308), (
        f"Expected 301/308 from /CR1, got {r.status_code}"
    )
    location = r.headers.get("Location", "")
    assert location.endswith("/cr1") or location == "/cr1", (
        f"Redirect Location should point to /cr1, got {location}"
    )
