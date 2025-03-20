import bcrypt
from datetime import datetime


def hash_value(value: str) -> str:
    return bcrypt.hashpw(value.encode(), bcrypt.gensalt()).decode()


def check_value(value: str, hashed_value: str) -> bool:
    return bcrypt.checkpw(value.encode(), hashed_value.encode())


def compare_dates(date1: str, date2: str) -> bool:
    datetime1 = datetime.strptime(date1, "%Y-%m-%d %H:%M:%S")
    datetime2 = datetime.strptime(date2, "%Y-%m-%d %H:%M:%S")

    return datetime1 == datetime2
