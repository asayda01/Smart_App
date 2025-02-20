# backend/ml_model.py


# Standard Library Imports
import logging
from typing import Dict, Tuple

# Third-party Imports
from transformers import pipeline
from sentence_transformers import SentenceTransformer

# Local Application/Library-Specific Imports
from .utils import chunk_text_by_sentences, chunk_text_by_tokens, preprocess_text, summarize_large_text
from .exceptions import ModelInferenceError


# Initialize logging
logging.basicConfig(level=logging.INFO)

# Create a logger for this module
logger = logging.getLogger(__name__)


# Load NLP Models
# Initialize zero-shot classification model
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Load embedding model
embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")


# Predefined categories for document classification
categories = [
    "Technical Documentation",
    "Business Proposal",
    "Legal Document",
    "Academic Paper",
    "General Article",
    "Other",
]

# Encode categories for use in classification
category_embeddings = embedding_model.encode(categories, convert_to_tensor=True)

# Initialize Constants for model handling
MAX_TOKENS = 512  # Token limit per chunk for classification
SUMMARY_THRESHOLD = 1500  # Summarize if text exceeds this word count
CONFIDENCE_THRESHOLD = 0.25  # Minimum confidence for valid classification


def classify_text(text: str) -> Tuple[str, Dict[str, float]]:
    """
    Classify text using zero-shot classification and sentence embeddings.
    If the confidence level of the top predicted category is below the threshold,
    classify the document as "Other" with a confidence score of 1.0.
    """
    try:
        # Clean and preprocess input text
        text = preprocess_text(text)

        # Ensure text isn't too long
        word_limit = 5000  # Set word limit
        if len(text.split()) > word_limit:  # If text exceeds word limit
            text = " ".join(text.split()[:word_limit])  # Trim text to limit

        # Summarize large text if needed
        if len(text.split()) > SUMMARY_THRESHOLD:
            text = summarize_large_text(text)

        # Chunk text to avoid model failure
        chunks = chunk_text_by_sentences(text)  # Chunk text by sentences
        if not chunks or len(chunks) > 10:  # Fallback to token-based chunking if chunks is empty or more than 10
            chunks = chunk_text_by_tokens(text, max_tokens=MAX_TOKENS)

        # Classify chunks safely
        aggregated_scores = {category: 0.0 for category in categories}
        total_length = sum(len(chunk) for chunk in chunks)  # Total length of all chunks

        for chunk in chunks:

            # Skip empty chunks
            if not chunk.strip():
                continue

            # Perform classification on chunk
            result = classifier(chunk, candidate_labels=categories)

            # Aggregate scores
            for label, score in zip(result["labels"], result["scores"]):
                aggregated_scores[label] += score * len(chunk) / total_length  # Weighted score based on chunk length

        # Compute final category and confidence score
        top_category = max(aggregated_scores, key=aggregated_scores.get)  # Get category with the highest score
        top_score = aggregated_scores[top_category]  # Get corresponding score

        # Check confidence threshold
        if top_score < CONFIDENCE_THRESHOLD:  # If the score is below the threshold
            logging.warning(f"Low confidence prediction: {top_category} ({top_score})")  # Log warning
            # Override to "Other" with full confidence
            top_category = "Other"
            aggregated_scores = {category: 0.0 for category in categories}  # Reset scores
            aggregated_scores["Other"] = 1.0  # Assign full confidence to "Other"

        return top_category, aggregated_scores  # Return classified category and scores

    except Exception as e:
        logging.error(f"Error during text classification: {str(e)}")
        raise ModelInferenceError(str(e))  # Raise a model inference error
