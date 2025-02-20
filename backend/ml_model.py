# backend/ml_model.py


# Standard Library Imports
import logging
from typing import Dict, Tuple

# Third-party Imports
import torch
from transformers import pipeline
from sentence_transformers import SentenceTransformer

# Local Application/Library-Specific Imports
from .utils import chunk_text_by_sentences, chunk_text_by_tokens, preprocess_text, summarize_large_text
from .exceptions import ModelInferenceError

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load NLP Models
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Predefined categories
categories = [
    "Technical Documentation",
    "Business Proposal",
    "Legal Document",
    "Academic Paper",
    "General Article",
    "Other",
]
category_embeddings = embedding_model.encode(categories, convert_to_tensor=True)

# Initialize Constants
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
        # Preprocess text
        text = preprocess_text(text)

        # Ensure text isn't too long
        word_limit = 5000
        if len(text.split()) > word_limit:
            text = " ".join(text.split()[:word_limit])  # Trim text

        # Summarize large text if needed
        if len(text.split()) > SUMMARY_THRESHOLD:
            text = summarize_large_text(text)

        # # Extract keywords for additional context
        # keywords = extract_keywords(text)

        # Chunk text to avoid model failure
        chunks = chunk_text_by_sentences(text)
        if not chunks or len(chunks) > 10:  # Fallback to token-based chunking
            chunks = chunk_text_by_tokens(text, max_tokens=MAX_TOKENS)

        # Classify chunks safely
        aggregated_scores = {category: 0.0 for category in categories}
        total_length = sum(len(chunk) for chunk in chunks)

        for chunk in chunks:
            if not chunk.strip():
                continue  # Skip empty chunks
            result = classifier(chunk, candidate_labels=categories)
            for label, score in zip(result["labels"], result["scores"]):
                aggregated_scores[label] += score * len(chunk) / total_length  # Weighted score

        # Compute final category and confidence score
        top_category = max(aggregated_scores, key=aggregated_scores.get)
        top_score = aggregated_scores[top_category]

        # Check confidence threshold
        if top_score < CONFIDENCE_THRESHOLD:
            logging.warning(f"Low confidence prediction: {top_category} ({top_score})")
            # Override to "Other" category with 100% confidence
            top_category = "Other"
            aggregated_scores = {category: 0.0 for category in categories}
            aggregated_scores["Other"] = 1.0

        return top_category, aggregated_scores

    except Exception as e:
        logging.error(f"Error during text classification: {str(e)}")
        raise ModelInferenceError(str(e))
