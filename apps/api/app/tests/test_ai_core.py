from app.ai.chidi_core import ChidiCore

def test_build_system_prompt_layers():
    # 1. Base test (only business context)
    prompt = ChidiCore.build_system_prompt(
        business_name="Grand Lynks Hotel",
        business_type="Hotel",
        business_context="A luxury hotel in Abuja."
    )
    
    assert "You are Chidi" in prompt
    assert "Your name is Chidi" in prompt
    assert "Grand Lynks Hotel" in prompt
    assert "luxury hotel in Abuja" in prompt
    
    # 2. Test with capabilities and tone
    prompt_with_caps = ChidiCore.build_system_prompt(
        business_name="Grand Lynks Hotel",
        business_type="Hotel",
        business_context="A luxury hotel.",
        tone="formal",
        enabled_capabilities=["room_booking", "pricing"]
    )
    
    assert "formal" in prompt_with_caps
    assert "room_booking, pricing" in prompt_with_caps
    
    # 3. Test with knowledge context
    prompt_with_knowledge = ChidiCore.build_system_prompt(
        business_name="Grand Lynks Hotel",
        business_type="Hotel",
        business_context="A luxury hotel.",
        knowledge_context="The wifi password is: grand2026"
    )
    
    assert "RELEVANT KNOWLEDGE" in prompt_with_knowledge
    assert "grand2026" in prompt_with_knowledge
