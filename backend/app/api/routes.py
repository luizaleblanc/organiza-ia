import uuid
import traceback
import json
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.context import CryptContext

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.services.ai_service import analyze_invoice_with_gemini

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/analyze-invoice")
async def analyze_invoice_route(file: UploadFile = File(...)):
    try:
        # Etapa 1: Validação e leitura segura do multipart
        if not file.content_type.startswith(('image/', 'application/pdf')):
            raise ValueError(f"Tipo de arquivo não suportado: {file.content_type}")
        
        content = await file.read()
        if not content:
            raise ValueError("O arquivo enviado está vazio ou corrompido.")

        # Etapa 2: Isolamento da chamada LLM
        try:
            raw_ai_result = await analyze_invoice_with_gemini(content, file.content_type)
        except Exception as ai_exc:
            print(f"\n[FALHA NA LLM] -> {traceback.format_exc()}")
            raise ValueError(f"Erro na integração com a IA: {str(ai_exc)}")

        # Etapa 3: Validação estrita do payload 
        if isinstance(raw_ai_result, str):
            try:
                parsed_result = json.loads(raw_ai_result)
            except json.JSONDecodeError:
                print(f"\n[ALUCINAÇÃO DA IA] -> Retorno não é JSON: {raw_ai_result}")
                raise ValueError("A IA retornou um formato inválido de resposta.")
        else:
            parsed_result = raw_ai_result

        return JSONResponse(status_code=200, content=parsed_result)

    except ValueError as ve:
        return JSONResponse(status_code=422, content={"detail": str(ve)})
        
    except Exception as e:
        err_trace = traceback.format_exc()
        print(f"\n[ERRO FATAL DESCONHECIDO] -> {err_trace}")
        return JSONResponse(status_code=400, content={"detail": "Erro interno severo no processamento. Verifique os logs do servidor."})

@router.post("/usuarios", response_model=UserResponse)
async def register_user(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    query = select(User).where((User.email == user_data.email) | (User.username == user_data.username))
    result = await db.execute(query)
    existing_user = result.scalars().first()

    if existing_user:
        if existing_user.email == user_data.email:
            raise HTTPException(status_code=400, detail="Este e-mail já está em uso.")
        if existing_user.username == user_data.username:
            raise HTTPException(status_code=400, detail="Este nome de usuário já está em uso.")

    hashed_password = pwd_context.hash(user_data.password)

    new_user = User(
        name=user_data.name,
        username=user_data.username,
        email=user_data.email,
        birth_date=user_data.birthDate,
        password_hash=hashed_password,
        terms_accepted=user_data.terms
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user

@router.post("/login")
async def login(login_data: UserLogin, db: AsyncSession = Depends(get_db)):
    query = select(User).where((User.email == login_data.username_or_email) | (User.username == login_data.username_or_email))
    result = await db.execute(query)
    user = result.scalars().first()

    if not user or not pwd_context.verify(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Usuário, e-mail ou senha incorretos.")

    fake_token = str(uuid.uuid4())

    return {
        "token": fake_token, 
        "user": {
            "id": user.id, 
            "username": user.username, 
            "email": user.email
        }
    }