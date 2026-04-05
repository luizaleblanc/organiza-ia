import traceback
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router

app = FastAPI(title="Organiza AI API")

@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as exc:
        err_msg = traceback.format_exc()
        print(f"\n--- CRITICAL ERROR TRACE ---\n{err_msg}\n----------------------------\n")
        return JSONResponse(
            status_code=422, 
            content={
                "detail": "Falha crítica capturada pelo Middleware SRE.", 
                "error": str(exc)
            }
        )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")