# users.py

class User:
    def __init__(self, name, role="member"):
        self.name = name
        self.role = role

class UserManager:
    def __init__(self):
        self.users = []

    def add_user(self, user):
        if not isinstance(user, User):
            raise ValueError("Only User instances can be added.")
        self.users.append(user)

    def remove_user(self, name):
        self.users = [user for user in self.users if user.name != name]

    def find_user(self, name):
        for user in self.users:
            if user.name == name:
                return user
        return None

    def list_users(self):
        return [user.name for user in self.users]