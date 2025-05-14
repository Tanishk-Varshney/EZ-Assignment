from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    is_ops: bool = False

class UserInDB(UserBase):
    id: int
    is_active: bool
    is_ops: bool
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    is_ops: Optional[bool] = None 