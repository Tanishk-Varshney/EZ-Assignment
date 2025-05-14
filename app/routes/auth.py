from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..utils.auth import verify_password, get_password_hash, create_access_token
from ..utils.email import send_verification_email, send_password_reset_email
from ..utils.encryption import generate_secure_token
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import timedelta, datetime

router = APIRouter()

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    is_ops: bool = False

class Token(BaseModel):
    access_token: str
    token_type: str

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordReset(BaseModel):
    token: str
    new_password: str

class EmailRequest(BaseModel):
    email: EmailStr

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create verification token
    verification_token = generate_secure_token()
    verification_token_expires = datetime.utcnow() + timedelta(hours=24)  # Token expires in 24 hours
    
    # Create user
    db_user = User(
        email=user.email,
        hashed_password=get_password_hash(user.password),
        is_ops=user.is_ops,
        verification_token=verification_token,
        verification_token_expires=verification_token_expires
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Send verification email
    await send_verification_email(user.email, verification_token)
    
    return {"message": "User created. Please check your email for verification."}

@router.post("/token", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email not verified"
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email, "is_ops": user.is_ops},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/verify/{token}")
async def verify_email(token: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token"
        )
    
    if not user.is_verification_token_valid():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification token has expired. Please request a new verification email."
        )
    
    user.is_active = True
    user.verification_token = None
    user.verification_token_expires = None
    db.commit()
    
    return {"message": "Email verified successfully"}

@router.post("/forgot-password")
async def forgot_password(request: PasswordResetRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == request.email).first()
        if not user:
            # Return success even if user doesn't exist to prevent email enumeration
            return {"message": "If an account exists with this email, a password reset link will be sent."}
        
        # Generate reset token
        reset_token = generate_secure_token()
        user.reset_token = reset_token
        db.commit()
        
        # Send reset email
        await send_password_reset_email(user.email, reset_token)
        
        return {"message": "If an account exists with this email, a password reset link will be sent."}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/reset-password")
async def reset_password(reset_data: PasswordReset, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_token == reset_data.token).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Update password and clear reset token
    user.hashed_password = get_password_hash(reset_data.new_password)
    user.reset_token = None
    db.commit()
    
    return {"message": "Password has been reset successfully"}

@router.post("/resend-verification")
async def resend_verification(request: EmailRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        # Return success even if user doesn't exist to prevent email enumeration
        return {"message": "If an account exists with this email, a verification link will be sent."}
    
    if user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already verified"
        )
    
    # Generate new verification token
    verification_token = generate_secure_token()
    verification_token_expires = datetime.utcnow() + timedelta(hours=24)
    
    user.verification_token = verification_token
    user.verification_token_expires = verification_token_expires
    db.commit()
    
    # Send verification email
    await send_verification_email(user.email, verification_token)
    
    return {"message": "If an account exists with this email, a verification link will be sent."} 