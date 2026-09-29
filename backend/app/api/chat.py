from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import json

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User, CrisisSession
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.agent import AgentService

router = APIRouter(prefix="/chat", tags=["chat"])


def _build_agent(user: User) -> AgentService:
    """Build agent service with user's full profile."""
    profile = user.profile
    profile_dict = {}
    if profile:
        profile_dict = {
            "nickname": profile.nickname,
            "support_tone": profile.support_tone,
            "favourite_food": profile.favourite_food,
            "preferred_music": profile.preferred_music,
            "comfort_activities": profile.comfort_activities,
            "behavioural_notes": profile.behavioural_notes,
        }
    else:
        profile_dict = {"nickname": "friend", "support_tone": "Neutral"}

    contacts = [
        {"label": c.label, "name": c.name, "phone": c.phone}
        for c in user.emergency_contacts
    ]
    return AgentService(user_profile=profile_dict, emergency_contacts=contacts)


@router.post("", response_model=ChatResponse)
def chat(
    payload: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Main chat endpoint – single turn."""
    agent = _build_agent(current_user)

    # Convert history to list of dicts
    history = [{"role": m.role, "content": m.content} for m in payload.history]

    result = agent.chat(user_message=payload.message, history=history)

    # Create or update session
    session_id = payload.session_id
    if not session_id:
        session = CrisisSession(user_id=current_user.id)
        db.add(session)
        db.commit()
        db.refresh(session)
        session_id = session.id
    elif result.get("severity"):
        session = db.query(CrisisSession).filter(
            CrisisSession.id == session_id,
            CrisisSession.user_id == current_user.id,
        ).first()
        if session:
            session.severity = result["severity"]
            db.commit()

    return ChatResponse(
        reply=result["reply"],
        severity=result.get("severity"),
        crisis_resources=result.get("crisis_resources"),
        suggested_actions=result.get("suggested_actions"),
        session_id=session_id,
    )


@router.post("/{session_id}/end", status_code=200)
def end_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """End a crisis session."""
    session = db.query(CrisisSession).filter(
        CrisisSession.id == session_id,
        CrisisSession.user_id == current_user.id,
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session.ended_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Session ended. You made it through. That took courage."}


@router.get("/resources")
def get_resources():
    """Public endpoint – always returns crisis resources."""
    from app.services.agent.resources import CRISIS_RESOURCES
    return {"resources": CRISIS_RESOURCES}
