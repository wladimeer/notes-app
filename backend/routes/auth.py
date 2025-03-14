from schemas.user import UserBase
from fastapi import APIRouter, Depends, HTTPException
import utils.constants as constants
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from utils.helpers import hash_value, check_value

router = APIRouter(prefix=constants.AUTH_PREFIX, tags=["auth"])


@router.post(constants.USER_REGISTER_ENDPOINT)
async def get_notes(user: UserBase, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()

    if db_user:
        raise HTTPException(status_code=400, detail=constants.INCORRECT_PASSWORD)

    try:
        db_user = User(
            username=user.username,
            password=hash_value(user.password),
            created_at=user.created_at,
            updated_at=user.updated_at,
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        return {"message": constants.USER_REGISTERED}

    except:
        db.rollback()
        raise HTTPException(status_code=500, detail=constants.EXCEPTION_MESSAGE)


@router.post(constants.USER_LOGIN_ENDPOINT)
async def get_notes(user: UserBase, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()

    if db_user is None:
        raise HTTPException(status_code=404, detail=constants.USER_NOT_FOUND)

    is_same = check_value(user.password, db_user.password)

    if not is_same:
        raise HTTPException(status_code=400, detail=constants.INCORRECT_PASSWORD)

    return {"message": f"Sesión iniciada correctamente"}
