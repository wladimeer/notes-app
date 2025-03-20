from schemas.note import NoteCreate, NoteUpdate
from fastapi import APIRouter, Depends, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from resources.security import get_token_data
from services.note import (
    get_notes_for_user,
    create_note_for_user,
    find_note_by_id,
    update_note_for_user,
    delete_note_for_user,
)
from sqlalchemy.exc import IntegrityError
from utils.helpers import compare_dates
import utils.constants as constants

router = APIRouter(prefix=constants.NOTE_PREFIX, tags=[constants.NOTE_TAG])


@router.get(constants.NO_PATH)
async def get_notes(request: Request, db: AsyncSession = Depends(get_db)):
    try:
        access_token = request.cookies.get(constants.ACCESS_TOKEN_KEY)
        payload = get_token_data(access_token)

        notes_data = await get_notes_for_user(db, payload["user_id"])

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": constants.DATA_OBTAINED, "data": notes_data},
        )

    except Exception:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": constants.EXCEPTION_MESSAGE},
        )


@router.post(constants.ROOT_PATH)
async def create_note(
    request: Request, note: NoteCreate, db: AsyncSession = Depends(get_db)
):
    try:
        access_token = request.cookies.get(constants.ACCESS_TOKEN_KEY)
        payload = get_token_data(access_token)

        await create_note_for_user(db, note, payload["user_id"])

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": constants.NOTE_REGISTERED},
        )

    except Exception:
        await db.rollback()

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": constants.EXCEPTION_MESSAGE},
        )


@router.get(constants.NOTE_PATH)
async def find_note(request: Request, id: int, db: AsyncSession = Depends(get_db)):
    try:
        access_token = request.cookies.get(constants.ACCESS_TOKEN_KEY)
        payload = get_token_data(access_token)

        note_data = await find_note_by_id(db, payload["user_id"], id)

        if note_data is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": constants.NOTE_DOES_NOT_EXIST},
            )

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": constants.DATA_OBTAINED, "data": note_data},
        )

    except Exception:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": constants.EXCEPTION_MESSAGE},
        )


@router.put(constants.NOTE_PATH)
async def update_note(
    request: Request, id: int, note: NoteUpdate, db: AsyncSession = Depends(get_db)
):
    try:
        access_token = request.cookies.get(constants.ACCESS_TOKEN_KEY)
        payload = get_token_data(access_token)

        existing_note = await find_note_by_id(db, payload["user_id"], id)

        if existing_note is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": constants.NOTE_DOES_NOT_EXIST},
            )

        is_same = compare_dates(str(note.updated_at), existing_note["updated_at"])

        if not is_same:
            return JSONResponse(
                status_code=status.HTTP_409_CONFLICT,
                content={"message": constants.NOTE_UPDATE_CONCURRENCY_ERROR},
            )

        updated_note = await update_note_for_user(db, payload["user_id"], id, note)

        if updated_note is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": constants.NOTE_DOES_NOT_EXIST},
            )

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": constants.NOTE_UPDATED},
        )

    except IntegrityError:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"message": constants.NOTE_UPDATE_CONCURRENCY_ERROR},
        )

    except Exception:
        await db.rollback()

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": constants.EXCEPTION_MESSAGE},
        )


@router.delete(constants.NOTE_PATH)
async def delete_note(request: Request, id: int, db: AsyncSession = Depends(get_db)):
    try:
        access_token = request.cookies.get(constants.ACCESS_TOKEN_KEY)
        payload = get_token_data(access_token)

        db_note = await delete_note_for_user(db, payload["user_id"], id)

        if db_note is None:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": constants.NOTE_DOES_NOT_EXIST},
            )

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": constants.NOTE_DELETED},
        )

    except IntegrityError:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"message": constants.NOTE_DELETE_CONCURRENCY_ERROR},
        )

    except Exception:
        await db.rollback()

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": constants.EXCEPTION_MESSAGE},
        )
