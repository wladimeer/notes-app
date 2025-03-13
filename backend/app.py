from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def index():
    return {
        "message": "Welcome to the Notes API! Use this service to create, read, update, and delete your personal notes."
    }
