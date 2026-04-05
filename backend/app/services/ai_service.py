import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY ausente nas variáveis de ambiente.")

# Configuração robusta: forçando a API v1 estável
client = genai.Client(
    api_key=api_key,
    http_options={'api_version': 'v1'}
)

async def analyze_invoice_with_gemini(content: bytes, mime_type: str):
    prompt = """
    Você é um assistente financeiro. Analise esta fatura e retorne APENAS um objeto JSON válido com a seguinte estrutura estrita:
    {
        "total_amount": 0.0,
        "chart_data": [
            {"label": "Categoria Exemplo", "value": 0.0}
        ]
    }
    """
    
    try:
        # A nova SDK exige o modelo SEM o prefixo 'models/'
        # Usaremos o modelo 1.5-flash que é o padrão estável da v1
        response = client.models.generate_content(
            model='gemini-1.5-flash', 
            contents=[
                prompt,
                types.Part.from_bytes(data=content, mime_type=mime_type)
            ]
        )
        
        # Limpeza de markdown para garantir JSON puro
        text_response = response.text
        if "```json" in text_response:
            text_response = text_response.split("```json")[1].split("```")[0]
        elif "```" in text_response:
            text_response = text_response.split("```")[1].split("```")[0]
            
        return json.loads(text_response.strip())
        
    except json.JSONDecodeError as exc:
        raise ValueError(f"IA não retornou JSON válido: {response.text}") from exc
    except Exception as e:
        # Este log vai nos dizer se o Google ainda está a reclamar da versão
        raise ValueError(f"Erro de comunicação: {str(e)}")