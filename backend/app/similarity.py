"""Vectorised cosine-similarity ranking for stored chunk embeddings.

Replaces the per-chunk pure-Python loop in the RAG route. Scores match
``app.routers.retrieval.cosine_similarity`` (zero-magnitude vectors score 0.0).
"""
from __future__ import annotations

from typing import Any, Iterable

import numpy as np


def rank_by_cosine(
    query_embedding: list[float],
    candidates: Iterable[tuple[Any, Any]],
    top_k: int,
) -> tuple[list[tuple[Any, float]], dict[str, int]]:
    """Rank ``(chunk_id, embedding)`` pairs by cosine similarity to the query.

    Returns ``(ranked, stats)``. ``ranked`` is ``[(chunk_id, score), ...]``,
    best first, at most ``top_k`` long. Ties keep the original (database) order.

    Candidates whose embedding is not a non-empty list, or whose length differs
    from the query's, are skipped and counted in ``stats`` so a dimension
    mismatch is visible in logs instead of failing the whole request.
    """
    query = np.asarray(query_embedding, dtype=np.float64)
    dimension = int(query.shape[0]) if query.ndim == 1 else 0

    ids: list[Any] = []
    vectors: list[list[float]] = []
    scanned = skipped_empty = skipped_dimension = 0

    for chunk_id, embedding in candidates:
        scanned += 1
        if not isinstance(embedding, list) or not embedding:
            skipped_empty += 1
            continue
        if len(embedding) != dimension:
            skipped_dimension += 1
            continue
        ids.append(chunk_id)
        vectors.append(embedding)

    stats = {
        "scanned": scanned,
        "used": len(ids),
        "skipped_empty": skipped_empty,
        "skipped_dimension": skipped_dimension,
    }

    if not ids or dimension == 0 or top_k < 1:
        return [], stats

    matrix = np.asarray(vectors, dtype=np.float64)
    denominator = np.linalg.norm(matrix, axis=1) * np.linalg.norm(query)
    dots = matrix @ query
    scores = np.divide(
        dots, denominator, out=np.zeros_like(dots), where=denominator != 0
    )

    order = np.argsort(-scores, kind="stable")[:top_k]
    return [(ids[i], float(scores[i])) for i in order], stats