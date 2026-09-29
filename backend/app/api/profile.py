from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User, UserProfile, EmergencyContact
from app.schemas.user import ProfileOut, ProfileUpdate, ContactCreate, ContactOut
from typing import List

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("", response_model=ProfileOut)
def get_profile(current_user: User = Depends(get_current_user)):
    if not current_user.profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return current_user.profile


@router.put("", response_model=ProfileOut)
def update_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = current_user.profile
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile


# ── Emergency Contacts ────────────────────────────────────────────────────────

@router.get("/contacts", response_model=List[ContactOut])
def list_contacts(current_user: User = Depends(get_current_user)):
    return current_user.emergency_contacts


@router.post("/contacts", response_model=ContactOut, status_code=201)
def add_contact(
    payload: ContactCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contact = EmergencyContact(user_id=current_user.id, **payload.model_dump())
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


@router.delete("/contacts/{contact_id}", status_code=204)
def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contact = db.query(EmergencyContact).filter(
        EmergencyContact.id == contact_id,
        EmergencyContact.user_id == current_user.id,
    ).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(contact)
    db.commit()
