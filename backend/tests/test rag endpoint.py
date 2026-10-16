"""Offline tests for /api/v1/rag/ask: SQLite + fake embedding + fake Groq client."""
import logging
from types import SimpleNamespace

import groq
import httpx
import numpy as np
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

import app.routers.rag as rag
from app.database import Base
from app.models import DocumentChunk

LOGGER_NAME = "uvicorn.error.learnweave.rag"
SECRET_QUESTION = "what is photosynthesis in plants"


@pytest.fixture()
def client(monkeypatch):
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        session.add_all([
            DocumentChunk(filename="bio.pdf", page_number=1, chunk_index=1,
                          content="Photosynthesis makes sugar from light.",
                          embedding=[1.0, 0.0, 0.0, 0.0], embedding_model="m"),
            DocumentChunk(filename="bio.pdf", page_number=2, chunk_index=2,
                          content="Mitochondria produce ATP.",
                          embedding=[0.0, 1.0, 0.0, 0.0], embedding_model="m"),
            DocumentChunk(filename="hist.pdf", page_number=1, chunk_index=1,
                          content="Rome was founded long ago.",
                          embedding=[0.0, 0.0, 1.0, 0.0], embedding_model="m"),
        ])
        session.commit()

    monkeypatch.setenv("GROQ_API_KEY", "test-key-not-real")
    monkeypatch.setattr(rag, "engine", engine)
    # ndarray, like the real Gemini embedding helper returns
    monkeypatch.setattr(rag, "generate_embedding",
                        lambda text: np.array([0.9, 0.1, 0.0, 0.0], dtype=np.float32))

    state = SimpleNamespace(calls=0, error=None)

    def create(**kwargs):
        state.calls += 1
        if state.error:
            raise state.error
        return SimpleNamespace(
            choices=[SimpleNamespace(message=SimpleNamespace(content="Fake answer."),
                                     finish_reason="stop")],
            usage=SimpleNamespace(prompt_tokens=50, completion_tokens=7),
        )

    fake = SimpleNamespace(chat=SimpleNamespace(completions=SimpleNamespace(create=create)))
    monkeypatch.setattr(rag, "_get_groq_client", lambda api_key: fake)

    app = FastAPI()
    app.include_router(rag.router)
    test_client = TestClient(app)
    test_client.state = state
    test_client.engine = engine
    return test_client


def ask(client, **body):
    payload = {"question": SECRET_QUESTION, "top_k": 2}
    payload.update(body)
    return client.post("/api/v1/rag/ask", json=payload)


def test_happy_path_keeps_response_contract_and_ranks_correctly(client):
    response = ask(client)
    assert response.status_code == 200
    body = response.json()
    assert set(body) == {"question", "answer", "total_sources", "sources", "model"}
    assert body["answer"] == "Fake answer."
    assert body["total_sources"] == 2
    assert body["sources"][0]["filename"] == "bio.pdf"
    assert body["sources"][0]["page_number"] == 1
    assert set(body["sources"][0]) == {"filename", "page_number", "chunk_index", "similarity_score"}
    assert body["sources"][0]["similarity_score"] > body["sources"][1]["similarity_score"]
    assert client.state.calls == 1


def test_filename_filter(client):
    body = ask(client, filename="hist.pdf", top_k=3).json()
    assert {s["filename"] for s in body["sources"]} == {"hist.pdf"}


def test_no_documents_message(client):
    body = ask(client, filename="missing.pdf").json()
    assert body["sources"] == [] and "upload a PDF" in body["answer"]
    assert client.state.calls == 0


def test_all_embeddings_wrong_dimension_returns_503_not_misleading_answer(client, monkeypatch):
    monkeypatch.setattr(rag, "generate_embedding",
                        lambda text: np.ones(768, dtype=np.float32))
    response = ask(client)
    assert response.status_code == 503
    assert "re-processed" in response.json()["detail"]
    assert client.state.calls == 0


def test_groq_timeout_maps_to_504(client):
    client.state.error = groq.APITimeoutError(
        request=httpx.Request("POST", "https://api.groq.com/x"))
    response = ask(client)
    assert response.status_code == 504
    assert "too long" in response.json()["detail"]


def test_groq_rate_limit_maps_to_429(client):
    resp = httpx.Response(429, request=httpx.Request("POST", "https://api.groq.com/x"))
    client.state.error = groq.RateLimitError("rate", response=resp, body=None)
    assert ask(client).status_code == 429


def test_timing_log_has_every_stage_and_no_question_text(client, caplog):
    caplog.set_level(logging.INFO, logger=LOGGER_NAME)
    ask(client)
    lines = [r.getMessage() for r in caplog.records if r.name == LOGGER_NAME]
    assert len(lines) == 1
    line = lines[0]
    for stage in ("query_embedding", "db_fetch_embeddings", "similarity_ranking",
                  "db_fetch_top_chunks", "context_build", "llm_call"):
        assert stage in line
    assert "status=ok" in line and "total_ms=" in line
    assert SECRET_QUESTION not in line and "Photosynthesis" not in line
    assert "test-key-not-real" not in line


def test_cors_preflight_allows_vercel_origin_and_blocks_others():
    from app.main import app as main_app
    http = TestClient(main_app)
    headers = {"Access-Control-Request-Method": "POST",
               "Access-Control-Request-Headers": "content-type"}
    ok = http.options("/api/v1/rag/ask",
                      headers={**headers, "Origin": "https://learn-weave-ai.vercel.app"})
    assert ok.status_code == 200
    assert ok.headers["access-control-allow-origin"] == "https://learn-weave-ai.vercel.app"
    bad = http.options("/api/v1/rag/ask",
                       headers={**headers, "Origin": "https://evil.example.com"})
    assert "access-control-allow-origin" not in bad.headers