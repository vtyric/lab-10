from sqlalchemy import Column, Integer, String

from database import Base


class ToDoItem(Base):
    __tablename__ = "todoitems"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
