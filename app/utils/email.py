from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr, BaseModel
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class EmailConfig(BaseModel):
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int
    MAIL_SERVER: str

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME", ""),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", ""),
    MAIL_FROM=os.getenv("MAIL_FROM", "your@email.com"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_SSL_TLS=True,
    MAIL_STARTTLS=False,
    USE_CREDENTIALS=True
)

async def send_verification_email(email: EmailStr, token: str):
    base_url = os.getenv("BASE_URL", "http://localhost:8000")
    verify_url = f"{base_url}/auth/verify/{token}"
    
    html_content = f"""
    <html>
        <body>
            <h2>Verify your email address</h2>
            <p>Please click the link below to verify your email:</p>
            <p><a href="{verify_url}">{verify_url}</a></p>
            <p>If you did not request this verification, please ignore this email.</p>
        </body>
    </html>
    """
    
    message = MessageSchema(
        subject="Verify your email",
        recipients=[email],
        body=html_content,
        subtype=MessageType.html
    )
    
    fm = FastMail(conf)
    await fm.send_message(message)

async def send_password_reset_email(email: EmailStr, token: str):
    base_url = os.getenv("BASE_URL", "http://localhost:5174")
    reset_url = f"{base_url}/reset-password/{token}"
    
    html_content = f"""
    <html>
        <body>
            <h2>Reset your password</h2>
            <p>You have requested to reset your password. Please click the link below to set a new password:</p>
            <p><a href="{reset_url}">{reset_url}</a></p>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not request this password reset, please ignore this email.</p>
        </body>
    </html>
    """
    
    message = MessageSchema(
        subject="Reset your password",
        recipients=[email],
        body=html_content,
        subtype=MessageType.html
    )
    
    fm = FastMail(conf)
    await fm.send_message(message) 