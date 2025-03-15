from schemas.note import NoteCreate, NoteUpdate
from fastapi import APIRouter, Depends, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import get_db
from models.note import Note
from resources.security import get_token_data
from datetime import datetime
import utils.constants as constants

router = APIRouter(prefix=constants.NOTE_PREFIX, tags=[constants.NOTE_TAG])


@router.get(constants.ROOT_PATH)
async def get_notes(request: Request, db: Session = Depends(get_db)):
    try:
        access_token = request.cookies.get(constants.ACCESS_TOKEN_KEY)
        payload = get_token_data(access_token)

        db_note = db.query(Note).filter(Note.user_id == payload["user_id"]).all()

        notes_data = [
            {
                **NoteCreate.from_orm(note).dict(),
                "created_at": (
                    note.created_at.strftime("%Y-%m-%d %H:%M:%S")
                    if note.created_at
                    else None
                ),
                "updated_at": (
                    note.updated_at.strftime("%Y-%m-%d %H:%M:%S")
                    if note.updated_at
                    else None
                ),
            }
            for note in db_note
        ]

        for note in notes_data:
            note.pop("user_id", None)

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

        db_note = Note(
            title=note.title,
            content=note.content,
            created_at=note.created_at,
            updated_at=note.updated_at,
            user_id=payload["user_id"],
        )

        db.add(db_note)
        db.commit()
        db.refresh(db_note)

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

        db_note = (
            db.query(Note)
            .filter(Note.user_id == payload["user_id"], Note.id == id)
            .first()
        )

        if db_note is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": constants.NOTE_DOES_NOT_EXIST},
            )

        note_data = {
            **NoteCreate.from_orm(db_note).dict(),
            "created_at": (
                db_note.created_at.strftime("%Y-%m-%d %H:%M:%S")
                if db_note.created_at
                else None
            ),
            "updated_at": (
                db_note.updated_at.strftime("%Y-%m-%d %H:%M:%S")
                if db_note.updated_at
                else None
            ),
        }

        note_data.pop("user_id", None)

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

        db_note = (
            db.query(Note)
            .filter(Note.user_id == payload["user_id"], Note.id == id)
            .first()
        )

        if db_note is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": constants.NOTE_DOES_NOT_EXIST},
            )

        if note.title:
            db_note.title = note.title

        if note.content:
            db_note.content = note.content

        if note.title or note.content:
            db_note.updated_at = datetime.now()

        db.commit()
        db.refresh(db_note)

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": constants.NOTE_UPDATED},
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

        db_note = (
            db.query(Note)
            .filter(Note.user_id == payload["user_id"], Note.id == id)
            .first()
        )

        if db_note is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": constants.NOTE_DOES_NOT_EXIST},
            )

        db.delete(db_note)
        db.commit()

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": constants.NOTE_DELETED},
        )

    except:
        db.rollback()

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": constants.EXCEPTION_MESSAGE},
        )
