from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, FetchedValue
from database import Base


class Note(Base):
    __tablename__ = "note"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=FetchedValue())
    updated_at = Column(DateTime, nullable=True, server_default=FetchedValue())
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False, index=True)
