# loans.py

import datetime
from library import Library
from users import User

class Loan:
    def __init__(self, book, user):
        self.book = book
        self.user = user
        self.date_borrowed = datetime.datetime.now()
        self.date_due = self.date_borrowed + datetime.timedelta(days=14)

class LoanManager:
    def __init__(self):
        self.loans = []

    def create_loan(self, book, user):
        if self.is_book_loaned(book):
            raise ValueError("Book is already loaned.")
        loan = Loan(book, user)
        self.loans.append(loan)

    def return_loan(self, book_title):
        self.loans = [loan for loan in self.loans if loan.book['title'] != book_title]

    def is_book_loaned(self, book):
        for loan in self.loans:
            if loan.book == book:
                return True
        return False