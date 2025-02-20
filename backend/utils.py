# backend/utils.py


# Standard Library Imports
import re
import logging

# Third-party Imports
import nltk
from PyPDF2 import PdfReader
from nltk.corpus import stopwords
from fastapi import HTTPException
from docx import Document as DocxDocument
from transformers import AutoTokenizer, pipeline
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import sent_tokenize

# Download NLTK resources
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt')

# Initialize the tokenizer for token counting
tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-mnli")

# Initialize summarization pipeline
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Initialize NLP tools
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()


def preprocess_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'\W', ' ', text)  # Remove special characters
    text = re.sub(r'\s+', ' ', text)  # Remove extra spaces
    text = ' '.join([lemmatizer.lemmatize(word) for word in text.split() if word not in stop_words])
    return text


def chunk_text_by_tokens(text: str, max_tokens: int = 512) -> list:
    """
    Chunk text by tokens to ensure each chunk is within the model's token limit.
    """
    tokens = tokenizer.encode(text, truncation=False)
    chunks = []
    for i in range(0, len(tokens), max_tokens):
        chunk_tokens = tokens[i:i + max_tokens]
        chunk_text = tokenizer.decode(chunk_tokens, skip_special_tokens=True)
        chunks.append(chunk_text)
    return chunks


def chunk_text_by_sentences(text: str, max_sentences: int = 7) -> list:
    sentences = sent_tokenize(text)
    chunks = []
    current_chunk = []

    for sentence in sentences:
        current_chunk.append(sentence)

        if len(current_chunk) >= max_sentences:
            chunks.append(' '.join(current_chunk))
            current_chunk = []

    if current_chunk:
        chunks.append(' '.join(current_chunk))

    return chunks


def summarize_large_text(text: str) -> str:
    """
    Summarize large text using BART summarization model with chunking.
    """
    max_length = 500  # Limit each summarization chunk to 500 tokens
    min_length = 100  # Ensure meaningful summaries
    chunked_texts = chunk_text_by_sentences(text, max_sentences=10)

    summaries = []
    for chunk in chunked_texts:
        try:
            summary = summarizer(chunk, max_length=max_length, min_length=min_length, do_sample=False)
            summaries.append(summary[0]['summary_text'])
        except Exception as e:
            logging.error(f"Summarization failed for chunk: {e}")
            continue  # Skip failed chunks

    return " ".join(summaries) if summaries else text[:2000]  # Fallback if all chunks fail


def extract_text_from_file(file_path: str, file_extension: str) -> str:
    """
    Extract text from different file formats and ensure text length is manageable.
    """
    try:
        if file_extension == '.txt':
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()
        elif file_extension == '.pdf':
            reader = PdfReader(file_path)
            text = " ".join(page.extract_text() or "" for page in reader.pages)
        elif file_extension == '.docx':
            doc = DocxDocument(file_path)
            text = "\n".join(paragraph.text for paragraph in doc.paragraphs)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")

        # Ensure extracted text is within a reasonable limit (5000 words)
        word_limit = 5000
        words = text.split()
        if len(words) > word_limit:
            text = " ".join(words[:word_limit])  # Trim text

        return text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting text: {str(e)}")
