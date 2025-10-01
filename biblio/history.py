# history.py

class History:
    def __init__(self):
        self.history = []

    def add_entry(self, book, user, action):
        entry = {
            "book_title": book["title"],
            "user_name": user.name,
            "action": action
        }
        self.history.append(entry)

    def list_history(self):
        return self.history