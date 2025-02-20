# backend/utils.py


# Standard Library Imports
import re
import logging

# Third-party Imports
import nltk  # Natural Language Toolkit for NLP tasks
from PyPDF2 import PdfReader  # PDF reading library
from nltk.corpus import stopwords  # Stop words for NLP
from fastapi import HTTPException  # Exception handling for FastAPI
from docx import Document as DocxDocument  # DOCX file handling
from transformers import AutoTokenizer, pipeline  # Transformers library for pre-trained models
from nltk.stem import WordNetLemmatizer  # Lemmatization tools for NLP
from nltk.tokenize import sent_tokenize  # Sentence tokenization


# Download NLTK resources
nltk.download('stopwords')  # Download stopwords corpus
nltk.download('wordnet')  # Download WordNet for lemmatization
nltk.download('punkt')  # Download punkt tokenizer for sentence splitting


# Initialize the tokenizer for token counting
tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-mnli")  # Load a tokenization model


# Initialize BART summarization model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")


# Initialize NLP tools
stop_words = set(stopwords.words('english'))  # Set of English stop words

# Initialize the lemmatizer
lemmatizer = WordNetLemmatizer()


# Preprocess the input text
def preprocess_text(text: str) -> str:
    text = text.lower()  # Convert text to lowercase
    text = re.sub(r'\W', ' ', text)  # Remove special characters
    text = re.sub(r'\s+', ' ', text)  # Remove extra spaces
    # Lemmatize words not in stop words
    text = ' '.join([lemmatizer.lemmatize(word) for word in text.split() if word not in stop_words])
    return text  # Return processed text


def chunk_text_by_tokens(text: str, max_tokens: int = 512) -> list:
    """
    Chunk text by tokens to ensure each chunk is within the model's token limit.
    """
    tokens = tokenizer.encode(text, truncation=False)  # Encode text to token IDs
    chunks = []  # Initialize list to hold text chunks

    for i in range(0, len(tokens), max_tokens):

        # Slice the tokens for current chunk
        chunk_tokens = tokens[i:i + max_tokens]
        chunk_text = tokenizer.decode(chunk_tokens, skip_special_tokens=True)  # Decode token IDs back to text
        chunks.append(chunk_text)  # Add chunk to list
    return chunks  # Return list of text chunks


def chunk_text_by_sentences(text: str, max_sentences: int = 7) -> list:
    """Chunk text by sentences."""
    sentences = sent_tokenize(text)  # Tokenize text into sentences
    chunks = []  # Initialize list to hold sentence chunks
    current_chunk = []  # Initialize current chunk

    for sentence in sentences:
        current_chunk.append(sentence)

        if len(current_chunk) >= max_sentences:  # If the chunk reaches the max size
            chunks.append(' '.join(current_chunk))  # Join and add current chunk to list
            current_chunk = []  # Reset current chunk

    if current_chunk:  # If there are remaining sentences
        chunks.append(' '.join(current_chunk))  # Join and add the last chunk

    return chunks  # Return list of sentence chunks


def summarize_large_text(text: str) -> str:
    """
    Summarize large text using BART summarization model with chunking.
    """
    max_length = 500  # Maximum length for each summarization chunk
    min_length = 100  # Minimum length for meaningful summaries
    chunked_texts = chunk_text_by_sentences(text, max_sentences=10)  # Chunk text by sentences

    summaries = []  # Initialize list for summaries
    for chunk in chunked_texts:
        try:
            # Summarize each chunk
            summary = summarizer(chunk, max_length=max_length, min_length=min_length, do_sample=False)
            summaries.append(summary[0]['summary_text'])
        except Exception as e:
            logging.error(f"Summarization failed for chunk: {e}")
            continue  # Skip failed chunks

    return " ".join(summaries) if summaries else text[:2000]  # Return combined summaries or a fallback if empty


def extract_text_from_file(file_path: str, file_extension: str) -> str:
    """
    Extract text from different file formats and ensure text length is manageable.
    """
    try:
        if file_extension == '.txt':  # If the file is a text file
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()  # Read the text content

        elif file_extension == '.pdf':  # If the file is a PDF
            reader = PdfReader(file_path)  # Create a PDF reader
            text = " ".join(page.extract_text() or "" for page in reader.pages)  # Extract text from all pages

        elif file_extension == '.docx':  # If the file is a DOCX
            doc = DocxDocument(file_path)  # Create a DOCX document reader
            text = "\n".join(paragraph.text for paragraph in doc.paragraphs)  # Extract text from paragraphs

        else:
            # Raise error for unsupported formats
            raise HTTPException(status_code=400, detail="Unsupported file format")

        # Ensure extracted text is within a reasonable limit (5000 words)
        word_limit = 5000  # Set word limit
        words = text.split()  # Split text into words
        if len(words) > word_limit:  # If the text exceeds the limit
            text = " ".join(words[:word_limit])  # Trim text to the limit

        # Return the extracted trimmed text
        return text

    # Handle extraction errors
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting text: {str(e)}")
