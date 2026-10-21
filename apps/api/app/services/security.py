from urllib.parse import urlparse
import ipaddress
import socket

def is_safe_url(url: str) -> bool:
    """
    Prevents SSRF by validating the domain/IP.
    Rejects localhost, internal IPs, and metadata endpoints.
    """
    try:
        parsed = urlparse(url)
        if parsed.scheme not in ["http", "https"]:
            return False
            
        hostname = parsed.hostname
        if not hostname:
            return False
            
        # Block literal loopback/metadata IPs
        try:
            ip = ipaddress.ip_address(hostname)
            if ip.is_loopback or ip.is_private or str(ip) in ["169.254.169.254", "0.0.0.0"]:
                return False
        except ValueError:
            # Not an IP string, it's a hostname. Check resolution
            pass
            
        # Resolve hostname to IP to block DNS rebinding and internal hostnames
        try:
            ip_str = socket.gethostbyname(hostname)
            ip = ipaddress.ip_address(ip_str)
            if ip.is_loopback or ip.is_private or ip.is_link_local or ip.is_reserved or str(ip) in ["169.254.169.254", "0.0.0.0"]:
                return False
        except (socket.gaierror, ValueError):
            return False
            
        return True
    except Exception:
        return False

