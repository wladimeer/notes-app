from fastapi import FastAPI
from fastapi.responses import JSONResponse
from routes.auth import router as auth_router
from database import init_db

app = FastAPI()

init_db()

app.include_router(auth_router)


@app.get("/")
async def root():
    return JSONResponse(
        status_code=200,
        content={
            "message": "¡Bienvenido a la API de Notas! Usa este servicio para crear, leer, actualizar y eliminar tus notas personales"
        },
    )
