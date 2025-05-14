from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine
from .models import user, file

# Create database tables
user.Base.metadata.create_all(bind=engine)
file.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Secure File Sharing System")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Import and include routers
from .routes import auth, file_ops, client

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(file_ops.router, prefix="/ops", tags=["Operations"])
app.include_router(client.router, prefix="/client", tags=["Client"]) 