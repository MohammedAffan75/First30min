# First 30 Minutes 💜

An AI-powered mental health crisis router for students and young professionals.
Helps you through the first critical 20–30 minutes of a panic attack, overwhelm, or emotional crisis.

> **Disclaimer:** This is an AI support router, not a therapist or crisis service.
> Always call a real helpline if you are in immediate danger.

---

## Features

- One-tap "I need help right now" entry
- AI agent with 4 personality modes: Mother-to-Son, Father-to-Daughter, Neutral, BUA Mode (tough love, culturally Indian)
- Automatic severity classification: Low / Moderate / High
- High severity → instant crisis resources + one-tap call to your emergency contacts
- Moderate severity → grounding exercises, environment change suggestions
- Low severity → motivational micro-stories, song & movie suggestions, comfort food reminders
- Personalized profile: favourite food, music, comfort activities
- Emergency contacts (Mom, Dad, Partner, Best Friend, etc.)
- Dark / light mode
- PWA – installable on phone
- Fully local – no cloud required

---

## Tech Stack

| Layer     | Tech                                      |
|-----------|-------------------------------------------|
| Frontend  | React 18 + Vite + TypeScript + Tailwind   |
| Backend   | FastAPI + SQLAlchemy + SQLite             |
| AI Agent  | Ollama (default, free) / OpenAI / Anthropic |
| Auth      | JWT (local)                               |
| Deploy    | Docker Compose (optional)                 |

---

## How to Run Locally

### Prerequisites
- Python 3.11+
- Node.js 18+
- [Ollama](https://ollama.com) (for free local AI) – or an OpenAI/Anthropic API key

### 1. Backend

```bash
cd backend

# Copy environment config
cp .env.example .env
# Edit .env and set your LLM_PROVIDER (ollama is default)

# Create virtual environment
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run
uvicorn app.main:app --reload --port 8000
```

Backend starts at http://localhost:8000
API docs at http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend

npm install
npm run dev
```

Frontend starts at http://localhost:5173

### 3. Set up Ollama (free, local AI)

```bash
# Install from https://ollama.com
ollama pull llama3
ollama serve
```

That's it – the app will use llama3 by default.

---

## With Docker

```bash
cp backend/.env.example backend/.env
# Edit backend/.env

docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

---

## Environment Variables

| Variable                     | Default                        | Description                            |
|------------------------------|--------------------------------|----------------------------------------|
| `LLM_PROVIDER`               | `ollama`                       | `ollama` / `openai` / `anthropic`      |
| `OLLAMA_BASE_URL`             | `http://localhost:11434`       | Ollama server URL                      |
| `OLLAMA_MODEL`                | `llama3`                       | Model name for Ollama                  |
| `OPENAI_API_KEY`              | _(empty)_                      | Optional – only if using OpenAI        |
| `ANTHROPIC_API_KEY`           | _(empty)_                      | Optional – only if using Anthropic     |
| `SECRET_KEY`                  | _(change this!)_               | JWT signing key                        |
| `DATABASE_URL`                | `sqlite:///./first30.db`       | SQLite by default                      |
| `CORS_ORIGINS`                | `http://localhost:5173`        | Allowed frontend origins               |

---

## Crisis Helplines (Always Available)

| Name                  | Number         | Region        |
|-----------------------|----------------|---------------|
| Tele-MANAS            | 14416          | India (24/7)  |
| iCall (TISS)          | 9152987821     | India         |
| AASRA                 | 9820466627     | India (24/7)  |
| Vandrevala Foundation | 9999666555     | India (24/7)  |
| 988 Suicide Lifeline  | 988            | USA (24/7)    |
| Crisis Text Line      | Text HOME to 741741 | US/UK/CA |

---

## Safety Notice

- This app never diagnoses any condition
- It never claims to be a therapist, doctor, or real parent figure
- High severity always shows crisis resources first
- BUA Mode is culturally playful but always caring underneath – no body shaming, no academic pressure
- All crisis helpline numbers are hardcoded and always visible
- Users can end a session or access helplines at any time

---

## Project Structure

```
first-30-minutes/
├── frontend/               # React + Vite app
│   └── src/
│       ├── pages/          # LoginPage, RegisterPage, ChatPage, ProfilePage, OnboardingPage
│       ├── components/     # Disclaimer, HelplineBar, CrisisCard, SuggestionCard
│       ├── context/        # AuthContext, ThemeContext
│       └── lib/            # axios api client
├── backend/
│   └── app/
│       ├── api/            # auth, profile, chat routes
│       ├── core/           # config, security, database
│       ├── models/         # SQLAlchemy models
│       ├── schemas/        # Pydantic schemas
│       └── services/agent/ # Agent, tools, prompts, resources
├── docker-compose.yml
└── README.md
```

---

Made with 💜 for people who need it.
