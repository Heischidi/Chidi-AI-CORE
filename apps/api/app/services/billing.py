from abc import ABC, abstractmethod
from typing import Optional, Dict, Any

class BillingProvider(ABC):
    """
    Abstract interface for billing operations (Stripe, Paystack, etc.).
    This separates the domain logic from the actual payment implementation.
    """
    
    @abstractmethod
    async def create_customer(self, email: str, name: str) -> str:
        """Returns the external customer ID."""
        pass
        
    @abstractmethod
    async def create_subscription(self, customer_id: str, price_id: str) -> Dict[str, Any]:
        """Returns subscription details from the provider."""
        pass
        
    @abstractmethod
    async def cancel_subscription(self, subscription_id: str) -> bool:
        """Cancels a subscription."""
        pass
        
    @abstractmethod
    async def change_subscription(self, subscription_id: str, new_price_id: str) -> Dict[str, Any]:
        """Changes an existing subscription."""
        pass
        
    @abstractmethod
    async def get_subscription(self, subscription_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves subscription state from the provider."""
        pass

class MockBillingProvider(BillingProvider):
    """
    Mock provider for Phase 7 where real payments are not implemented yet.
    """
    async def create_customer(self, email: str, name: str) -> str:
        return f"cus_mock_{email.split('@')[0]}"
        
    async def create_subscription(self, customer_id: str, price_id: str) -> Dict[str, Any]:
        return {
            "id": f"sub_mock_{customer_id}",
            "status": "active",
            "current_period_end": 1700000000 # Example timestamp
        }
        
    async def cancel_subscription(self, subscription_id: str) -> bool:
        return True
        
    async def change_subscription(self, subscription_id: str, new_price_id: str) -> Dict[str, Any]:
        return {
            "id": subscription_id,
            "status": "active",
            "price_id": new_price_id
        }
        
    async def get_subscription(self, subscription_id: str) -> Optional[Dict[str, Any]]:
        return {
            "id": subscription_id,
            "status": "active"
        }
