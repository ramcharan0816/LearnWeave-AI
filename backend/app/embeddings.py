from sentence_transformers import SentenceTransformer
EMBEDDING_DIMENSIONS = 384
# Load the embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(text: str) -> list[float]:
    """
    Convert text into a numerical embedding vector.
    """
    if not text or not text.strip():
        raise ValueError("Text cannot be empty.")

    embedding = model.encode(
        text,
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    return embedding.tolist()


def generate_embeddings(texts: list[str]) -> list[list[float]]:
    """
    Generate embeddings for multiple text chunks.
    """
    if not texts:
        return []

    if any(not text or not text.strip() for text in texts):
        raise ValueError("All texts must be non-empty.")

    embeddings = model.encode(
        texts,
        convert_to_numpy=True,
        normalize_embeddings=True,
        show_progress_bar=False
    )

    return embeddings.tolist()