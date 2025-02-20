# backend/exceptions.py


# Third-party Imports
from fastapi import HTTPException


# Custom exception for invalid file types
class InvalidFileType(HTTPException):
    def __init__(self):
        super().__init__(status_code=400, detail="Only .txt, .pdf, and .docx files are allowed")


# Custom exception for low-confidence predictions
class LowConfidencePrediction(HTTPException):
    def __init__(self, category, confidence):
        detail = f"Prediction for category '{category}' is too low: {confidence:.2f}. Returning 'Other'."
        super().__init__(status_code=200, detail=detail)


# Custom exception for database errors
class DatabaseError(HTTPException):
    def __init__(self):
        super().__init__(status_code=500, detail="Database operation failed")


# Custom exception for model inference errors
class ModelInferenceError(HTTPException):
    def __init__(self, message: str):
        super().__init__(status_code=500, detail=f"Model inference error: {message}")
