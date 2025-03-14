from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.sessions import SessionMiddleware
from routes.auth import router as auth_router
from database import init_db
from config import config
from resources.security import verify_token
import utils.constants as constants

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=config.JWT_KEY)

init_db()


@app.middleware("http")
async def before_request(request: Request, call_next):
    skip_verification = [
        f"{constants.AUTH_PREFIX}{constants.USER_LOGIN_ENDPOINT}",
        f"{constants.AUTH_PREFIX}{constants.USER_REGISTER_ENDPOINT}",
        constants.ROOT_PATH,
    ]

    if request.url.path not in skip_verification:
        access_token = request.cookies.get(constants.ACCESS_TOKEN_KEY)

        if access_token:
            is_valid = verify_token(access_token)

            if not is_valid:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"message": constants.NOT_AUTHORIZED_MESSAGE},
                )

        else:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"message": constants.NOT_AUTHORIZED_MESSAGE},
            )

    return await call_next(request)


app.include_router(auth_router)


@app.get(constants.ROOT_PATH)
async def root():
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "message": "¡Bienvenido a la API de Notas! Usa este servicio para crear, leer, actualizar y eliminar tus notas personales"
        },
    )
