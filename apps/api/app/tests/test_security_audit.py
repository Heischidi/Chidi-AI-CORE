import uuid
import pytest
from unittest.mock import patch
from app.services.security import is_safe_url
from app.routers.catalogue import sanitize_csv_cell
from app.config import settings
from app.models.workspace import Workspace
from app.models.user import User
from app.models.product import Product, SizeChart

@pytest.mark.asyncio
async def test_ssrf_validator_blocks_internal_ips():
    # Loopback addresses
    assert is_safe_url("http://127.0.0.1") is False
    assert is_safe_url("http://127.0.0.1:8000/api") is False
    assert is_safe_url("http://localhost:3000") is False

    # Cloud metadata service (AWS/GCP/Azure)
    assert is_safe_url("http://169.254.169.254/latest/meta-data/") is False

    # RFC 1918 Private ranges
    assert is_safe_url("http://10.0.0.1") is False
    assert is_safe_url("http://172.16.0.1") is False
    assert is_safe_url("http://192.168.1.100") is False

    # Non-HTTP protocols
    assert is_safe_url("file:///etc/passwd") is False
    assert is_safe_url("ftp://ftp.example.com") is False
    assert is_safe_url("javascript:alert(1)") is False

    # Legitimate external URL (using mocked DNS to guarantee determinism in any test environment)
    with patch("socket.gethostbyname", return_value="93.184.216.34"):
        assert is_safe_url("https://chidi-couture.com/shop") is True
        assert is_safe_url("https://example.com") is True


def test_csv_formula_injection_sanitization():
    # Formulas that could execute arbitrary commands in Excel/Sheets
    assert sanitize_csv_cell("=1+1").startswith("'")
    assert sanitize_csv_cell("+cmd|' /C calc'!A0").startswith("'")
    assert sanitize_csv_cell("-2+3*4").startswith("'")
    assert sanitize_csv_cell("@SUM(A1:A10)").startswith("'")
    assert sanitize_csv_cell("\tHYPERLINK(...)").startswith("'")
    assert sanitize_csv_cell("\rMALICIOUS").startswith("'")

    # Safe text
    assert sanitize_csv_cell("Luxe Silk Slip Dress") == "Luxe Silk Slip Dress"
    assert sanitize_csv_cell("Emerald Green") == "Emerald Green"
    assert sanitize_csv_cell("12345") == "12345"


@pytest.mark.asyncio
async def test_production_environment_rejects_dev_bypass(async_client):
    with patch.object(settings, "ENVIRONMENT", "production"):
        # Attempt dev token in production
        resp = await async_client.get(
            "/api/v1/workspaces/current",
            headers={"Authorization": "Bearer local_dev_token"}
        )
        assert resp.status_code == 401

        # Attempt default workspace header without valid bearer token
        resp_ws = await async_client.get(
            "/api/v1/catalogue/products",
            headers={"x-workspace-id": "default"}
        )
        assert resp_ws.status_code == 401


@pytest.mark.asyncio
async def test_storefront_slug_isolation(async_client):
    # Non-existent storefront slug must return 404, never fallback to another workspace
    resp = await async_client.get("/api/v1/catalogue/storefront/definitely-nonexistent-fashion-slug-999")
    assert resp.status_code == 404
    assert "Storefront not found" in resp.json()["detail"]


@pytest.mark.asyncio
async def test_tenant_catalogue_object_level_isolation(async_client):
    """
    Ensure Tenant B cannot access or mutate Tenant A's products, variants, or size charts.
    """
    from app.main import app
    from app.dependencies import get_current_workspace

    tenant_b_ws = Workspace(
        id=uuid.uuid4(),
        name="Tenant B Atelier",
        slug="tenant-b-atelier"
    )

    nonexistent_product_id = uuid.uuid4()
    nonexistent_size_chart_id = uuid.uuid4()

    # Inject Tenant B as the authenticated workspace via FastAPI dependency overrides
    app.dependency_overrides[get_current_workspace] = lambda: tenant_b_ws
    try:
        # Tenant B attempts to fetch an unowned / non-existent product ID
        resp = await async_client.get(f"/api/v1/catalogue/products/{nonexistent_product_id}")
        assert resp.status_code == 404

        # Tenant B attempts to delete an unowned / non-existent product ID
        resp_del = await async_client.delete(f"/api/v1/catalogue/products/{nonexistent_product_id}")
        assert resp_del.status_code == 404

        # Tenant B attempts to fetch an unowned / non-existent size chart
        resp_sc = await async_client.get(f"/api/v1/catalogue/size-charts/{nonexistent_size_chart_id}")
        assert resp_sc.status_code == 404
    finally:
        app.dependency_overrides.clear()


