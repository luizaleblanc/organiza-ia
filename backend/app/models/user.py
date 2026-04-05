from sqlalchemy import Column, Integer, String, Date, Boolean
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    birth_date = Column(Date, nullable=False)
    password_hash = Column(String(255), nullable=False)
    terms_accepted = Column(Boolean, default=False)