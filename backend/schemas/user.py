from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class UserBase(BaseModel):
    id: Optional[int] = None
    username: str
    password: str
    created_at: Optional[datetime] = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = Field(default_factory=datetime.now)

    class Config:
        from_attributes = True
