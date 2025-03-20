from schemas.user import UserBase
from fastapi import APIRouter, Depends, Response, status
from fastapi.responses import JSONResponse
import utils.constants as constants
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from services.user import register_user, get_user_by_username
from utils.helpers import check_value
from resources.security import generate_token
from config import config

router = APIRouter(prefix=constants.AUTH_PREFIX, tags=[constants.AUTH_TAG])


@router.post(constants.USER_REGISTER_ENDPOINT)
async def register(user: UserBase, db: AsyncSession = Depends(get_db)):
    try:
        db_user = await register_user(db, user)

        if db_user is None:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": constants.USER_ALREADY_REGISTERED},
            )

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": constants.USER_REGISTERED},
        )

    except Exception:
        await db.rollback()

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": constants.EXCEPTION_MESSAGE},
        )


@router.post(constants.USER_LOGIN_ENDPOINT)
async def login(user: UserBase, db: AsyncSession = Depends(get_db)):
    db_user = await get_user_by_username(db, user.username)

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


@router.post(constants.USER_LOGOUT_ENDPOINT)
async def logout(response: Response):
    response.delete_cookie(key=constants.ACCESS_TOKEN_KEY, path="/")
    response.delete_cookie(key=constants.REFRESH_TOKEN_KEY, path="/")

    content = {"message": constants.USER_LOGGED_OUT}

    return JSONResponse(status_code=status.HTTP_200_OK, content=content)
