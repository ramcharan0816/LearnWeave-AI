from sqlalchemy import text
from app.database import engine

with engine.begin() as connection:
    connection.execute(
        text("""
            ALTER TABLE students
            ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
        """)
    )

print("Authentication column is ready.")