import json
from pathlib import Path

import chromadb
from sentence_transformers import SentenceTransformer

ROOT = Path(__file__).resolve().parent
CHUNKS_FILE = ROOT / "data" / "chunks.json"
CHROMA_DIR = ROOT / "chroma_db"
COLLECTION_NAME = "weather_knowledge"


def load_chunks():
    return json.loads(CHUNKS_FILE.read_text(encoding="utf-8"))


def main():
    chunks = load_chunks()
    if not chunks:
        raise ValueError("No chunks found to embed")

    model = SentenceTransformer("nomic-ai/nomic-embed-text-v1.5", device="cpu")
    embeddings = model.encode(chunks, normalize_embeddings=True)

    client = chromadb.PersistentClient(path=str(CHROMA_DIR))
    collection = client.get_or_create_collection(name=COLLECTION_NAME)

    collection.add(
        documents=chunks,
        embeddings=embeddings.tolist(),
        ids=[f"chunk-{index}" for index in range(len(chunks))],
    )

    print(f"Embedded {len(chunks)} chunks into Chroma at {CHROMA_DIR}")


if __name__ == "__main__":
    main()
