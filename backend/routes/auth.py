from schemas.user import UserBase
from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
import utils.constants as constants
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from utils.helpers import hash_value, check_value
from resources.security import generate_token
from config import config

router = APIRouter(prefix=constants.AUTH_PREFIX, tags=[constants.AUTH_TAG])


@router.post(constants.USER_REGISTER_ENDPOINT)
async def register(user: UserBase, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()

    if db_user:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": constants.USER_ALREADY_REGISTERED},
        )

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

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": constants.USER_REGISTERED},
        )

    except:
        db.rollback()

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": constants.EXCEPTION_MESSAGE},
        )


@router.post(constants.USER_LOGIN_ENDPOINT)
async def login(user: UserBase, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()

    if db_user is None:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": constants.VERIFY_CREDENTIAL},
        )

    is_same = check_value(user.password, db_user.password)

    if not is_same:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": constants.VERIFY_CREDENTIAL},
        )

    new_user = UserBase(
        password="",
        username=user.username,
        id=db_user.id,
    )

    access_token = generate_token(new_user)
    refresh_token = generate_token(new_user, is_refresh_token=True)

    content = {
        "message": constants.USER_SUCCESSFULLY_LOGIN,
        "data": {
            "username": db_user.username,
            "id": db_user.id,
        },
    }

    response_data = JSONResponse(status_code=status.HTTP_200_OK, content=content)

    response_data.set_cookie(
        key=constants.ACCESS_TOKEN_KEY,
        value=access_token,
        httponly=True,
        samesite="Strict",
        max_age=60 * 60,
        secure=config.SECURE,
    )

    response_data.set_cookie(
        key=constants.REFRESH_TOKEN_KEY,
        value=refresh_token,
        httponly=True,
        samesite="Strict",
        max_age=7 * 24 * 60 * 60,
        secure=config.SECURE,
    )

    return response_data
