import uuid
from typing import Any, Dict, Optional
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.services.tools.base import BaseTool, ToolContext, ToolResult
from app.models.product import Product, SizeChart

class SizeFitAssistantTool(BaseTool):
    name = "get_size_and_fit_guidance"
    description = (
        "Retrieve brand-specific size charts, garment measurements, and fit recommendations for a garment. "
        "Compares customer measurements (bust, waist, hips in cm or inches) against brand size charts to recommend the best size."
    )
    input_schema = {
        "type": "object",
        "properties": {
            "product_name": {
                "type": "string",
                "description": "Name or keywords of the garment to check sizing for."
            },
            "user_bust": {
                "type": "number",
                "description": "Customer's bust measurement (optional)."
            },
            "user_waist": {
                "type": "number",
                "description": "Customer's natural waist measurement (optional)."
            },
            "user_hips": {
                "type": "number",
                "description": "Customer's hip measurement (optional)."
            },
            "unit": {
                "type": "string",
                "description": "Measurement unit: 'cm' (default) or 'inches'."
            },
            "preferred_fit": {
                "type": "string",
                "description": "Fit preference: 'fitted', 'relaxed', or 'oversized'."
            }
        },
        "required": ["product_name"]
    }

    async def execute(self, context: ToolContext, arguments: Dict[str, Any]) -> ToolResult:
        product_name = arguments.get("product_name", "").strip()
        raw_bust = arguments.get("user_bust")
        raw_waist = arguments.get("user_waist")
        raw_hips = arguments.get("user_hips")
        unit = (arguments.get("unit") or "cm").strip().lower()
        preferred_fit = arguments.get("preferred_fit", "standard").lower()

        if not product_name:
            return ToolResult(success=False, error="Product name is required", status_code="INVALID_ARGUMENTS")

        # Convert measurements to cm if provided in inches
        is_inches = unit in ("in", "inch", "inches")
        multiplier = 2.54 if is_inches else 1.0

        user_bust = float(raw_bust) * multiplier if (raw_bust is not None and 10 < float(raw_bust) < 200) else None
        user_waist = float(raw_waist) * multiplier if (raw_waist is not None and 10 < float(raw_waist) < 200) else None
        user_hips = float(raw_hips) * multiplier if (raw_hips is not None and 10 < float(raw_hips) < 200) else None

        # Find the product
        stmt = (
            select(Product)
            .options(selectinload(Product.size_chart), selectinload(Product.variants))
            .where(
                Product.workspace_id == context.workspace_id,
                Product.name.ilike(f"%{product_name}%")
            )
            .limit(1)
        )
        res = await context.db.execute(stmt)
        product = res.scalar_one_or_none()

        if not product:
            return ToolResult(
                success=True,
                data={"found": False, "message": f"Could not find garment '{product_name}' in this business's catalogue."},
                status_code="PRODUCT_NOT_FOUND"
            )

        # Retrieve size chart
        chart_data = None
        chart_unit = "cm"
        chart_name = None

        if product.size_chart:
            chart_data = product.size_chart.chart_data
            chart_unit = product.size_chart.unit
            chart_name = product.size_chart.name
        elif product.category:
            # Check default size chart for category in this workspace
            chart_stmt = (
                select(SizeChart)
                .where(
                    SizeChart.workspace_id == context.workspace_id,
                    SizeChart.category.ilike(product.category)
                )
                .limit(1)
            )
            chart_res = await context.db.execute(chart_stmt)
            default_chart = chart_res.scalar_one_or_none()
            if default_chart:
                chart_data = default_chart.chart_data
                chart_unit = default_chart.unit
                chart_name = default_chart.name

        def matches_range(val: float, spec: Any) -> bool:
            if not spec:
                return False
            spec_str = str(spec).strip()
            if "-" in spec_str:
                try:
                    low, high = [float(x.strip()) for x in spec_str.split("-")]
                    return low <= val <= high
                except ValueError:
                    return False
            else:
                try:
                    target = float(spec_str)
                    return abs(val - target) <= 2.5
                except ValueError:
                    return False

        recommended_size = None
        explanation = ""

        # Sizing guidance evaluation across bust, waist, hips
        if chart_data and isinstance(chart_data, dict):
            if user_waist or user_bust or user_hips:
                matched_sizes = []
                for size_label, measurements in chart_data.items():
                    if not isinstance(measurements, dict):
                        continue
                    
                    matches = 0
                    total_tested = 0

                    if user_bust and "bust" in measurements:
                        total_tested += 1
                        if matches_range(user_bust, measurements["bust"]):
                            matches += 1

                    if user_waist and "waist" in measurements:
                        total_tested += 1
                        if matches_range(user_waist, measurements["waist"]):
                            matches += 1

                    if user_hips and "hips" in measurements:
                        total_tested += 1
                        if matches_range(user_hips, measurements["hips"]):
                            matches += 1

                    if total_tested > 0 and matches == total_tested:
                        matched_sizes.append(size_label)
                    elif total_tested > 0 and matches > 0 and not matched_sizes:
                        matched_sizes.append(size_label)

                if matched_sizes:
                    recommended_size = matched_sizes[-1]  # Recommend the size accommodating measurements
                    explanation = f"Based on your measurements and the brand's {chart_name or 'size guide'}, size {recommended_size} is recommended."
                    if preferred_fit in ("relaxed", "oversized"):
                        explanation += " For a more relaxed drape, consider sizing up one size."
                    elif preferred_fit == "fitted":
                        explanation += " This size will provide a flattering, tailored silhouette."

        if not recommended_size and product.sizes:
            explanation = f"Available sizes for {product.name}: {', '.join(product.sizes)}."
            if product.fit_notes:
                explanation += f" Fit note: {product.fit_notes}"
            else:
                explanation += " Please provide your bust, waist, or hip measurements for a personalized fit assessment."

        return ToolResult(
            success=True,
            data={
                "found": True,
                "product_name": product.name,
                "category": product.category,
                "available_sizes": product.sizes or [],
                "fit_notes": product.fit_notes or "True to standard sizing.",
                "care_instructions": product.care_instructions,
                "materials": product.materials,
                "size_chart_name": chart_name,
                "size_chart": chart_data,
                "recommended_size": recommended_size,
                "guidance": explanation,
                "disclaimer": "Sizing recommendations are estimates based on brand size guides and garment silhouette. Individual fits may vary."
            },
            status_code="SUCCESS"
        )
