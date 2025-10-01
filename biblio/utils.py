# utils.py

def log(message):
    print(f"[LOG] {message}")

def validate_user(user):
    if not isinstance(user, dict) or 'name' not in user or 'role' not in user:
        raise ValueError("User must be a dictionary with 'name' and 'role'.")
    if user['role'] not in ['member', 'admin', 'guest']:
        raise ValueError("User role must be 'member', 'admin', or 'guest'.")