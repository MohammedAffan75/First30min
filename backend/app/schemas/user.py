from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ── Auth ───────────────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    nickname: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    nickname: str


# ── Profile ───────────────────────────────────────────────────────────────────

class ProfileUpdate(BaseModel):
    nickname: Optional[str] = None
    support_tone: Optional[str] = None   # Mother-to-Son | Father-to-Daughter | Neutral | BUA Mode
    favourite_food: Optional[str] = None
    preferred_music: Optional[str] = None
    comfort_activities: Optional[str] = None
    behavioural_notes: Optional[str] = None


class ProfileOut(BaseModel):
    nickname: str
    support_tone: str
    favourite_food: Optional[str]
    preferred_music: Optional[str]
    comfort_activities: Optional[str]
    behavioural_notes: Optional[str]

    model_config = {"from_attributes": True}


# ── Emergency Contacts ────────────────────────────────────────────────────────

class ContactCreate(BaseModel):
    label: str   # Mom | Dad | Girlfriend | Best Friend | Other
    name: str
    phone: str


class ContactOut(ContactCreate):
    id: int
    model_config = {"from_attributes": True}


# ── Session ───────────────────────────────────────────────────────────────────

class SessionOut(BaseModel):
    id: int
    severity: Optional[str]
    started_at: datetime
    ended_at: Optional[datetime]

    model_config = {"from_attributes": True}
