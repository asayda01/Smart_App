# backend/ml_model.py


# Standard Library Imports
import logging
from typing import Dict, Tuple

# Third-party Imports
import torch
from transformers import pipeline
from sentence_transformers import SentenceTransformer, util

# Local Application/Library-Specific Imports
from .utils import chunk_text_by_sentences, chunk_text_by_tokens, preprocess_text, extract_keywords, \
    summarize_large_text
from .exceptions import LowConfidencePrediction

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
CONFIDENCE_THRESHOLD = 0.3  # Minimum confidence for valid classification


def classify_text(text: str) -> Tuple[str, Dict[str, float]]:
    """
    Classify text using a hybrid approach: zero-shot classification and sentence embeddings.

    Args:
        text (str): The input text to classify.

    Returns:
        Tuple[str, Dict[str, float]]: The top predicted category and a dictionary of confidence scores.

    Raises:
        LowConfidencePrediction: If the confidence score for the top category is below the threshold.
    """
    try:
        # Preprocess text
        text = preprocess_text(text)
        logger.info("Text preprocessed successfully.")

        # Summarize large text if needed
        if len(text.split()) > SUMMARY_THRESHOLD:
            logger.info("Text is too long, summarizing...")
            text = summarize_large_text(text, summary_ratio=0.25)
            logger.info(f"Summarized text length: {len(text.split())} words")

        # Extract keywords for additional context
        keywords = extract_keywords(text)
        keyword_text = " ".join(keywords) if keywords else ""
        logger.info(f"Extracted keywords: {keywords}")

        # Chunk text intelligently
        chunks = chunk_text_by_sentences(text)
        if not chunks or len(chunks) > 10:  # Fallback to token-based chunking for very long documents
            chunks = chunk_text_by_tokens(text, max_tokens=MAX_TOKENS)
        logger.info(f"Text divided into {len(chunks)} chunks.")

        # Aggregate zero-shot classification scores
        aggregated_scores = {category: 0.0 for category in categories}
        total_length = sum(len(chunk) for chunk in chunks)

        for chunk in chunks:
            result = classifier(chunk, candidate_labels=categories)
            for label, score in zip(result["labels"], result["scores"]):
                aggregated_scores[label] += score * len(chunk) / total_length  # Weight by chunk length

        # Classify using Sentence Embeddings
        text_embedding = embedding_model.encode(text, convert_to_tensor=True)
        similarity_scores = util.pytorch_cos_sim(text_embedding, category_embeddings)[0]
        embedding_scores = {categories[i]: similarity_scores[i].item() for i in range(len(categories))}

        # Normalize embedding scores
        min_embed = min(embedding_scores.values())
        max_embed = max(embedding_scores.values())
        if max_embed > min_embed:
            for category in embedding_scores:
                embedding_scores[category] = (embedding_scores[category] - min_embed) / (max_embed - min_embed)

        # Dynamic weighting: Adjust based on text length
        weight_zero_shot = 0.8 if len(text.split()) < SUMMARY_THRESHOLD else 0.6
        weight_embeddings = 1 - weight_zero_shot

        # Combine scores
        final_scores = {
            category: (weight_zero_shot * aggregated_scores[category]) + (
                        weight_embeddings * embedding_scores[category])
            for category in categories
        }

        # Determine top category
        top_category = max(final_scores, key=final_scores.get)
        top_score = final_scores[top_category]

        # Check confidence threshold
        if top_score < CONFIDENCE_THRESHOLD:
            logger.warning(f"Low confidence prediction: {top_category} ({top_score})")
            raise LowConfidencePrediction(top_category, top_score)

        logger.info(f"Predicted category: {top_category} with confidence {top_score}")
        return top_category, final_scores

    except Exception as e:
        logger.error(f"Error during text classification: {str(e)}")
        raise
