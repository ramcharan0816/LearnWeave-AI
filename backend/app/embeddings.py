
from functools import lru_cache

import numpy as np
from sentence_transformers import SentenceTransformer


MODEL_NAME = "all-MiniLM-L6-v2"


@lru_cache(maxsize=1)
def get_embedding_model() -> SentenceTransformer:
    """Load and cache the model on its first use."""
    return SentenceTransformer(MODEL_NAME)


def generate_embeddings(texts: list[str]) -> np.ndarray:
    """Generate embeddings for multiple text chunks."""
    if not texts:
        return np.empty((0, 384), dtype=np.float32)

    model = get_embedding_model()
    return model.encode(
        texts,
        convert_to_numpy=True,
        show_progress_bar=False,
    )


def generate_embedding(text: str) -> np.ndarray:
    """Generate an embedding for a single text."""
    if not text or not text.strip():
        raise ValueError("Text cannot be empty.")

    model = get_embedding_model()
    return model.encode(
        text,
        convert_to_numpy=True,
        show_progress_bar=False,
    )
