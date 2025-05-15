import requests
import os
from pathlib import Path
import time

# API base URL
BASE_URL = 'http://127.0.0.1:5000'

def wait_for_server():
    """Wait for the server to be ready"""
    max_retries = 5
    retry_delay = 2
    
    for i in range(max_retries):
        try:
            response = requests.get(f"{BASE_URL}/")
            return True
        except requests.exceptions.ConnectionError:
            if i < max_retries - 1:
                print(f"Waiting for server to start... (attempt {i+1}/{max_retries})")
                time.sleep(retry_delay)
            else:
                print("Could not connect to server. Make sure the Flask app is running.")
                return False

def test_signup():
    print("\n=== Testing Signup ===")
    url = f"{BASE_URL}/client/signup"
    data = {
        "email": "test@example.com",
        "password": "test123"
    }
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 201
    except requests.exceptions.RequestException as e:
        print(f"Error during signup: {str(e)}")
        return False

def test_login():
    print("\n=== Testing Login ===")
    url = f"{BASE_URL}/ops/login"
    data = {
        "username": "test@example.com",
        "password": "test123"
    }
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.json().get('access_token') if response.status_code == 200 else None
    except requests.exceptions.RequestException as e:
        print(f"Error during login: {str(e)}")
        return None

def test_list_files(access_token):
    print("\n=== Testing List Files ===")
    url = f"{BASE_URL}/client/files"
    headers = {'Authorization': f'Bearer {access_token}'}
    try:
        response = requests.get(url, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except requests.exceptions.RequestException as e:
        print(f"Error during list files: {str(e)}")
        return False

def test_upload_file(access_token):
    print("\n=== Testing File Upload ===")
    url = f"{BASE_URL}/client/upload"
    headers = {'Authorization': f'Bearer {access_token}'}
    
    # Create a dummy test file
    test_file_path = "test_upload.txt"
    try:
        with open(test_file_path, "w") as f:
            f.write("This is a test file for upload")
        
        with open(test_file_path, 'rb') as file_obj:
            files = {
                'file': ('test_upload.txt', file_obj, 'text/plain')
            }
            response = requests.post(url, headers=headers, files=files)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
        # Now the file is closed, safe to remove
        os.remove(test_file_path)
        return response.json().get('filename') if response.status_code == 200 else None
    except requests.exceptions.RequestException as e:
        print(f"Error during file upload: {str(e)}")
        if os.path.exists(test_file_path):
            os.remove(test_file_path)
        return None

def test_download_file(access_token, filename):
    print("\n=== Testing File Download ===")
    url = f"{BASE_URL}/client/download/{filename}"
    headers = {'Authorization': f'Bearer {access_token}'}
    try:
        response = requests.get(url, headers=headers)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("File downloaded successfully")
            # Save the downloaded file
            download_path = f"downloaded_{filename}"
            with open(download_path, 'wb') as f:
                f.write(response.content)
            os.remove(download_path)  # Clean up downloaded file
        else:
            print(f"Response: {response.json()}")
        return response.status_code == 200
    except requests.exceptions.RequestException as e:
        print(f"Error during file download: {str(e)}")
        return False

def run_all_tests():
    print("Starting API Tests...")
    
    # Wait for server to be ready
    if not wait_for_server():
        return
    
    # Test signup
    if not test_signup():
        print("❌ Signup test failed")
        return
    print("✅ Signup test passed")
    
    # Test login
    access_token = test_login()
    if not access_token:
        print("❌ Login test failed")
        return
    print("✅ Login test passed")
    
    # Test list files
    if not test_list_files(access_token):
        print("❌ List files test failed")
        return
    print("✅ List files test passed")
    
    # Test file upload
    uploaded_filename = test_upload_file(access_token)
    if not uploaded_filename:
        print("❌ File upload test failed")
        return
    print("✅ File upload test passed")
    
    # Test file download
    if not test_download_file(access_token, uploaded_filename):
        print("❌ File download test failed")
        return
    print("✅ File download test passed")
    
    print("\n🎉 All tests completed successfully!")

if __name__ == "__main__":
    # Ensure the uploads directory exists
    Path("uploads").mkdir(exist_ok=True)
    run_all_tests() 