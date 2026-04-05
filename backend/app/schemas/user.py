from pydantic import BaseModel, EmailStr, Field, model_validator, field_validator
from datetime import date

class UserCreate(BaseModel):
    name: str = Field(..., min_length=3)
    username: str = Field(..., min_length=3)
    email: EmailStr
    birthDate: date
    password: str = Field(..., min_length=6)
    confirmPassword: str
    terms: bool

    @field_validator('birthDate')
    def validate_birth_date(cls, v):
        if v.year < 1920:
            raise ValueError('Data de nascimento deve ser posterior a 1920.')
        if v >= date.today():
            raise ValueError('Data de nascimento inválida.')
        return v

    @model_validator(mode='after')
    def check_passwords_match(self):
        if self.password != self.confirmPassword:
            raise ValueError('As senhas não coincidem.')
        if not self.terms:
            raise ValueError('Você deve aceitar os termos de uso.')
        return self

class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username_or_email: str
    password: str

class LoginResponse(BaseModel):
    token: str
    user: UserResponse