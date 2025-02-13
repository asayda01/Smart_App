# backend/utils.py


# Standard Library Imports
import re

# Third-party Imports
import nltk
from nltk.corpus import stopwords
from transformers import AutoTokenizer,pipeline
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import sent_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer

# Download NLTK resources
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt')

# Initialize the tokenizer for token counting (for BART)
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
    current_sentence_count = 0

    for sentence in sentences:
        current_chunk.append(sentence)
        current_sentence_count += 1

        if current_sentence_count >= max_sentences:
            chunks.append(' '.join(current_chunk))
            current_chunk = []
            current_sentence_count = 0

    if current_chunk:
        chunks.append(' '.join(current_chunk))

    return chunks


def summarize_large_text(text: str, summary_ratio: float = 0.2) -> str:
    """
    Summarize large text using BART summarization model.
    """
    max_length = int(len(text.split()) * summary_ratio)
    summary = summarizer(text, max_length=max_length, min_length=30, do_sample=False)
    return summary[0]['summary_text']


def extract_keywords(text: str, max_features: int = 10) -> list:
    vectorizer = TfidfVectorizer(max_features=max_features)
    tfidf_matrix = vectorizer.fit_transform([text])
    feature_names = vectorizer.get_feature_names_out()
    return feature_names.tolist()