from pydantic import BaseModel
from typing import Optional, List


class ChatMessage(BaseModel):
    role: str          # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    session_id: Optional[int] = None
    message: str
    history: List[ChatMessage] = []


class ChatResponse(BaseModel):
    reply: str
    severity: Optional[str] = None       # Low | Moderate | High
    crisis_resources: Optional[List[dict]] = None
    suggested_actions: Optional[List[str]] = None
    session_id: Optional[int] = None
