import tiktoken
from typing import List, Dict, Any

class DocumentChunk:
    def __init__(self, text: str, index: int, metadata: Dict[str, Any] = None):
        self.text = text
        self.index = index
        self.metadata = metadata or {}

class TextChunker:
    """
    Chunks text into smaller pieces for embedding, respecting token limits.
    """
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50, encoding_name: str = "cl100k_base"):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.encoding = tiktoken.get_encoding(encoding_name)

    def chunk_text(self, text: str, base_metadata: Dict[str, Any] = None) -> List[DocumentChunk]:
        if not text:
            return []

        tokens = self.encoding.encode(text)
        chunks = []
        
        i = 0
        chunk_idx = 0
        while i < len(tokens):
            end = min(i + self.chunk_size, len(tokens))
            chunk_tokens = tokens[i:end]
            chunk_text = self.encoding.decode(chunk_tokens)
            
            # If the chunk is just a tiny fragment, and it's the last one, maybe skip it if it's too small
            # But for simplicity, we include all.
            if chunk_text.strip():
                chunks.append(DocumentChunk(
                    text=chunk_text.strip(),
                    index=chunk_idx,
                    metadata=base_metadata.copy() if base_metadata else {}
                ))
                chunk_idx += 1
                
            i += (self.chunk_size - self.chunk_overlap)
            
        return chunks
