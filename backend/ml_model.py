# backend/ml_model.py


# Standard Library Imports
import logging
from typing import Dict, Tuple

# Third-party Imports
from transformers import pipeline

# Local Application/Library-Specific Imports
from .utils import chunk_text_by_sentences, preprocess_text, extract_keywords
from .exceptions import LowConfidencePrediction


# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize zero-shot classifier pipeline
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Predefined categories
categories = [
    "Technical Documentation",
    "Business Proposal",
    "Legal Document",
    "Academic Paper",
    "General Article",
    "Other",
]


def classify_text(text: str, confidence_threshold: float = 0.25) -> Tuple[str, Dict[str, float]]:
    """
    Classify text using an ensemble approach: classify both text chunks and extracted keywords separately.

    Args:
        text (str): The input text to classify.
        confidence_threshold (float): The minimum confidence score required for a valid prediction.

    Returns:
        Tuple[str, Dict[str, float]]: The top predicted category and a dictionary of confidence scores.

    Raises:
        LowConfidencePrediction: If the confidence score for the top category is below the threshold.
    """
    try:
        # Preprocess the text
        text = preprocess_text(text)
        logger.info("Text preprocessed successfully.")

        # Extract keywords for additional context
        keywords = extract_keywords(text)
        logger.info(f"Extracted keywords: {keywords}")

        # Chunk the text by sentences for efficient classification
        chunks = chunk_text_by_sentences(text)
        logger.info(f"Text divided into {len(chunks)} chunks.")

        # Aggregate scores by category
        aggregated_scores = {category: 0.0 for category in categories}
        total_length = 0

        # Classify text chunks
        for chunk in chunks:
            result = classifier(chunk, candidate_labels=categories)
            for label, score in zip(result["labels"], result["scores"]):
                aggregated_scores[label] += score * len(chunk)
            total_length += len(chunk)

        # Classify extracted keywords separately
        if keywords:
            keyword_text = " ".join(keywords)  # Convert list of keywords to a space-separated string
            keyword_result = classifier(keyword_text, candidate_labels=categories)
            for label, score in zip(keyword_result["labels"], keyword_result["scores"]):
                aggregated_scores[label] += score * len(keyword_text)  # Give weight proportional to keyword count

        # Normalize scores
        total_score = sum(aggregated_scores.values())
        if total_score > 0:
            for category in aggregated_scores:
                aggregated_scores[category] /= total_score

        # Get top category based on the highest score
        top_category = max(aggregated_scores, key=aggregated_scores.get)
        top_score = aggregated_scores[top_category]

        # Check if the top score meets the confidence threshold
        if top_score < confidence_threshold:
            logger.warning(f"Low confidence prediction: {top_category} ({top_score})")
            raise LowConfidencePrediction(top_category, top_score)

        logger.info(f"Predicted category: {top_category} with confidence {top_score}")
        return top_category, aggregated_scores

    except Exception as e:
        logger.error(f"Error during text classification: {str(e)}")
        raise
