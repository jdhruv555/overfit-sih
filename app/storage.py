import hashlib
from cryptography.fernet import Fernet
import os

UPLOAD_DIR = "secure_storage"

def compute_sha256(file_bytes: bytes) -> str:
    sha256_hash = hashlib.sha256()
    sha256_hash.update(file_bytes)
    return sha256_hash.hexdigest()

# Generate a key once and store securely (e.g., in env variable)
# #todo move to better technologies like HSM
# For demonstration, we store it in a file but in production we will move to HSM
if not os.path.exists("secret.key"):
    with open("secret.key", "wb") as f:
        f.write(Fernet.generate_key())

# Load the saved key
with open("secret.key", "rb") as f:
    key = f.read()

cipher = Fernet(key)

def encrypt_file(file_bytes: bytes) -> bytes:
    return cipher.encrypt(file_bytes)

def decrypt_file(encrypted_bytes: bytes) -> bytes:
    return cipher.decrypt(encrypted_bytes)

def save_encrypted_file(file_bytes: bytes, filename: str) -> str:
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)
    
    encrypted_data = encrypt_file(file_bytes)
    file_path = os.path.join(UPLOAD_DIR, filename + ".enc")

    with open(file_path, "wb") as f:
        f.write(encrypted_data)

    return file_path