import bcrypt


def hash_value(value: str) -> str:
    return bcrypt.hashpw(value.encode(), bcrypt.gensalt()).decode()


def check_value(value: str, hashed_value: str) -> bool:
    return bcrypt.checkpw(value.encode(), hashed_value.encode())
