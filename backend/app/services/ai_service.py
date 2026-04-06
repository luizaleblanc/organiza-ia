import os
import json
import logging
import base64
import io
import re
import pdfplumber
from dotenv import load_dotenv
from groq import AsyncGroq

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY ausente nas variáveis de ambiente.")

client = AsyncGroq(api_key=api_key)


def extrair_texto_pdf(content: bytes) -> str:
    texto_paginas = []
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            texto = page.extract_text(x_tolerance=2, y_tolerance=2)
            if texto:
                texto_paginas.append(texto)
    texto_completo = "\n".join(texto_paginas)
    texto_limpo = re.sub(r'[ \t]+', ' ', texto_completo)
    texto_limpo = re.sub(r'\n{3,}', '\n\n', texto_limpo)
    logger.info("=== TEXTO EXTRAÍDO DO PDF (primeiros 2000 chars) ===")
    logger.info(texto_limpo[:2000])
    logger.info("=== FIM DO TEXTO ===")
    return texto_limpo[:8000]


async def analyze_invoice_with_gemini(content: bytes, mime_type: str) -> dict:
    prompt = """Você é um extrator de dados financeiros. Retorne SOMENTE um objeto JSON, sem nenhum texto fora dele.

PASSO 1 - FILTRE apenas lançamentos de SAÍDA. Ignore entradas, saldos, estornos, "PIX recebido", "TED recebida", rendimentos e resgates.

PASSO 2 - Converta valores para float positivo. Exemplos: "R$ 14,92" vira 14.92 | "R$ 1.234,56" vira 1234.56

PASSO 3 - Classifique cada saída em exatamente um destes rótulos:

"Pagamento de fatura": pagamento de fatura de cartão ou boleto bancário. Palavras-chave: "Pagamento Fatura", "PAG FATURA", "pagamento cartão".

"Transferências para pessoas": PIX ou TED enviado para nome de pessoa física (nome e sobrenome visíveis na descrição). PIX para CNPJ ou empresa NÃO entra aqui.

"Alimentação": restaurantes, lanchonetes, padarias, sorveterias, supermercados, iFood, Rappi. Palavras-chave: "RESTAURANTE", "LANCHONETE", "SUPERMERCADO", "SORVETERIA", "IFOOD", "SUCO".

"Transporte": Uber, 99, táxi, combustível, pedágio, passagens. Qualquer descrição contendo "UBER" pertence aqui.

"Serviços e pagamentos diversos": assinaturas digitais, EBANX, plataformas online, taxas. Palavras-chave: "NETFLIX", "SPOTIFY", "EBANX", "TAXA", "Mensalidade".

PASSO 4 - Some os valores de cada categoria para obter o campo "value". Some todos os "value" para obter "total_amount". Omita categorias sem transações.

FORMATO OBRIGATÓRIO:
{"total_amount": <number>, "chart_data": [{"label": "<rotulo exato>", "value": <number>, "transactions": [{"description": "<string>", "amount": <number>}]}]}"""

    clean_json_str = ""

    try:
        messages = [{"role": "system", "content": prompt}]
        model_name = "llama-3.3-70b-versatile"

        if "pdf" in mime_type.lower():
            texto_extraido = extrair_texto_pdf(content)
            messages.append({
                "role": "user",
                "content": f"Processe este extrato bancário e retorne o JSON:\n\n{texto_extraido}"
            })
        else:
            model_name = "llama-3.2-11b-vision-preview"
            base64_image = base64.b64encode(content).decode('utf-8')
            messages.append({
                "role": "user",
                "content": [
                    {"type": "text", "text": "Processe este extrato bancário e retorne o JSON:"},
                    {"type": "image_url", "image_url": {"url": f"data:{mime_type};base64,{base64_image}"}}
                ]
            })

        response = await client.chat.completions.create(
            model=model_name,
            messages=messages,
            temperature=0.0,
            max_tokens=4096,
            response_format={"type": "json_object"}
        )

        text_response = response.choices[0].message.content.strip()
        logger.info("=== RESPOSTA BRUTA DA LLM ===")
        logger.info(text_response[:2000])
        logger.info("=== FIM DA RESPOSTA ===")

        clean_json_str = text_response
        resultado = json.loads(clean_json_str)
        logger.info("=== JSON PARSEADO COM SUCESSO ===")
        logger.info(json.dumps(resultado, ensure_ascii=False, indent=2))
        return resultado

    except json.JSONDecodeError as exc:
        logger.error(f"Erro de Parse. Payload: {clean_json_str[:500]}", exc_info=True)
        raise ValueError("A IA retornou um JSON malformado.") from exc
    except Exception as e:
        logger.error("Falha no pipeline de IA.", exc_info=True)
        raise ValueError(f"Falha na integração: {str(e)}")