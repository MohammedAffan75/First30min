from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    emergency_contacts = relationship("EmergencyContact", back_populates="user", cascade="all, delete-orphan")
    sessions = relationship("CrisisSession", back_populates="user", cascade="all, delete-orphan")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    nickname = Column(String, nullable=False)
    # Mother-to-Son | Father-to-Daughter | Neutral | BUA Mode
    support_tone = Column(String, default="Neutral")

    favourite_food = Column(String, nullable=True)
    preferred_music = Column(Text, nullable=True)       # comma-separated genres / songs
    comfort_activities = Column(Text, nullable=True)    # comma-separated
    behavioural_notes = Column(Text, nullable=True)     # free text

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    user = relationship("User", back_populates="profile")


class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    label = Column(String, nullable=False)   # Mom | Dad | Girlfriend | Best Friend | Other
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)

    user = relationship("User", back_populates="emergency_contacts")


class CrisisSession(Base):
    __tablename__ = "crisis_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    severity = Column(String, nullable=True)   # Low | Moderate | High | None
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)
    save_transcript = Column(Boolean, default=False)
    transcript = Column(Text, nullable=True)   # only if user opts in

    user = relationship("User", back_populates="sessions")
