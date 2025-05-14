from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..models.file import File
from ..utils.auth import get_current_user
from ..utils.encryption import decrypt_url
import os

router = APIRouter()

# Custom dependency to check if user is client
async def get_current_client_user(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == current_user).first()
    if user.is_ops:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation not permitted for ops users"
        )
    return user

@router.get("/files")
async def list_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_client_user)
):
    files = db.query(File).all()
    return [
        {
            "filename": file.filename,
            "upload_date": file.upload_date,
            "file_type": file.file_type,
            "file_size": file.file_size,
            "download_url": file.download_url
        }
        for file in files
    ]

@router.get("/download/{token}")
async def download_file(
    token: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_client_user)
):
    # Decrypt and validate token
    file_id, is_valid = decrypt_url(token)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired download URL"
        )
    
    # Get file from database
    file = db.query(File).filter(File.id == file_id).first()
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    # Check if file exists in filesystem
    if not os.path.exists(file.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found on server"
        )
    
    return FileResponse(
        file.file_path,
        filename=file.filename,
        media_type=file.file_type
    ) 