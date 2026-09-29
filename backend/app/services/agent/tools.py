"""
Agent tools for First 30 Minutes.
These are called by the LLM agent during a crisis session.
"""

import random
from typing import Optional
from app.services.agent.resources import (
    CRISIS_RESOURCES,
    MOTIVATIONAL_STORIES,
    SONG_SUGGESTIONS,
    MOVIE_SUGGESTIONS,
)


def classify_severity(text: str) -> str:
    """
    Rule-based pre-classifier (fast fallback).
    The LLM does the real classification; this is a safety net.
    Returns: Low | Moderate | High
    """
    text_lower = text.lower()

    high_keywords = [
        "suicide", "kill myself", "end my life", "self harm", "cut myself",
        "overdose", "want to die", "can't go on", "no point living", "disappear forever",
        "hurt myself", "don't want to exist"
    ]
    moderate_keywords = [
        "panic attack", "can't breathe", "heart racing", "shaking", "crying",
        "overwhelmed", "trapped", "anxious", "anxiety", "falling apart", "breakdown"
    ]

    for kw in high_keywords:
        if kw in text_lower:
            return "High"
    for kw in moderate_keywords:
        if kw in text_lower:
            return "Moderate"
    return "Low"


def get_crisis_resources() -> list:
    """Returns all crisis helpline resources."""
    return CRISIS_RESOURCES


def get_emergency_contacts(contacts: list) -> list:
    """Returns user's registered emergency contacts."""
    return contacts or []


def suggest_low_severity_actions(
    favourite_food: Optional[str] = None,
    comfort_activities: Optional[str] = None,
) -> list:
    """Returns a list of gentle suggestions for low severity state."""
    actions = []

    if favourite_food:
        actions.append(f"Make yourself some {favourite_food} – comfort food works.")
    else:
        actions.append("Eat something you love – your body needs fuel right now.")

    if comfort_activities:
        for activity in comfort_activities.split(",")[:2]:
            actions.append(activity.strip())
    else:
        actions.append("Take a short 10-minute walk outside.")
        actions.append("Put on a show you've seen before – familiar = comforting.")

    actions.append("Text one person who makes you feel good, even just 'hey'.")
    return actions


def suggest_moderate_severity_actions(
    comfort_activities: Optional[str] = None,
    behavioural_notes: Optional[str] = None,
) -> list:
    """Returns suggestions for moderate severity – grounding + environment change."""
    actions = [
        "5-4-3-2-1: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.",
        "Breathe in for 4 counts, hold for 4, out for 6. Do this 3 times.",
        "Change your physical space – go to another room, step outside briefly.",
        "Splash cold water on your face.",
    ]

    if comfort_activities:
        outdoor_hints = ["walk", "outdoor", "park", "nature", "air"]
        for activity in comfort_activities.split(","):
            if any(h in activity.lower() for h in outdoor_hints):
                actions.insert(0, f"A short walk can genuinely help right now: {activity.strip()}")
                break

    if behavioural_notes and "alone" in behavioural_notes.lower():
        actions.append("It's okay to need quiet alone time. Find a calm spot.")
    else:
        actions.append("Call or text your best friend – you don't need to explain everything.")

    return actions


def generate_motivational_story() -> dict:
    """Returns a random motivational micro-story."""
    return random.choice(MOTIVATIONAL_STORIES)


def suggest_song(preferred_music: Optional[str] = None) -> dict:
    """Suggests a song based on user preferences."""
    if preferred_music:
        music_lower = preferred_music.lower()
        if any(w in music_lower for w in ["upbeat", "dance", "pop", "party", "energetic"]):
            pool = SONG_SUGGESTIONS["upbeat"]
        elif any(w in music_lower for w in ["calm", "slow", "meditation", "lofi", "classical"]):
            pool = SONG_SUGGESTIONS["calm"]
        else:
            pool = SONG_SUGGESTIONS["general"]
    else:
        pool = SONG_SUGGESTIONS["general"]

    return random.choice(pool)


def suggest_movie() -> dict:
    """Suggests a comforting movie or show."""
    return random.choice(MOVIE_SUGGESTIONS)


def end_session() -> dict:
    """Marks the session as ended and returns a closing message."""
    return {
        "status": "ended",
        "message": (
            "You made it through this moment. That took courage. "
            "If things feel heavy again, come back anytime. "
            "You're not alone in this."
        ),
    }
