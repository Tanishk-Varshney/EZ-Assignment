from .auth import router as auth_router
from .file_ops import router as file_ops_router
from .client import router as client_router

__all__ = ['auth_router', 'file_ops_router', 'client_router'] 