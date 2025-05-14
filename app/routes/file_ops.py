from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..models.file import File as FileModel
from ..utils.auth import get_current_user
from ..utils.file_validation import validate_file
from ..utils.encryption import encrypt_url
import os
import aiofiles
from typing import List
from datetime import datetime

router = APIRouter()

# Custom dependency to check if user is ops
async def get_current_ops_user(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == current_user).first()
    if not user.is_ops:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation not permitted for non-ops users"
        )
    return user

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_ops_user)
):
    # Validate file
    await validate_file(file)
    
    # Create upload directory if it doesn't exist
    upload_dir = os.path.join("app", "static", "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(upload_dir, filename)
    
    # Save file
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    
    # Create file record in database
    db_file = FileModel(
        filename=file.filename,
        file_path=file_path,
        file_type=file.content_type,
        uploaded_by=current_user.id,
        file_size=len(content)
    )
    
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    
    # Generate download URL
    download_url = encrypt_url(db_file.id)
    db_file.download_url = download_url
    db.commit()
    
    return {
        "message": "File uploaded successfully",
        "filename": file.filename,
        "download_url": download_url
    }

@router.get("/files")
async def list_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_ops_user)
):
    files = db.query(FileModel).all()
    return files 