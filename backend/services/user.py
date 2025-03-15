from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserBase
from utils.helpers import hash_value


def register_user(db: Session, user: UserBase):
    db_user = db.query(User).filter(User.username == user.username).first()

    if db_user:
        return None

    db_user = User(
        username=user.username,
        password=hash_value(user.password),
        created_at=user.created_at,
        updated_at=user.updated_at,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()
