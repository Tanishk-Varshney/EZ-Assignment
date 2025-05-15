from flask import Flask, request, jsonify, send_from_directory
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
from datetime import timedelta
import time

app = Flask(__name__)
CORS(app)

# Configuration
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')  # Change in production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

jwt = JWTManager(app)

# In-memory storage (replace with a database in production)
users = {}
files = {}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/ops/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({"msg": "Missing username or password"}), 400
            
        username = data['username']
        password = data['password']
        
        if username in users and check_password_hash(users[username]['password'], password):
            access_token = create_access_token(identity=username)
            return jsonify(access_token=access_token), 200
        return jsonify({"msg": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"msg": "An error occurred", "error": str(e)}), 500

@app.route('/client/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"msg": "Missing email or password"}), 400
            
        email = data['email']
        password = data['password']
        
        if email in users:
            return jsonify({"msg": "Email already exists"}), 400
            
        users[email] = {
            'password': generate_password_hash(password),
            'files': []
        }
        return jsonify({"msg": "User created successfully"}), 201
    except Exception as e:
        return jsonify({"msg": "An error occurred", "error": str(e)}), 500

@app.route('/client/files', methods=['GET'])
@jwt_required()
def list_files():
    try:
        current_user = get_jwt_identity()
        user_files = users.get(current_user, {}).get('files', [])
        return jsonify({"files": user_files}), 200
    except Exception as e:
        return jsonify({"msg": "An error occurred", "error": str(e)}), 500

@app.route('/client/upload', methods=['POST'])
@jwt_required()
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"msg": "No file part"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"msg": "No selected file"}), 400
            
        if not allowed_file(file.filename):
            return jsonify({"msg": "File type not allowed"}), 400
            
        current_user = get_jwt_identity()
        filename = secure_filename(file.filename)
        # Add timestamp to filename to avoid duplicates
        base, ext = os.path.splitext(filename)
        filename = f"{base}_{int(time.time())}{ext}"
        
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        if current_user not in users:
            users[current_user] = {'files': []}
        users[current_user]['files'].append(filename)
        
        return jsonify({
            "msg": "File uploaded successfully",
            "filename": filename
        }), 200
    except Exception as e:
        return jsonify({"msg": "An error occurred", "error": str(e)}), 500

@app.route('/client/download/<filename>', methods=['GET'])
@jwt_required()
def download_file(filename):
    try:
        current_user = get_jwt_identity()
        if filename not in users.get(current_user, {}).get('files', []):
            return jsonify({"msg": "File not found"}), 404
            
        return send_from_directory(
            app.config['UPLOAD_FOLDER'],
            filename,
            as_attachment=True
        )
    except Exception as e:
        return jsonify({"msg": "An error occurred", "error": str(e)}), 500

# Error handlers
@app.errorhandler(413)
def too_large(e):
    return jsonify({"msg": "File is too large"}), 413

@app.errorhandler(404)
def not_found(e):
    return jsonify({"msg": "Resource not found"}), 404

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=False)  # Set to False in production 