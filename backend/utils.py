# backend/utils.py


# Standard Library Imports
import re

# Third-party Imports
import nltk
from nltk.corpus import stopwords
from transformers import AutoTokenizer
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import sent_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer


# Download NLTK resources
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt')


# Initialize the tokenizer for token counting (for BART)
tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-mnli")

# Initialize NLP tools
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()


def preprocess_text(text: str) -> str:

    text = text.lower()
    text = re.sub(r'\W', ' ', text)  # Remove special characters
    text = re.sub(r'\s+', ' ', text)  # Remove extra spaces
    text = ' '.join([lemmatizer.lemmatize(word) for word in text.split() if word not in stop_words])
    return text


def chunk_text_by_sentences(text: str, max_sentences: int = 3) -> list:

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


def extract_keywords(text: str, max_features: int = 10) -> list:
    vectorizer = TfidfVectorizer(max_features=max_features)
    tfidf_matrix = vectorizer.fit_transform([text])
    feature_names = vectorizer.get_feature_names_out()
    return feature_names.tolist()
