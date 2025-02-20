# backend/main.py


# Standard Library Imports
import logging

# Third-party Imports
from fastapi import FastAPI, Request  # Import FastAPI framework and request object
from fastapi.middleware.cors import CORSMiddleware  # Middleware for handling CORS issues

# Local Application/Library-Specific Imports
from .database import init_db
from .router import router as document_router


# Configure logging for the application
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


# Initialize FastAPI app
app = FastAPI(title="Smart App Document Classifier")


# Configure CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Run database initialization on app startup
@app.on_event("startup")
async def startup():
    logger.info("Initializing database...")
    await init_db()
    logger.info("Database initialized successfully.")


# Include API routes from the router
app.include_router(document_router)


# Middleware to log incoming requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response


if __name__ == "__main__":

    import uvicorn  # Import uvicorn for running the FastAPI application
    uvicorn.run(app, host="0.0.0.0", port=8000)
