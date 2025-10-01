# notifications.py

from datetime import datetime

class NotificationManager:
    def __init__(self):
        self.notifications = []

    def send_notification(self, user, message):
        timestamp = datetime.now().isoformat()
        notification = {
            "user": user.name,
            "message": message,
            "timestamp": timestamp
        }
        self.notifications.append(notification)

    def list_notifications(self, user=None):
        if user:
            return [notif for notif in self.notifications if notif["user"] == user.name]
        return self.notifications