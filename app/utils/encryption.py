from cryptography.fernet import Fernet
import base64
import os
from uuid import uuid4
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

# Initialize Fernet with the secret key
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", Fernet.generate_key())
fernet = Fernet(ENCRYPTION_KEY)

def generate_secure_token() -> str:
    """Generate a secure random token"""
    return base64.urlsafe_b64encode(os.urandom(32)).decode('utf-8')

def encrypt_url(file_id: int, expiry_hours: int = 24) -> str:
    """
    Create an encrypted URL for file download
    Returns: encrypted token that includes file_id and expiry time
    """
    expiry_time = datetime.utcnow() + timedelta(hours=expiry_hours)
    data = f"{file_id}:{expiry_time.timestamp()}"
    encrypted_data = fernet.encrypt(data.encode())
    return base64.urlsafe_b64encode(encrypted_data).decode()

def decrypt_url(encrypted_token: str) -> tuple[int, bool]:
    """
    Decrypt the URL token and validate expiry
    Returns: (file_id, is_valid)
    """
    try:
        encrypted_data = base64.urlsafe_b64decode(encrypted_token.encode())
        decrypted_data = fernet.decrypt(encrypted_data).decode()
        file_id, expiry_timestamp = decrypted_data.split(":")
        
        # Check if URL has expired
        expiry_time = datetime.fromtimestamp(float(expiry_timestamp))
        if expiry_time < datetime.utcnow():
            return int(file_id), False
            
        return int(file_id), True
    except Exception:
        return -1, False 