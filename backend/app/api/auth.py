from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User, UserProfile
from app.schemas.user import UserRegister, UserLogin, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(email=payload.email, hashed_password=hash_password(payload.password))
    db.add(user)
    db.flush()  # get user.id before commit

    profile = UserProfile(user_id=user.id, nickname=payload.nickname)
    db.add(profile)
    db.commit()
    db.refresh(user)

    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token, user_id=user.id, nickname=payload.nickname)


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    nickname = user.profile.nickname if user.profile else user.email
    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token, user_id=user.id, nickname=nickname)
