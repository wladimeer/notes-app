from schemas.note import NoteCreate, NoteUpdate
from fastapi import APIRouter, Depends, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import get_db
from models.note import Note
from resources.security import get_token_data
from datetime import datetime
from services.note import get_notes_for_user, create_note_for_user, find_note_by_id
from services.note import update_note_for_user, delete_note_for_user
from sqlalchemy.exc import OperationalError
import utils.constants as constants

router = APIRouter(prefix=constants.NOTE_PREFIX, tags=[constants.NOTE_TAG])


@router.get(constants.NO_PATH)
async def get_notes(request: Request, db: Session = Depends(get_db)):
    try:
        access_token = request.cookies.get(constants.ACCESS_TOKEN_KEY)
        payload = get_token_data(access_token)

        notes_data = get_notes_for_user(db, payload["user_id"])

        content = {
            "message": constants.DATA_OBTAINED,
            "data": notes_data,
        }

        return JSONResponse(status_code=status.HTTP_200_OK, content=content)

    except:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": constants.EXCEPTION_MESSAGE},
        )


@router.post(constants.ROOT_PATH)
async def create_note(
    request: Request, note: NoteCreate, db: Session = Depends(get_db)
):
    try:
        access_token = request.cookies.get(constants.ACCESS_TOKEN_KEY)
        payload = get_token_data(access_token)

        create_note_for_user(db, note, payload["user_id"])

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": constants.NOTE_REGISTERED},
        )

    except:
        db.rollback()

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": constants.EXCEPTION_MESSAGE},
        )


@router.get(constants.NOTE_PATH)
async def find_note(request: Request, id: int, db: Session = Depends(get_db)):
    try:
        access_token = request.cookies.get(constants.ACCESS_TOKEN_KEY)
        payload = get_token_data(access_token)

        note_data = find_note_by_id(db, payload["user_id"], id)

        if note_data is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": constants.NOTE_DOES_NOT_EXIST},
            )

        content = {
            "message": constants.DATA_OBTAINED,
            "data": note_data,
        }

        return JSONResponse(status_code=status.HTTP_200_OK, content=content)

    except:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": constants.EXCEPTION_MESSAGE},
        )


@router.put(constants.NOTE_PATH)
async def update_note(
    request: Request, id: int, note: NoteUpdate, db: Session = Depends(get_db)
):
    try:
        access_token = request.cookies.get(constants.ACCESS_TOKEN_KEY)
        payload = get_token_data(access_token)

        db_note = update_note_for_user(db, payload["user_id"], id, note)

        if db_note is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": constants.NOTE_DOES_NOT_EXIST},
            )

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": constants.NOTE_UPDATED},
        )

    except OperationalError:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"message": constants.NOTE_UPDATE_CONCURRENCY_ERROR},
        )

    except:
        db.rollback()

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": constants.EXCEPTION_MESSAGE},
        )


@router.delete(constants.NOTE_PATH)
async def delete_note(request: Request, id: int, db: Session = Depends(get_db)):
    try:
        access_token = request.cookies.get(constants.ACCESS_TOKEN_KEY)
        payload = get_token_data(access_token)

        db_note = delete_note_for_user(db, payload["user_id"], id)

        if db_note is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": constants.NOTE_DOES_NOT_EXIST},
            )

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": constants.NOTE_DELETED},
        )

    except OperationalError:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"message": constants.NOTE_DELETE_CONCURRENCY_ERROR},
        )

    except:
        db.rollback()

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": constants.EXCEPTION_MESSAGE},
        )
