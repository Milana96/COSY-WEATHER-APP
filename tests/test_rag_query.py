import importlib.util
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
QUERY_MODULE = ROOT / "rag" / "query.py"

spec = importlib.util.spec_from_file_location("rag_query", QUERY_MODULE)
query = importlib.util.module_from_spec(spec)
spec.loader.exec_module(query)


def test_rank_documents_prefers_keyword_matches():
    documents = [
        "Rainy weather recommends a waterproof jacket and shoes with grip.",
        "Hot weather recommends sunscreen, a hat, and light clothing.",
    ]

    ranked = query.rank_documents("What should I wear in rainy weather?", documents)

    assert ranked[0].startswith("Rainy weather")
