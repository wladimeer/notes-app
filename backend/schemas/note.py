from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class NoteBase(BaseModel):
    id: Optional[int] = None
    title: str
    content: str
    created_at: Optional[datetime] = datetime.now()
    updated_at: Optional[datetime] = datetime.now()
    user_id: int
