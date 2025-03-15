from models.note import Note
from sqlalchemy.orm import Session
from schemas.note import NoteCreate, NoteUpdate
from datetime import datetime


def get_notes_for_user(db: Session, user_id: int):
    db_notes = db.query(Note).filter(Note.user_id == user_id).all()

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


def create_note_for_user(db: Session, note: NoteCreate, user_id: int):
    db_note = Note(
        title=note.title,
        content=note.content,
        created_at=note.created_at,
        updated_at=note.updated_at,
        user_id=user_id,
    )

    db.add(db_note)
    db.commit()
    db.refresh(db_note)

    return db_note


def find_note_by_id(db: Session, user_id: int, note_id: int):
    db_note = db.query(Note).filter(Note.user_id == user_id, Note.id == note_id).first()

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


def update_note_for_user(db: Session, user_id: int, note_id: int, note: NoteUpdate):
    db_note = db.query(Note).filter(Note.user_id == user_id, Note.id == note_id).first()

    if db_note is None:
        return None

    if note.title:
        db_note.title = note.title

    if note.content:
        db_note.content = note.content

    if note.title or note.content:
        db_note.updated_at = datetime.now()

    db.commit()
    db.refresh(db_note)

    return db_note


def delete_note_for_user(db: Session, user_id: int, note_id: int):
    db_note = db.query(Note).filter(Note.user_id == user_id, Note.id == note_id).first()

    if db_note is None:
        return None

    db.delete(db_note)
    db.commit()

    return db_note
