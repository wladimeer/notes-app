from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.user import User
from schemas.user import UserBase
from utils.helpers import hash_value


async def register_user(db: AsyncSession, user: UserBase):
    db_user = await db.execute(select(User).filter(User.username == user.username))
    db_user = db_user.scalar_one_or_none()

    if db_user:
        return None

    db_user = User(
        username=user.username,
        password=hash_value(user.password),
        created_at=user.created_at,
        updated_at=user.updated_at,
    )

    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)

    return db_user


async def get_user_by_username(db: AsyncSession, username: str):
    db_user = await db.execute(select(User).filter(User.username == username))
    return db_user.scalar_one_or_none()
