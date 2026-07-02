import os
import json
import requests

from dotenv import load_dotenv

# Carrega as variáveis do .env
load_dotenv()

API_KEY = os.getenv("API_KEY")
ENDPOINT = os.getenv("ENDPOINT")
AGENT_NAME = os.getenv("AGENT_NAME")

HEADERS = {
    "Content-Type": "application/json",
    "api-key": API_KEY
}

def criar_conversa():
    """Cria uma nova conversa no Microsoft Foundry."""

    url = f"{ENDPOINT}/openai/v1/conversations"

    resposta = requests.post(
        url,
        headers=HEADERS,
        json={},
        timeout=30
    )

    resposta.raise_for_status()

    return resposta.json()["id"]

def enviar_mensagem(conversation_id, pergunta):

    url = f"{ENDPOINT}/openai/v1/responses"

    payload = {
        "agent_reference": {
            "type": "agent_reference",
            "name": AGENT_NAME
        },
        "conversation": conversation_id,
        "input": [
            {
                "role": "user",
                "content": pergunta
            }
        ]
    }

    resposta = requests.post(
        url,
        headers=HEADERS,
        json=payload,
        timeout=60
    )

    resposta.raise_for_status()

    return resposta.json()

def extrair_resposta(data):

    if isinstance(data.get("output_text"), str):

        if data["output_text"].strip():

            return data["output_text"].strip()

    chunks = []

    for item in data.get("output", []):

        content = item.get("content")

        if isinstance(content, str):

            chunks.append(content)

            continue

        for c in (content or []):

            if isinstance(c.get("text"), str):

                chunks.append(c["text"])

            elif isinstance((c.get("text") or {}).get("value"), str):

                chunks.append(c["text"]["value"])

            elif isinstance(c.get("content"), str):

                chunks.append(c["content"])

    return "\n".join(chunks).strip() or json.dumps(
        data,
        ensure_ascii=False
    )

def conversar(conversation_id, pergunta):
    """
    Envia uma pergunta ao agente e retorna apenas o texto da resposta.
    """

    resposta = enviar_mensagem(conversation_id, pergunta)

    return extrair_resposta(resposta)