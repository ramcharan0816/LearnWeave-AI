
import os
from functools import lru_cache
from dotenv import load_dotenv

load_dotenv()
import numpy as np
from google import genai
from google.genai import types


MODEL_NAME = "gemini-embedding-001"
EMBEDDING_DIMENSION = 768
BATCH_SIZE = 32


@lru_cache(maxsize=1)
def get_embedding_client() -> genai.Client:
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is missing. Set it in the environment."
        )

    return genai.Client(api_key=api_key)


def _embed(
    texts: list[str],
    task_type: str,
) -> np.ndarray:
    if not texts:
        return np.empty(
            (0, EMBEDDING_DIMENSION),
            dtype=np.float32,
        )

    if any(not text or not text.strip() for text in texts):
        raise ValueError("Text inputs cannot be empty.")

    client = get_embedding_client()
    all_vectors = []

    for start in range(0, len(texts), BATCH_SIZE):
        batch = texts[start:start + BATCH_SIZE]

        response = client.models.embed_content(
            model=MODEL_NAME,
            contents=batch,
            config=types.EmbedContentConfig(
                task_type=task_type,
                output_dimensionality=EMBEDDING_DIMENSION,
            ),
        )

        if not response.embeddings:
            raise RuntimeError(
                "Gemini returned no embeddings."
            )

        for item in response.embeddings:
            if item.values is None:
                raise RuntimeError(
                    "Gemini returned an empty embedding."
                )

            vector = np.asarray(item.values, dtype=np.float32)

            if vector.shape != (EMBEDDING_DIMENSION,):
                raise RuntimeError(
                    f"Unexpected embedding shape: {vector.shape}; "
                    f"expected ({EMBEDDING_DIMENSION},)."
                )

            all_vectors.append(vector)

    if len(all_vectors) != len(texts):
        raise RuntimeError(
            f"Received {len(all_vectors)} embeddings "
            f"for {len(texts)} texts."
        )

    return np.stack(all_vectors).astype(np.float32)


def generate_embeddings(texts: list[str]) -> np.ndarray:
    """Embed document chunks for semantic retrieval."""
    return _embed(texts, "RETRIEVAL_DOCUMENT")


def generate_embedding(text: str) -> np.ndarray:
    """Embed a user query for semantic retrieval."""
    if not text or not text.strip():
        raise ValueError("Text cannot be empty.")

    return _embed([text], "RETRIEVAL_QUERY")[0]
