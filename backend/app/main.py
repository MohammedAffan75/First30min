from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, profile, chat

# Import all models so SQLAlchemy creates their tables
import app.models  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables on startup
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="First 30 Minutes API",
    description="AI-powered mental health crisis router for students and young professionals.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(auth.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(chat.router, prefix="/api")


@app.get("/")
def root():
    return {
        "app": "First 30 Minutes",
        "status": "running",
        "disclaimer": "This is an AI support router, not a therapist or crisis service.",
    }


@app.get("/health")
def health():
    return {"status": "ok"}
