from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class NoteBase(BaseModel):
    id: Optional[int] = None
    created_at: Optional[datetime] = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = Field(default_factory=datetime.now)
    user_id: Optional[int] = None

    class Config:
        from_attributes = True


class NoteCreate(NoteBase):
    title: str
    content: str


class NoteUpdate(NoteBase):
    title: Optional[str] = None
    content: Optional[str] = None
    updated_at: Optional[datetime] = Field(default_factory=datetime.now)
