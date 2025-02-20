# backend/database.py


# Standard Library Imports
import os

# Third-party Imports
from dotenv import load_dotenv  # Load environment variables from .env file
from sqlalchemy.orm import sessionmaker  # Create session factory for database transactions
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession  # Async database engine and session

# Local Application/Library-Specific Imports
from .models import Base


# Load database credentials from environment variables
load_dotenv()


# Fetch database credentials from environment variables
class DatabaseConfig:
    POSTGRES_USER = os.getenv("POSTGRES_USER")
    POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
    POSTGRES_DB = os.getenv("POSTGRES_DB")
    POSTGRES_HOST = os.getenv("POSTGRES_HOST")
    POSTGRES_PORT = os.getenv("POSTGRES_PORT")


# Define database URL for SQLAlchemy
SQLALCHEMY_DATABASE_URL = f"postgresql+asyncpg://{DatabaseConfig.POSTGRES_USER}:{DatabaseConfig.POSTGRES_PASSWORD}@{DatabaseConfig.POSTGRES_HOST}:{DatabaseConfig.POSTGRES_PORT}/{DatabaseConfig.POSTGRES_DB}"

# Create async database engine
engine = create_async_engine(SQLALCHEMY_DATABASE_URL, future=True, echo=True)

# Create async session factory
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)


# Dependency to get database session
async def get_db():
    async with AsyncSessionLocal() as db:
        yield db


# Initialize database and create tables
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
