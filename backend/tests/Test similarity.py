import random
from math import sqrt

from app.similarity import rank_by_cosine


def reference_cosine(a, b):
    """Copy of the original loop-based cosine_similarity."""
    if not a or not b:
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    ma = sqrt(sum(x * x for x in a))
    mb = sqrt(sum(y * y for y in b))
    if ma == 0 or mb == 0:
        return 0.0
    return dot / (ma * mb)


def make_vectors(count, dims, seed=7):
    rng = random.Random(seed)
    return [[rng.uniform(-1, 1) for _ in range(dims)] for _ in range(count)]


def test_matches_reference_top_k_and_scores():
    vectors = make_vectors(300, 768)
    query = make_vectors(1, 768, seed=99)[0]
    candidates = list(enumerate(vectors, start=1))

    expected = sorted(
        ((cid, reference_cosine(query, vec)) for cid, vec in candidates),
        key=lambda item: item[1],
        reverse=True,
    )[:5]

    ranked, stats = rank_by_cosine(query, candidates, top_k=5)

    assert [cid for cid, _ in ranked] == [cid for cid, _ in expected]
    for (_, got), (_, want) in zip(ranked, expected):
        assert abs(got - want) < 1e-9
    assert stats["scanned"] == 300 and stats["used"] == 300


def test_skips_bad_and_mismatched_embeddings_and_counts_them():
    query = [1.0, 0.0, 0.0]
    candidates = [
        (1, [1.0, 0.0, 0.0]),
        (2, None),
        (3, []),
        (4, [1.0, 0.0]),          # wrong dimension
        (5, [0.0, 1.0, 0.0]),
    ]
    ranked, stats = rank_by_cosine(query, candidates, top_k=10)

    assert [cid for cid, _ in ranked] == [1, 5]
    assert stats == {
        "scanned": 5,
        "used": 2,
        "skipped_empty": 2,
        "skipped_dimension": 1,
    }


def test_zero_vectors_score_zero_like_original():
    ranked, _ = rank_by_cosine([0.0, 0.0], [(1, [1.0, 1.0])], top_k=1)
    assert ranked == [(1, 0.0)]

    ranked, _ = rank_by_cosine([1.0, 1.0], [(1, [0.0, 0.0])], top_k=1)
    assert ranked == [(1, 0.0)]


def test_empty_candidates_and_top_k_larger_than_pool():
    assert rank_by_cosine([1.0], [], top_k=3)[0] == []
    ranked, _ = rank_by_cosine([1.0], [(1, [1.0]), (2, [0.5])], top_k=10)
    assert len(ranked) == 2