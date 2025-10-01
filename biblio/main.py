# main.py

from library import Library
from users import User, UserManager
from loans import LoanManager
from notifications import NotificationManager
from history import History

# Initialiser les gestionnaires
library = Library()
user_manager = UserManager()
loan_manager = LoanManager()
notification_manager = NotificationManager()
history = History()

# 1. Ajouter des utilisateurs
print("=== Gestion des Utilisateurs ===")
user1 = User(name="Alice", role="member")
user2 = User(name="Bob", role="admin")
user_manager.add_user(user1)
user_manager.add_user(user2)
print("Utilisateurs ajoutés :", user_manager.list_users())

# 2. Ajouter des livres à la bibliothèque
print("\n=== Gestion des Livres ===")
book1 = {"title": "Python Basics", "author": "John Doe"}
book2 = {"title": "Advanced Python", "author": "Jane Doe"}
library.add_book(book1)
library.add_book(book2)
print("Livres ajoutés :", library.list_books())

# 3. Emprunter un livre
print("\n=== Gestion des Emprunts ===")
loan_manager.create_loan(book1, user1)
print(f"Livre '{book1['title']}' emprunté par {user1.name} :", loan_manager.is_book_loaned(book1))

# Tenter d'emprunter un livre déjà emprunté
try:
    loan_manager.create_loan(book1, user2)
except ValueError as e:
    print("Erreur d'emprunt :", e)

# Retourner un livre
loan_manager.return_loan(book1["title"])
print(f"Livre '{book1['title']}' emprunté après retour :", loan_manager.is_book_loaned(book1))

# 4. Envoyer une notification à un utilisateur
print("\n=== Notifications ===")
notification_manager.send_notification(user1, "Votre livre est en retard.")
notification_manager.send_notification(user2, "Une réunion administrative est prévue.")
print("Notifications pour Alice :", notification_manager.list_notifications(user1))
print("Toutes les notifications :", notification_manager.list_notifications())

# 5. Historique des emprunts et actions
print("\n=== Historique des Actions ===")
history.add_entry(book1, user1, action="borrowed")
history.add_entry(book2, user2, action="borrowed")
history.add_entry(book1, user1, action="returned")
print("Historique des actions :", history.list_history())