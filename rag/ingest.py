from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parent
SOURCE_FILE = ROOT / "data" / "weather_knowledge.md"
OUTPUT_FILE = ROOT / "data" / "chunks.json"


def chunk_text(text: str, chunk_size: int = 260, overlap: int = 40):
    sections = [s.strip() for s in re.split(r"\n(?=## )", text) if s.strip()]
    chunks = []

    for section in sections:
        paragraphs = [p.strip() for p in re.split(r"\n\s*\n", section) if p.strip()]
        current = ""

        for paragraph in paragraphs:
            candidate = paragraph if not current else f"{current}\n\n{paragraph}"
            if len(candidate) <= chunk_size:
                current = candidate
            else:
                if current:
                    chunks.append(current)
                current = paragraph

        if current:
            chunks.append(current)

    final_chunks = []
    for index, chunk in enumerate(chunks):
        if index == 0:
            final_chunks.append(chunk)
            continue

        previous = final_chunks[-1]
        if len(previous) + len(chunk) + overlap <= chunk_size * 2:
            final_chunks[-1] = f"{previous}\n\n{chunk}"
        else:
            final_chunks.append(chunk)

    return final_chunks


def main():
    text = SOURCE_FILE.read_text(encoding="utf-8")
    chunks = chunk_text(text)
    OUTPUT_FILE.write_text(json.dumps(chunks, indent=2), encoding="utf-8")
    print(f"Created {len(chunks)} chunks in {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
