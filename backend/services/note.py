from models.note import Note
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from schemas.note import NoteCreate, NoteUpdate
from datetime import datetime


async def get_notes_for_user(db: AsyncSession, user_id: int):
    db_notes = await db.execute(
        select(Note).where(Note.user_id == user_id).order_by(Note.created_at.desc())
    )
    db_notes = db_notes.scalars().all()

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
        for note in db_notes
    ]

    for note in notes_data:
        note.pop("user_id", None)

    return notes_data


async def create_note_for_user(db: AsyncSession, note: NoteCreate, user_id: int):
    db_note = Note(
        title=note.title,
        content=note.content,
        created_at=note.created_at,
        updated_at=note.updated_at,
        user_id=user_id,
    )

    db.add(db_note)
    await db.commit()
    await db.refresh(db_note)

    return db_note


async def find_note_by_id(db: AsyncSession, user_id: int, note_id: int):
    db_note = await db.execute(
        select(Note).where(Note.user_id == user_id, Note.id == note_id)
    )
    db_note = db_note.scalars().first()

    if db_note is None:
        return None

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

    return note_data


async def update_note_for_user(
    db: AsyncSession, user_id: int, note_id: int, note: NoteUpdate
):
    db_note = await db.execute(
        select(Note).filter(Note.id == note_id, Note.user_id == user_id)
    )
    db_note = db_note.scalar_one_or_none()

    if db_note is None:
        return None

    if note.title:
        db_note.title = note.title

    if note.content:
        db_note.content = note.content

    db_note.updated_at = datetime.now()

    db.add(db_note)
    await db.commit()
    await db.refresh(db_note)

    return db_note


async def delete_note_for_user(db: AsyncSession, user_id: int, note_id: int):
    db_note = await db.execute(
        select(Note).where(Note.user_id == user_id, Note.id == note_id)
    )
    db_note = db_note.scalars().first()

    if db_note is None:
        return None

    await db.delete(db_note)
    await db.commit()

    return db_note
