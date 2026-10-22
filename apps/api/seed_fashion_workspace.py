import asyncio
import uuid
from sqlalchemy import select, delete, text
from app.db.session import AsyncSessionLocal
from app.models.workspace import Workspace
from app.models.widget import WidgetConfig
from app.models.product import Product, ProductVariant, SizeChart
from app.models.capability import Capability
from app.models.knowledge import KnowledgeChunk, Website, WebsitePage

async def seed():
    async with AsyncSessionLocal() as db:
        print("1. Updating workspace to Aurelia & Co. Atelier...")
        # Get existing workspace
        ws_res = await db.execute(select(Workspace).limit(1))
        workspace = ws_res.scalar_one_or_none()
        
        if not workspace:
            workspace = Workspace(name="Aurelia & Co. Atelier", slug="aurelia-atelier")
            db.add(workspace)
            await db.commit()
            await db.refresh(workspace)
        else:
            workspace.name = "Aurelia & Co. Atelier"
            workspace.slug = "aurelia-atelier"
            await db.commit()
            await db.refresh(workspace)
        print(f"Workspace ready: ID={workspace.id}, Name={workspace.name}, Slug={workspace.slug}")

        # Clean out old chunks, crawled website pages, and previous test conversations
        await db.execute(delete(KnowledgeChunk).where(KnowledgeChunk.workspace_id == workspace.id))
        await db.execute(delete(WebsitePage).where(WebsitePage.workspace_id == workspace.id))
        await db.execute(delete(Website).where(Website.workspace_id == workspace.id))
        from app.models.conversation import Conversation, Message
        await db.execute(delete(Message).where(Message.workspace_id == workspace.id))
        await db.execute(delete(Conversation).where(Conversation.workspace_id == workspace.id))
        
        fashion_knowledge = [
            "Aurelia & Co. Atelier is an acclaimed contemporary fashion house and atelier based in Lagos, Nigeria. We craft timeless capsule wardrobes, bias-cut silk dresses, tailored Italian wool outerwear, and lightweight linen trousers for modern women.",
            "Delivery Policy: Express delivery within Lagos takes 24 hours. Nationwide delivery across Abuja, Port Harcourt, and other states takes 2-3 business days via verified courier. International DHL express takes 4-6 business days.",
            "Sizing & Alterations: Our dresses follow standard UK/European sizing (UK 6 to UK 16). The silk slip dress features a bias drape cut that naturally skims the waist and hips. Complimentary length adjustments are available upon request before dispatch.",
            "Payment Methods: We accept secure online payments via Paystack, Flutterwave, all Nigerian debit cards (Mastercard, Visa, Verve), direct bank transfer, and USSD.",
            "Returns & Exchanges: Unworn garments in original condition with tags attached can be exchanged for another size or store credit within 7 days of delivery."
        ]
        
        for i, text_content in enumerate(fashion_knowledge):
            chunk = KnowledgeChunk(
                workspace_id=workspace.id,
                source_type="DOCUMENT",
                source_id=workspace.id,
                text_content=text_content,
                chunk_index=i,
                metadata_json={"title": "Atelier Policy & Sizing"}
            )
            db.add(chunk)
        await db.commit()
        print("Fashion knowledge chunks inserted.")

        print("3. Enabling fashion capabilities...")
        cap_keys = ["PRODUCT_SEARCH", "FASHION_STYLING", "SIZE_FIT_GUIDANCE", "PRICE_NEGOTIATION"]
        for k in cap_keys:
            cap_res = await db.execute(
                select(Capability).where(Capability.workspace_id == workspace.id, Capability.capability_key == k)
            )
            cap = cap_res.scalar_one_or_none()
            if not cap:
                db.add(Capability(workspace_id=workspace.id, capability_key=k, enabled=True))
            else:
                cap.enabled = True
        await db.commit()
        print("Capabilities enabled.")

        print("4. Creating fashion size chart...")
        chart_res = await db.execute(
            select(SizeChart).where(SizeChart.workspace_id == workspace.id, SizeChart.name == "Aurelia Womenswear Standard")
        )
        size_chart = chart_res.scalar_one_or_none()
        if not size_chart:
            size_chart = SizeChart(
                workspace_id=workspace.id,
                name="Aurelia Womenswear Standard",
                category="Dresses & Tops",
                unit="cm",
                chart_data={
                    "XS": {"bust": "82", "waist": "64", "hips": "90", "uk_size": "6"},
                    "S":  {"bust": "86", "waist": "68", "hips": "94", "uk_size": "8"},
                    "M":  {"bust": "92", "waist": "74", "hips": "100", "uk_size": "10-12"},
                    "L":  {"bust": "98", "waist": "80", "hips": "106", "uk_size": "14"},
                    "XL": {"bust": "104", "waist": "86", "hips": "112", "uk_size": "16"}
                }
            )
            db.add(size_chart)
            await db.commit()
            await db.refresh(size_chart)
        print(f"Size chart ready: ID={size_chart.id}")

        print("5. Seeding fashion products...")
        # Clean existing products and variants for workspace
        await db.execute(delete(ProductVariant).where(ProductVariant.product_id.in_(
            select(Product.id).where(Product.workspace_id == workspace.id)
        )))
        await db.execute(delete(Product).where(Product.workspace_id == workspace.id))
        if True:
            products_data = [
                {
                    "name": "Emerald Silk Bias Slip Dress",
                    "description": "Lustrous mulberry silk cut on the bias for a liquid drape. Fine rouleau straps and subtle cowl neckline.",
                    "price": 48000.0,
                    "previous_price": 60000.0,
                    "currency": "NGN",
                    "category": "Dresses",
                    "brand": "Aurelia Atelier",
                    "sku": "AUR-SLK-EMR",
                    "colours": ["Emerald Green", "Champagne"],
                    "sizes": ["XS", "S", "M", "L"],
                    "materials": "100% Mulberry Silk",
                    "fit_notes": "True to size, bias drape skims hips naturally.",
                    "occasion_tags": ["wedding", "cocktail", "evening", "dinner"],
                    "style_tags": ["luxury", "minimalist", "elegant"],
                    "images": ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80"],
                    "purchase_url": "https://example.com/shop/emerald-slip",
                    "stock_quantity": 14,
                    "size_chart_id": size_chart.id,
                    "variants": [
                        ("AUR-SLK-EMR-XS", "XS", "Emerald Green", 48000.0, 3),
                        ("AUR-SLK-EMR-S",  "S",  "Emerald Green", 48000.0, 4),
                        ("AUR-SLK-EMR-M",  "M",  "Emerald Green", 48000.0, 5),
                        ("AUR-SLK-EMR-L",  "L",  "Emerald Green", 48000.0, 2),
                    ]
                },
                {
                    "name": "Structured Forest Blazer",
                    "description": "Double-breasted tailored jacket in Italian wool blend with peak lapels and horn buttons.",
                    "price": 72000.0,
                    "previous_price": None,
                    "currency": "NGN",
                    "category": "Outerwear",
                    "brand": "Aurelia Atelier",
                    "sku": "AUR-WOL-BLZ",
                    "colours": ["Deep Forest"],
                    "sizes": ["S", "M", "L", "XL"],
                    "materials": "Italian Virgin Wool & Cashmere",
                    "fit_notes": "Slightly oversized boyfriend tailoring. Size down for a closer fit.",
                    "occasion_tags": ["workwear", "cocktail", "smart-casual"],
                    "style_tags": ["tailored", "luxury", "structured"],
                    "images": ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80"],
                    "purchase_url": "https://example.com/shop/forest-blazer",
                    "stock_quantity": 8,
                    "size_chart_id": size_chart.id,
                    "variants": [
                        ("AUR-WOL-BLZ-S",  "S",  "Deep Forest", 72000.0, 2),
                        ("AUR-WOL-BLZ-M",  "M",  "Deep Forest", 72000.0, 3),
                        ("AUR-WOL-BLZ-L",  "L",  "Deep Forest", 72000.0, 2),
                        ("AUR-WOL-BLZ-XL", "XL", "Deep Forest", 72000.0, 1),
                    ]
                },
                {
                    "name": "Pleated Wide-Leg Linen Trouser",
                    "description": "High-waisted trousers with front double pleats and elongated hems for an effortless drape.",
                    "price": 36000.0,
                    "previous_price": 42000.0,
                    "currency": "NGN",
                    "category": "Trousers",
                    "brand": "Aurelia Atelier",
                    "sku": "AUR-LIN-TRS",
                    "colours": ["Sage Mist", "Sandstone"],
                    "sizes": ["XS", "S", "M", "L"],
                    "materials": "100% Belgian Washed Linen",
                    "fit_notes": "High rise, relaxed flowing leg silhouette.",
                    "occasion_tags": ["brunch", "casual", "resort"],
                    "style_tags": ["relaxed", "resortwear", "minimalist"],
                    "images": ["https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=800&auto=format&fit=crop&q=80"],
                    "purchase_url": "https://example.com/shop/linen-trouser",
                    "stock_quantity": 22,
                    "size_chart_id": size_chart.id,
                    "variants": [
                        ("AUR-LIN-TRS-XS", "XS", "Sage Mist", 36000.0, 5),
                        ("AUR-LIN-TRS-S",  "S",  "Sage Mist", 36000.0, 8),
                        ("AUR-LIN-TRS-M",  "M",  "Sage Mist", 36000.0, 6),
                        ("AUR-LIN-TRS-L",  "L",  "Sage Mist", 36000.0, 3),
                    ]
                },
                {
                    "name": "Minimalist Leather Crossbody Bag",
                    "description": "Sculptural half-moon silhouette handcrafted in vegetable-tanned leather with custom gold hardware.",
                    "price": 28000.0,
                    "previous_price": None,
                    "currency": "NGN",
                    "category": "Accessories",
                    "brand": "Aurelia Atelier",
                    "sku": "AUR-LTH-BAG",
                    "colours": ["Tan", "Olive Green", "Noir"],
                    "sizes": ["One Size"],
                    "materials": "Vegetable Tanned Leather",
                    "fit_notes": "Compact essentials profile with adjustable strap.",
                    "occasion_tags": ["everyday", "cocktail", "casual"],
                    "style_tags": ["minimalist", "handcrafted"],
                    "images": ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80"],
                    "purchase_url": "https://example.com/shop/leather-crossbody",
                    "stock_quantity": 5,
                    "size_chart_id": None,
                    "variants": [
                        ("AUR-LTH-BAG-TAN", "One Size", "Tan", 28000.0, 2),
                        ("AUR-LTH-BAG-OLV", "One Size", "Olive Green", 28000.0, 2),
                        ("AUR-LTH-BAG-BLK", "One Size", "Noir", 28000.0, 1),
                    ]
                }
            ]

            for p_dict in products_data:
                vars_info = p_dict.pop("variants")
                p = Product(workspace_id=workspace.id, **p_dict)
                db.add(p)
                await db.flush()
                for v_sku, v_size, v_col, v_price, v_stock in vars_info:
                    v = ProductVariant(
                        product_id=p.id,
                        sku=v_sku,
                        size=v_size,
                        colour=v_col,
                        price=v_price,
                        stock_quantity=v_stock,
                        availability=True
                    )
                    db.add(v)
            await db.commit()
            print("Fashion products and variants seeded.")

        print("6. Setting up WidgetConfig...")
        w_res = await db.execute(select(WidgetConfig).where(WidgetConfig.workspace_id == workspace.id))
        widget = w_res.scalar_one_or_none()
        if not widget:
            widget = WidgetConfig(
                workspace_id=workspace.id,
                public_widget_id="aurelia-atelier",
                primary_color="#00A86B",
                welcome_message="Hi! I'm Chidi, personal AI stylist for Aurelia & Co. Atelier. Tell me what occasion you're dressing for, your size, or budget!",
                suggested_questions=[
                    "Style an outfit for a cocktail event",
                    "What size fits Bust 36, Waist 29 in the silk slip dress?",
                    "Do you have matching accessories for the blazer?"
                ],
                enabled=True
            )
            db.add(widget)
            await db.commit()
        else:
            widget.public_widget_id = "aurelia-atelier"
            widget.primary_color = "#00A86B"
            widget.welcome_message = "Hi! I'm Chidi, personal AI stylist for Aurelia & Co. Atelier. Tell me what occasion you're dressing for, your size, or budget!"
            widget.suggested_questions = [
                "Style an outfit for a cocktail event",
                "What size fits Bust 36, Waist 29 in the silk slip dress?",
                "Do you have matching accessories for the blazer?"
            ]
            await db.commit()
        print("WidgetConfig configured.")

        print("ALL SEEDING COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(seed())
