import uuid
from typing import List, AsyncIterator
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.conversation import Conversation, Message
from app.models.workspace import Workspace
from app.ai.providers.base import ChatMessage
from app.ai.providers.gemini_provider import GeminiProvider
from app.ai.chidi_core import ChidiCore
from app.services.knowledge.rag import RAGContextBuilder

class ConversationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        # In a full implementation, we might resolve the provider from workspace settings
        self.ai_provider = GeminiProvider()

    async def create_conversation(self, workspace_id: uuid.UUID, channel: str = "WEB") -> Conversation:
        conv = Conversation(workspace_id=workspace_id, channel=channel)
        self.db.add(conv)
        await self.db.commit()
        await self.db.refresh(conv)

        # Track conversation start event
        try:
            from app.services.analytics import AnalyticsService
            analytics = AnalyticsService(self.db)
            await analytics.record_event(
                workspace_id=workspace_id,
                event_type="conversation_started",
                conversation_id=conv.id,
                source=channel
            )
            await self.db.commit()
        except Exception:
            pass

        return conv


    async def process_message(
        self, 
        workspace: Workspace, 
        conversation_id: uuid.UUID, 
        user_content: str, 
        stream: bool = False
    ):
        # 1. Fetch conversation
        result = await self.db.execute(
            select(Conversation).where(
                Conversation.id == conversation_id,
                Conversation.workspace_id == workspace.id
            )
        )
        conversation = result.scalar_one_or_none()
        if not conversation:
            raise ValueError("Conversation not found")

        # 2. Save user message
        user_msg = Message(
            conversation_id=conversation.id,
            workspace_id=workspace.id,
            role="USER",
            content=user_content
        )
        self.db.add(user_msg)
        await self.db.commit()

        # 3. Fetch history
        history_result = await self.db.execute(
            select(Message)
            .where(Message.conversation_id == conversation.id)
            .order_by(Message.created_at.asc())
        )
        history_msgs = history_result.scalars().all()
        
        chat_messages = []
        for m in history_msgs:
            if m.role == "USER":
                chat_messages.append(ChatMessage(role="user", content=m.content))
            elif m.role == "ASSISTANT":
                msg = ChatMessage(role="assistant", content=m.content)
                if m.structured_data:
                    msg.tool_calls = m.structured_data
                chat_messages.append(msg)
            elif m.role == "TOOL":
                chat_messages.append(ChatMessage(role="tool", content=m.content, tool_call_id=m.tool_call_id))

        # 4. Fetch RAG Context
        rag_builder = RAGContextBuilder(self.db)
        rag_context = await rag_builder.build(workspace.id, user_content)

        # Fetch Tools & Capabilities
        from app.services.tools.registry import ToolRegistryService
        from app.services.tools.base import ToolContext
        import json
        
        registry = ToolRegistryService(self.db)
        authorized_tools = await registry.get_authorized_tools(workspace.id)
        
        openai_tools = None
        enabled_caps = []
        if authorized_tools:
            openai_tools = []
            for t in authorized_tools:
                if hasattr(t, "capability") and t.capability:
                    enabled_caps.append(t.capability)
                openai_tools.append({
                    "type": "function",
                    "function": {
                        "name": t.name,
                        "description": t.description,
                        "parameters": t.input_schema
                    }
                })

        # 5. Build System Prompt (integrates Fashion Commerce & RAG context)
        system_prompt = ChidiCore.build_system_prompt(
            business_name=workspace.name,
            business_type="Fashion Atelier & Commerce",
            business_context="We craft contemporary fashion, luxury capsule wardrobes, silk dresses, tailoring, and accessories.",
            tone="warm, stylish, knowledgeable, and helpful",
            knowledge_context=rag_context.context_text if rag_context.context_text else None,
            enabled_capabilities=enabled_caps or ["PRODUCT_SEARCH", "FASHION_STYLING", "SIZE_FIT_GUIDANCE"]
        )

        # 6. Agent Loop (Max 5 iterations)
        MAX_ITERATIONS = 5
        latest_tool_data = {}
        
        for iteration in range(MAX_ITERATIONS):
            if stream and iteration == 0 and not openai_tools: 
                # Simplification: Only stream if no tools are available or it's the final iteration.
                # True streaming with tool calling requires complex chunk aggregation not suited for basic setup.
                return self._stream_response(workspace, conversation.id, system_prompt, chat_messages)
                
            response = await self.ai_provider.generate(
                messages=chat_messages,
                system_prompt=system_prompt,
                tools=openai_tools
            )
            
            if response.tool_calls:
                # Save assistant message with tool calls
                assistant_msg = Message(
                    conversation_id=conversation.id,
                    workspace_id=workspace.id,
                    role="ASSISTANT",
                    content=response.content,
                    structured_data=response.tool_calls,
                    content_type="TOOL_CALL"
                )
                self.db.add(assistant_msg)
                await self.db.commit()
                
                # Append to active chat_messages
                msg_obj = ChatMessage(role="assistant", content=response.content, tool_calls=response.tool_calls)
                chat_messages.append(msg_obj)
                
                # Execute tools
                for tool_call in response.tool_calls:
                    func_name = tool_call["function"]["name"]
                    func_args_str = tool_call["function"]["arguments"]
                    tool_call_id = tool_call["id"]
                    
                    try:
                        func_args = json.loads(func_args_str)
                    except json.JSONDecodeError:
                        func_args = {}
                        
                    tool_ctx = ToolContext(
                        workspace_id=workspace.id,
                        conversation_id=conversation.id,
                        db=self.db
                    )
                    
                    tool_result = await registry.execute_tool(tool_ctx, func_name, func_args)
                    if tool_result.success and tool_result.data:
                        latest_tool_data[func_name] = tool_result.data
                        try:
                            from app.services.analytics import AnalyticsService
                            analytics = AnalyticsService(self.db)
                            if func_name == "recommend_fashion_outfit":
                                recs = tool_result.data.get("outfit_recommendations", [])
                                p_ids = [p.get("id") for p in recs if p.get("id")]
                                cats = [p.get("category") for p in recs if p.get("category")]
                                await analytics.record_event(
                                    workspace_id=workspace.id,
                                    event_type="outfit_recommended",
                                    conversation_id=conversation.id,
                                    metadata={"product_ids": p_ids, "categories": cats, "count": len(recs)}
                                )
                            elif func_name == "get_size_and_fit_guidance":
                                await analytics.record_event(
                                    workspace_id=workspace.id,
                                    event_type="size_guidance_requested",
                                    conversation_id=conversation.id,
                                    metadata={
                                        "product_name": tool_result.data.get("product_name"),
                                        "recommended_size": tool_result.data.get("recommended_size")
                                    }
                                )
                        except Exception:
                            pass
                    result_str = json.dumps(tool_result.model_dump())

                    
                    # Save tool response
                    tool_msg = Message(
                        conversation_id=conversation.id,
                        workspace_id=workspace.id,
                        role="TOOL",
                        content=result_str,
                        tool_call_id=tool_call_id,
                        content_type="TOOL_RESULT"
                    )
                    self.db.add(tool_msg)
                    await self.db.commit()
                    
                    chat_messages.append(ChatMessage(role="tool", content=result_str, tool_call_id=tool_call_id))
                    
                # Loop back to let LLM respond to tool results
                continue
                
            else:
                # Normal response
                assistant_msg = Message(
                    conversation_id=conversation.id,
                    workspace_id=workspace.id,
                    role="ASSISTANT",
                    content=response.content,
                    metadata_json=latest_tool_data if latest_tool_data else None
                )
                self.db.add(assistant_msg)
                await self.db.commit()
                await self.db.refresh(assistant_msg)
                return assistant_msg
                
        # If loop exhausts
        raise ValueError("Agent iteration limit exceeded.")
    async def _stream_response(self, workspace, conversation_id, system_prompt, chat_messages) -> AsyncIterator[str]:
        full_content = ""
        stream = self.ai_provider.stream(messages=chat_messages, system_prompt=system_prompt)
        
        async for chunk in stream:
            if chunk.content:
                full_content += chunk.content
                yield chunk.content
                
        # Save assistant message after stream completes
        assistant_msg = Message(
            conversation_id=conversation_id,
            workspace_id=workspace.id,
            role="ASSISTANT",
            content=full_content
        )
        self.db.add(assistant_msg)
        await self.db.commit()
