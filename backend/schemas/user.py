from datetime import datetime
from pydantic import BaseModel


class UserBase(BaseModel):
    id: int
    username: str
    hashed_password: str
    created_at: datetime
    updated_at: datetime
