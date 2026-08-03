import json
import os
import re
import sys
from pathlib import Path

import chromadb
import requests

ROOT = Path(__file__).resolve().parent
CHROMA_DIR = ROOT / "chroma_db"
COLLECTION_NAME = "weather_knowledge"


def tokenize(text: str):
    return re.findall(r"[a-z0-9]+", text.lower())


def rank_documents(question: str, documents: list[str]):
    question_tokens = set(tokenize(question))
    scored = []
    for document in documents:
        doc_tokens = set(tokenize(document))
        overlap = len(question_tokens & doc_tokens)
        score = overlap
        if question_tokens and overlap == 0:
            score = -1
        scored.append((score, document))
    scored.sort(key=lambda item: item[0], reverse=True)
    return [document for _, document in scored]


def get_relevant_context(question: str, top_k: int = 3):
    client = chromadb.PersistentClient(path=str(CHROMA_DIR))
    collection = client.get_collection(name=COLLECTION_NAME)

    results = collection.get(include=["documents"])
    documents = results.get("documents", [])
    if not documents:
        return []

    ranked_documents = rank_documents(question, documents)
    return ranked_documents[:top_k]


def ask_ollama(question: str, context: list[str]):
    context_text = "\n\n".join(context)
    prompt = f"""
You are a helpful weather assistant.
Use the context below to answer the user's question.
If the answer is not in the context, say that you do not know.

Context:
{context_text}

User question:
{question}
""".strip()

    payload = {
        "model": os.getenv("OLLAMA_MODEL", "llama3.2:3b"),
        "prompt": prompt,
        "stream": False,
    }

    try:
        response = requests.post("http://localhost:11434/api/generate", json=payload, timeout=600)
        response.raise_for_status()
        return response.json().get("response", "")
    except requests.RequestException as exc:
        return f"Ollama request failed: {exc}"


def main():
    question = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "What should I bring for a rainy day?"
    context = get_relevant_context(question)
    answer = ask_ollama(question, context)
    payload = {
        "answer": answer,
        "context": context,
    }
    print(json.dumps(payload))


if __name__ == "__main__":
    main()
