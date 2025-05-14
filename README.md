# Secure File-Sharing System

A secure file-sharing system built with FastAPI, SQLAlchemy, and PostgreSQL.

## Features

- User Authentication (JWT-based)
- Role-based access (Operations and Client users)
- Secure file upload (.pptx, .docx, .xlsx)
- Email verification
- Encrypted download URLs
- File type validation
- Secure file storage

## Setup

1. Clone the repository
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a PostgreSQL database named 'fileshare'

5. Create a `.env` file with the following variables:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost/fileshare
   SECRET_KEY=your-secret-key-here-change-in-production
   ENCRYPTION_KEY=your-encryption-key-here-change-in-production
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-email-password
   MAIL_FROM=your-email@gmail.com
   MAIL_PORT=587
   MAIL_SERVER=smtp.gmail.com
   BASE_URL=http://localhost:8000
   ```

6. Run the application:
   ```bash
   python -m uvicorn app.main:app --reload
   ```

7. Access the API documentation at `http://localhost:8000/docs`

## API Endpoints

### Authentication
- POST `/auth/signup` - Client user registration
- POST `/auth/token` - Login for access token
- GET `/auth/verify/{token}` - Email verification

### Operations (Ops Users)
- POST `/ops/upload` - Upload files
- GET `/ops/files` - List all files

### Client
- GET `/client/files` - List available files
- GET `/client/download/{token}` - Download file with secure token

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- File type validation
- Encrypted download URLs
- Email verification
- Role-based access control

## Development

To run tests:
```bash
pytest
```

## License

MIT 