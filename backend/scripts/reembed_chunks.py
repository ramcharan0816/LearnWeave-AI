
import os
import sys

from sqlalchemy import text

from app.database import SessionLocal
from app.embeddings import (
    EMBEDDING_DIMENSION,
    MODEL_NAME,
    generate_embeddings,
)
from app.models import DocumentChunk


BATCH_SIZE = 32
CONFIRM = os.getenv("CONFIRM_REEMBED", "").lower() == "yes"


def main() -> None:
    if not CONFIRM:
        raise SystemExit(
            "Set CONFIRM_REEMBED=yes only after backing up "
            "the database and confirming the target database."
        )

    session = SessionLocal()

    try:
        total = session.query(DocumentChunk).count()
        print(f"Chunks to migrate: {total}")

        if total == 0:
            print("No document chunks found.")
            return

        offset = 0
        processed = 0

        while offset < total:
            chunks = (
                session.query(DocumentChunk)
                .order_by(DocumentChunk.id)
                .offset(offset)
                .limit(BATCH_SIZE)
                .all()
            )

            if not chunks:
                break

            texts = [chunk.content for chunk in chunks]
            vectors = generate_embeddings(texts)

            if len(vectors) != len(chunks):
                raise RuntimeError(
                    "Embedding count does not match chunk count."
                )

            for chunk, vector in zip(chunks, vectors):
                if len(vector) != EMBEDDING_DIMENSION:
                    raise RuntimeError(
                        f"Invalid vector size for chunk {chunk.id}."
                    )

                chunk.embedding = vector.tolist()
                chunk.embedding_model = MODEL_NAME

            session.commit()
            processed += len(chunks)
            offset += len(chunks)

            print(f"Migrated {processed}/{total} chunks")

        print("Migration completed.")

    except Exception:
        session.rollback()
        print(
            "Migration stopped. The current uncommitted batch "
            "was rolled back; earlier committed batches may remain migrated.",
            file=sys.stderr,
        )
        raise

    finally:
        session.close()


if __name__ == "__main__":
    main()
