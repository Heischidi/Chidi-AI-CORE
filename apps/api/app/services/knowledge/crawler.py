import asyncio
import logging
from typing import List, Dict, Set
from urllib.parse import urljoin, urlparse
import httpx
from bs4 import BeautifulSoup
import hashlib

logger = logging.getLogger(__name__)

class CrawledPage:
    def __init__(self, url: str, title: str, content: str):
        self.url = url
        self.title = title
        self.content = content
        self.content_hash = hashlib.sha256(content.encode('utf-8')).hexdigest()

class WebsiteCrawler:
    def __init__(self, base_url: str, max_pages: int = 50, crawl_depth: int = 2):
        self.base_url = base_url
        self.max_pages = max_pages
        self.crawl_depth = crawl_depth
        self.visited_urls: Set[str] = set()
        self.domain = urlparse(base_url).netloc
        
    def _is_valid_url(self, url: str) -> bool:
        parsed = urlparse(url)
        if parsed.netloc and parsed.netloc != self.domain:
            return False # Stay on same domain
        
        # Skip obvious non-content
        skip_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.zip', '.mp4']
        if any(url.lower().endswith(ext) for ext in skip_extensions):
            return False
            
        return True

    def _clean_content(self, html: str) -> str:
        soup = BeautifulSoup(html, "html.parser")
        
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer", "header"]):
            script.extract()
            
        text = soup.get_text(separator="\n")
        # Clean up whitespace
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = "\n".join(chunk for chunk in chunks if chunk)
        
        return text

    def _extract_title(self, html: str) -> str:
        soup = BeautifulSoup(html, "html.parser")
        if soup.title:
            return soup.title.string.strip() if soup.title.string else ""
        return ""

    async def crawl(self) -> List[CrawledPage]:
        self.visited_urls.clear()
        queue = [(self.base_url, 0)]
        results = []
        
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            while queue and len(self.visited_urls) < self.max_pages:
                current_url, depth = queue.pop(0)
                
                # Normalize URL (remove fragments)
                current_url = current_url.split('#')[0]
                
                if current_url in self.visited_urls:
                    continue
                    
                if depth > self.crawl_depth:
                    continue
                    
                self.visited_urls.add(current_url)
                
                try:
                    response = await client.get(current_url)
                    response.raise_for_status()
                    
                    html = response.text
                    content = self._clean_content(html)
                    title = self._extract_title(html)
                    
                    if content.strip():
                        results.append(CrawledPage(url=current_url, title=title, content=content))
                    
                    # Find links for next depth
                    if depth < self.crawl_depth:
                        soup = BeautifulSoup(html, "html.parser")
                        for a_tag in soup.find_all("a", href=True):
                            href = a_tag["href"]
                            next_url = urljoin(current_url, href)
                            if self._is_valid_url(next_url):
                                queue.append((next_url, depth + 1))
                                
                except Exception as e:
                    logger.warning(f"Failed to crawl {current_url}: {str(e)}")
                    
                await asyncio.sleep(0.5) # Be polite
                
        return results
