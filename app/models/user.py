from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.sql import func
from ..database import Base
from datetime import datetime, timedelta

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_ops = Column(Boolean, default=False)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    verification_token = Column(String, unique=True, nullable=True)
    verification_token_expires = Column(DateTime(timezone=True), nullable=True)
    reset_token = Column(String, unique=True, nullable=True)
    reset_token_expires = Column(DateTime(timezone=True), nullable=True)
    encrypted_url = Column(String, unique=True, nullable=True)

    def is_verification_token_valid(self) -> bool:
        if not self.verification_token or not self.verification_token_expires:
            return False
        return datetime.utcnow() <= self.verification_token_expires

    def is_reset_token_valid(self) -> bool:
        if not self.reset_token or not self.reset_token_expires:
            return False
        return datetime.utcnow() <= self.reset_token_expires 