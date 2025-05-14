from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FileBase(BaseModel):
    filename: str
    file_type: str
    file_size: int

class FileCreate(FileBase):
    pass

class FileInDB(FileBase):
    id: int
    file_path: str
    uploaded_by: int
    upload_date: datetime
    download_url: Optional[str] = None

    class Config:
        from_attributes = True

class FileResponse(BaseModel):
    filename: str
    upload_date: datetime
    file_type: str
    file_size: int
    download_url: str 