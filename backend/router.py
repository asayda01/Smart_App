# backend/router.py


# Standard Library Imports
import os  # Module for interacting with the operating system
import shutil  # Module for file operations like copying and moving files
import logging  # Logging module for application events
import tempfile  # Module for creating temporary files/directories

# Third-party Imports
from sqlalchemy.ext.asyncio import AsyncSession  # Async session for SQLAlchemy
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends  # FastAPI imports for API routing

# Local Application/Library-Specific Imports
from .models import Document
from .database import get_db
from .schemas import DocumentResponse
from .utils import extract_text_from_file
from .ml_model import classify_text
from .exceptions import InvalidFileType, ModelInferenceError, CorruptedFile


# Initialize FastAPI Router
router = APIRouter()


@router.post("/upload/", response_model=DocumentResponse, summary="Upload a document and classify it")
async def upload_file(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    """
    Endpoint to upload files and classify them.
    """
    try:
        # Validate file type
        file_extension = os.path.splitext(file.filename)[1].lower()  # Get the file extension
        if file_extension not in ['.txt', '.pdf', '.docx']:  # Check for supported formats
            raise InvalidFileType()  # Raise an error for invalid file types

        with tempfile.TemporaryDirectory() as temp_dir:  # Create a temporary directory for the uploaded file
            file_path = os.path.join(temp_dir, file.filename)  # Set file path in the temp directory
            with open(file_path, "wb") as buffer:  # Open the file for writing
                shutil.copyfileobj(file.file, buffer)  # Copy the uploaded file into the temp directory

            # Extract text from file based on file extension
            try:
                content = extract_text_from_file(file_path, file_extension)
            except Exception as e:
                # If there's an error while extracting text, raise a CorruptedFile error
                logging.error(f"Error extracting text from file: {e}")
                raise CorruptedFile("This file appears to be corrupted. Please upload a valid file.")

            # Check if the extracted content is empty
            if not content:
                raise HTTPException(status_code=400, detail="File is empty")  # Raise error for empty content

            # Classify the text
            try:
                # Classify the extracted text
                predicted_category, confidence_scores = classify_text(content)
            except Exception as e:
                logging.error(f"Error during classification: {e}")  # Log any errors during classification
                raise ModelInferenceError(str(e))  # Raise a model inference error

            # Save to database with creating a new document object
            db_document = Document(
                filename=file.filename,
                content=content,
                predicted_category=predicted_category,
                confidence_scores=confidence_scores,
            )

            db.add(db_document)  # Add the document to the database
            await db.commit()  # Commit the transaction
            await db.refresh(db_document)  # Refresh the document object to get the latest data from the database

            # Return the document response
            return {
                "id": db_document.id,
                "filename": file.filename,
                "predicted_category": predicted_category,
                "confidence_scores": confidence_scores,
                "upload_time": db_document.upload_time,
            }

    except HTTPException as e:
        raise e
    except Exception as e:
        logging.error(f"Error occurred during file upload: {str(e)}")  # Log any unexpected errors
        raise HTTPException(status_code=500, detail="Internal Server Error")  # Raise a generic error


@router.get("/documents/", response_model=list[DocumentResponse], summary="Retrieve classified documents")
async def get_documents(db: AsyncSession = Depends(get_db)):
    """
    Endpoint to retrieve a list of classified documents.
    """
    try:
        # Execute a query to select all documents
        result = await db.execute(Document.__table__.select())

        # Fetch all documents from the result
        documents = result.fetchall()

        # Return the documents as a list of response models
        return [DocumentResponse(**dict(doc._mapping)) for doc in documents]

    except Exception as e:
        logging.error(f"Error fetching documents: {str(e)}")  # Log any errors during fetching
        raise HTTPException(status_code=500, detail="Internal Server Error")  # Raise a generic error


@router.delete("/documents/{doc_id}/", summary="Delete a document by ID")
async def delete_document(doc_id: int, db: AsyncSession = Depends(get_db)):
    """
    Endpoint to delete a document based on its ID.
    """
    try:
        # Find the document by ID
        result = await db.execute(Document.__table__.select().where(Document.id == doc_id))

        # Get the document object
        document = result.scalar_one_or_none()

        # If the document does not exist
        if document is None:
            # Raise not found error
            raise HTTPException(status_code=404, detail="Document not found")

        # Delete the document from the database
        await db.execute(Document.__table__.delete().where(Document.id == doc_id))

        # Commit the transaction
        await db.commit()

        # Return success message
        return {"message": "Document deleted successfully"}

    except Exception as e:
        logging.error(f"Error deleting document: {str(e)}")  # Log any errors during deletion
        raise HTTPException(status_code=500, detail="Internal Server Error")  # Raise a generic error
