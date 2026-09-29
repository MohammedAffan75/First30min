"""
Hardcoded crisis resources – India + Global.
These are ALWAYS shown for High severity and always accessible.
"""

CRISIS_RESOURCES = [
    # India
    {"name": "Tele-MANAS (Govt. of India)", "number": "14416", "region": "India", "available": "24/7"},
    {"name": "iCall (TISS)", "number": "9152987821", "region": "India", "available": "Mon–Sat 8am–10pm"},
    {"name": "AASRA", "number": "9820466627", "region": "India", "available": "24/7"},
    {"name": "Vandrevala Foundation", "number": "9999666555", "region": "India", "available": "24/7"},
    {"name": "Snehi", "number": "044-24640050", "region": "India", "available": "24/7"},
    # Global
    {"name": "988 Suicide & Crisis Lifeline", "number": "988", "region": "USA", "available": "24/7"},
    {"name": "Crisis Text Line", "number": "Text HOME to 741741", "region": "USA/Canada/UK", "available": "24/7"},
    {"name": "Samaritans (UK)", "number": "116 123", "region": "UK", "available": "24/7"},
]

MOTIVATIONAL_STORIES = [
    {
        "title": "The Night Before the Interview",
        "story": (
            "Arjun couldn't sleep the night before his dream job interview. "
            "His hands shook, his mind raced. He called his old professor at 2am – "
            "who simply said: 'You've prepared. Your anxiety means you care. That's good.' "
            "He got the job. Today he coaches others through the same fear."
        ),
    },
    {
        "title": "Three Fails, One Yes",
        "story": (
            "Priya failed her CA exam three times. Her family was disappointed. "
            "She took a month off, walked by the sea every morning, journaled every night. "
            "On attempt four, she cleared it in the top 50. "
            "She says the three failures taught her more than the pass did."
        ),
    },
    {
        "title": "The Breakup That Built a Business",
        "story": (
            "After a painful breakup, Rohan threw himself into baking – something he'd always wanted to try. "
            "Six months later he had a small home bakery with 200 regular customers. "
            "He didn't plan it. He just needed something to do with his hands."
        ),
    },
    {
        "title": "Panic at the Podium",
        "story": (
            "Meera froze during her TEDx talk. Completely froze. "
            "She took a breath, looked at one friendly face in the crowd, and said: "
            "'Give me a second – I'm a little nervous and that's okay.' "
            "The applause she got in that moment was louder than the end of her speech."
        ),
    },
    {
        "title": "Small Steps",
        "story": (
            "Karthik was too anxious to leave his apartment for two weeks. "
            "His therapist gave him one task: open the door and stand outside for 30 seconds. "
            "That was all. He did it. Then the next day, 60 seconds. "
            "Today he runs a marathon every year. Every big journey starts with 30 seconds."
        ),
    },
    {
        "title": "The Message That Changed Everything",
        "story": (
            "Ananya felt invisible in her new city. "
            "One day she messaged an old school friend she hadn't spoken to in years: 'Hey, thinking of you.' "
            "That friend flew in to visit her the next month. "
            "Sometimes the smallest reach out creates the biggest lifelines."
        ),
    },
]

SONG_SUGGESTIONS = {
    "general": [
        {"title": "Kun Faya Kun", "artist": "A.R. Rahman", "vibe": "peaceful, grounding"},
        {"title": "Fix You", "artist": "Coldplay", "vibe": "emotional release, hopeful"},
        {"title": "Breathe (2 AM)", "artist": "Anna Nalick", "vibe": "calm, self-compassionate"},
        {"title": "Ae Dil Hai Mushkil", "artist": "Arijit Singh", "vibe": "emotional, cathartic"},
        {"title": "Better Days", "artist": "OneRepublic", "vibe": "uplifting, hopeful"},
        {"title": "Tum Hi Ho", "artist": "Arijit Singh", "vibe": "warm, comforting"},
    ],
    "upbeat": [
        {"title": "Ghungroo", "artist": "Arijit Singh / Shilpa Rao", "vibe": "energetic, joyful"},
        {"title": "Levitating", "artist": "Dua Lipa", "vibe": "fun, light"},
        {"title": "Dynamite", "artist": "BTS", "vibe": "happy, energizing"},
    ],
    "calm": [
        {"title": "Namo Namo", "artist": "Amit Trivedi", "vibe": "meditative, grounding"},
        {"title": "The Night We Met", "artist": "Lord Huron", "vibe": "reflective, gentle"},
        {"title": "Yellow", "artist": "Coldplay", "vibe": "warm, steady"},
    ],
}

MOVIE_SUGGESTIONS = [
    {"title": "Taare Zameen Par", "type": "Bollywood", "reason": "gentle reminder that everyone learns differently"},
    {"title": "Dear Zindagi", "type": "Bollywood", "reason": "therapy, self-acceptance, finding peace"},
    {"title": "Inside Out", "type": "Animation", "reason": "understanding your own emotions beautifully"},
    {"title": "The Pursuit of Happyness", "type": "Hollywood", "reason": "resilience and never giving up"},
    {"title": "Chhichhore", "type": "Bollywood", "reason": "finding meaning in failure, friendship"},
    {"title": "Soul", "type": "Animation", "reason": "purpose, living in the moment, what makes you 'you'"},
    {"title": "Zindagi Na Milegi Dobara", "type": "Bollywood", "reason": "friendship, living fully, facing fears"},
]
