from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class UserBase(BaseModel):
    id: Optional[int] = None
    username: str
    password: str
    created_at: Optional[datetime] = datetime.now()
    updated_at: Optional[datetime] = datetime.now()
