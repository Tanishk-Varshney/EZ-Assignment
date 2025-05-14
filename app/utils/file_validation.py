from fastapi import HTTPException, UploadFile
from typing import List
import os

ALLOWED_EXTENSIONS = {'.pptx', '.docx', '.xlsx'}
ALLOWED_MIME_TYPES = {
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',  # pptx
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',   # docx
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'          # xlsx
}

def validate_file_extension(filename: str) -> bool:
    return any(filename.lower().endswith(ext) for ext in ALLOWED_EXTENSIONS)

async def validate_file_type(file: UploadFile) -> bool:
    return file.content_type in ALLOWED_MIME_TYPES

async def validate_file(file: UploadFile):
    if not validate_file_extension(file.filename):
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types are: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    if not await validate_file_type(file):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type detected"
        ) 