from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base

class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    file_path = Column(String)
    file_type = Column(String)
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    download_url = Column(String, unique=True)
    file_size = Column(Integer)  # in bytes 