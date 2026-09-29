"""
First 30 Minutes – Agent Service
Handles LLM interaction with multi-provider support:
  - Ollama (default, free, local)
  - OpenAI (optional)
  - Anthropic (optional)
Falls back gracefully if Strands SDK is unavailable.
"""

import json
import logging
import random
from typing import Optional, List, Dict, Any

from app.core.config import settings
from app.services.agent.prompts import build_system_prompt
from app.services.agent.tools import (
    classify_severity,
    get_crisis_resources,
    suggest_low_severity_actions,
    suggest_moderate_severity_actions,
    generate_motivational_story,
    suggest_song,
    suggest_movie,
)
from app.services.agent.resources import CRISIS_RESOURCES

logger = logging.getLogger(__name__)


# ── LLM client factory ────────────────────────────────────────────────────────

def _get_ollama_response(messages: List[Dict], system: str) -> str:
    """Call Ollama local model."""
    try:
        import ollama as ollama_client
        full_messages = [{"role": "system", "content": system}] + messages
        response = ollama_client.chat(
            model=settings.OLLAMA_MODEL,
            messages=full_messages,
        )
        # ollama >= 0.3 returns a ChatResponse object
        if hasattr(response, "message"):
            return response.message.content
        # dict fallback
        return response["message"]["content"]
    except Exception as e:
        logger.error(f"Ollama error: {e}")
        raise


def _get_openai_response(messages: List[Dict], system: str) -> str:
    """Call OpenAI API."""
    try:
        from openai import OpenAI
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        full_messages = [{"role": "system", "content": system}] + messages
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=full_messages,
            temperature=0.7,
            max_tokens=600,
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"OpenAI error: {e}")
        raise


def _get_anthropic_response(messages: List[Dict], system: str) -> str:
    """Call Anthropic Claude API."""
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=600,
            system=system,
            messages=messages,
        )
        return response.content[0].text
    except Exception as e:
        logger.error(f"Anthropic error: {e}")
        raise


def _call_llm(messages: List[Dict], system: str) -> str:
    """Route to the configured LLM provider."""
    provider = settings.LLM_PROVIDER.lower()

    if provider == "openai" and settings.OPENAI_API_KEY:
        return _get_openai_response(messages, system)
    elif provider == "anthropic" and settings.ANTHROPIC_API_KEY:
        return _get_anthropic_response(messages, system)
    else:
        # Default: Ollama (free, local)
        return _get_ollama_response(messages, system)


# ── Severity detection helper ─────────────────────────────────────────────────

def _detect_severity_from_reply(reply: str, user_message: str) -> Optional[str]:
    """
    Extract severity from LLM reply if it mentions it,
    plus run rule-based classifier as safety net.
    """
    rule_severity = classify_severity(user_message)
    if rule_severity == "High":
        return "High"

    reply_lower = reply.lower()
    if any(w in reply_lower for w in ["high severity", "[high]", "crisis resources", "helpline"]):
        return "High"
    if any(w in reply_lower for w in ["moderate severity", "[moderate]", "panic", "breathing exercise"]):
        return "Moderate"

    return rule_severity  # Low or whatever rule-based returns


# ── Main agent function ───────────────────────────────────────────────────────

class AgentService:

    def __init__(self, user_profile: Dict[str, Any], emergency_contacts: List[Dict]):
        self.profile = user_profile
        self.emergency_contacts = emergency_contacts
        self.system_prompt = build_system_prompt(
            nickname=user_profile.get("nickname", "friend"),
            support_tone=user_profile.get("support_tone", "Neutral"),
            favourite_food=user_profile.get("favourite_food"),
            preferred_music=user_profile.get("preferred_music"),
            comfort_activities=user_profile.get("comfort_activities"),
            behavioural_notes=user_profile.get("behavioural_notes"),
            emergency_contacts=emergency_contacts,
        )

    def chat(
        self,
        user_message: str,
        history: List[Dict],
    ) -> Dict[str, Any]:
        """
        Process one turn of conversation.
        Returns reply + severity + optional routing data.
        """
        messages = history + [{"role": "user", "content": user_message}]

        # Quick rule-based severity check for immediate safety
        quick_severity = classify_severity(user_message)

        try:
            reply = _call_llm(messages, self.system_prompt)
        except Exception as e:
            logger.error(f"LLM call failed: {e}")
            reply = self._fallback_response(quick_severity)

        severity = _detect_severity_from_reply(reply, user_message)

        # Build structured response
        result: Dict[str, Any] = {
            "reply": reply,
            "severity": severity,
            "crisis_resources": None,
            "suggested_actions": None,
            "emergency_contacts": None,
        }

        if severity == "High":
            result["crisis_resources"] = get_crisis_resources()
            if self.emergency_contacts:
                result["emergency_contacts"] = self.emergency_contacts

        elif severity == "Moderate":
            result["suggested_actions"] = suggest_moderate_severity_actions(
                comfort_activities=self.profile.get("comfort_activities"),
                behavioural_notes=self.profile.get("behavioural_notes"),
            )

        elif severity == "Low":
            # Randomly pick one low-severity enrichment
            choice = random.randint(0, 2)
            if choice == 0:
                story = generate_motivational_story()
                result["motivational_story"] = story
            elif choice == 1:
                song = suggest_song(self.profile.get("preferred_music"))
                result["suggested_song"] = song
            else:
                movie = suggest_movie()
                result["suggested_movie"] = movie

            result["suggested_actions"] = suggest_low_severity_actions(
                favourite_food=self.profile.get("favourite_food"),
                comfort_activities=self.profile.get("comfort_activities"),
            )

        return result

    def _fallback_response(self, severity: str) -> str:
        """Safe fallback when LLM is unavailable."""
        if severity == "High":
            return (
                "I'm here with you. Please reach out to a real person right now – "
                "Tele-MANAS: 14416 | iCall: 9152987821 | AASRA: 9820466627. "
                "You don't have to go through this alone. Please call one of these numbers."
            )
        elif severity == "Moderate":
            return (
                "Hey, I hear you. Let's take one breath together – in for 4, hold for 4, out for 6. "
                "You're safe right now. Tell me what's happening."
            )
        return (
            "I'm here. It sounds like things are tough right now. "
            "You reached out – that already took courage. Tell me more, I'm listening."
        )
