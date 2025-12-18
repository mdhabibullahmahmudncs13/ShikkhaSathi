from typing import Optional
from pydantic import BaseModel, EmailStr, validator
from datetime import datetime
from app.models.user import UserRole, Medium


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    grade: Optional[int] = None
    medium: Optional[Medium] = None
    role: UserRole = UserRole.STUDENT
    is_active: bool = True

    @validator('grade')
    def validate_grade(cls, v, values):
        if v is not None and (v < 6 or v > 12):
            raise ValueError('Grade must be between 6 and 12')
        return v


class UserCreate(UserBase):
    password: str

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    grade: Optional[int] = None
    medium: Optional[Medium] = None
    is_active: Optional[bool] = None

    @validator('grade')
    def validate_grade(cls, v):
        if v is not None and (v < 6 or v > 12):
            raise ValueError('Grade must be between 6 and 12')
        return v


class UserInDBBase(UserBase):
    id: str
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


class User(UserInDBBase):
    pass


class UserInDB(UserInDBBase):
    password_hash: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str