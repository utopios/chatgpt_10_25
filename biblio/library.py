# library.py

class Library:
    def __init__(self):
        self.books = []

    def add_book(self, book):
        if not isinstance(book, dict) or 'title' not in book or 'author' not in book:
            raise ValueError("Book must be a dictionary with 'title' and 'author'.")
        self.books.append(book)

    def remove_book(self, title):
        self.books = [book for book in self.books if book['title'] != title]

    def find_book(self, title):
        for book in self.books:
            if book['title'] == title:
                return book
        return None

    def list_books(self):
        return [book['title'] for book in self.books]