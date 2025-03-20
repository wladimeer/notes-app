from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.sessions import SessionMiddleware
from routes.note import router as note_router
from routes.auth import router as auth_router
from database import init_db
from config import config
from resources.security import verify_token, generate_token, get_token_data
from fastapi.middleware.cors import CORSMiddleware
from schemas.user import UserBase
import utils.constants as constants

app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key=config.JWT_KEY)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[config.ORIGIN_URL],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.middleware("http")
async def before_request(request: Request, call_next):
    skip_verification = [
        f"{constants.AUTH_PREFIX}{constants.USER_LOGIN_ENDPOINT}",
        f"{constants.AUTH_PREFIX}{constants.USER_REGISTER_ENDPOINT}",
        constants.ROOT_PATH,
    ]

    if request.method == "OPTIONS":
        return await call_next(request)

    if request.url.path not in skip_verification:
        access_token = request.cookies.get(constants.ACCESS_TOKEN_KEY)
        refresh_token = request.cookies.get(constants.REFRESH_TOKEN_KEY)

        if access_token:
            is_valid_access_token = verify_token(access_token)

            if not is_valid_access_token and refresh_token:
                is_valid_refresh_token = verify_token(refresh_token)

                if is_valid_refresh_token:
                    payload = get_token_data(refresh_token)

                    new_user = UserBase(
                        id=payload["user_id"],
                        username=payload["sub"],
                        password="",
                    )

                    new_access_token = generate_token(new_user)
                    response = await call_next(request)

                    response.set_cookie(
                        key=constants.ACCESS_TOKEN_KEY,
                        value=new_access_token,
                        httponly=True,
                        samesite="Strict",
                        max_age=60 * 60,
                        secure=config.SECURE,
                    )

                    return response

            if not is_valid_access_token:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"message": constants.NOT_AUTHORIZED_MESSAGE},
                )

        else:
            if refresh_token:
                is_valid_refresh_token = verify_token(refresh_token)

                if is_valid_refresh_token:
                    payload = get_token_data(refresh_token)

                    new_user = UserBase(
                        id=payload["user_id"],
                        username=payload["sub"],
                        password="",
                    )

                    new_access_token = generate_token(new_user)
                    response = await call_next(request)

                    response.set_cookie(
                        key=constants.ACCESS_TOKEN_KEY,
                        value=new_access_token,
                        httponly=True,
                        samesite="Strict",
                        max_age=60 * 60,
                        secure=config.SECURE,
                    )

                    return response

            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"message": constants.NOT_AUTHORIZED_MESSAGE},
            )

    return await call_next(request)


app.include_router(note_router)
app.include_router(auth_router)


@app.on_event("startup")
async def startup_event():
    await init_db()


@app.get(constants.ROOT_PATH)
async def root():
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "message": "¡Bienvenido a la API de Notas! Usa este servicio para crear, leer, actualizar y eliminar tus notas personales"
        },
    )
