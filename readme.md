---

# Smart App - Document Classification Web Application

Smart App is a web application that allows users to upload documents, classify them into predefined categories using a pre-trained machine learning model, and view the classification results. The application is built with a **FastAPI backend** and a **React frontend**, leveraging modern tools and libraries for seamless functionality.

---

## Features

### Backend
- **Document Upload**: Users can upload `.txt` , `.pdf` and `.docx` files, which are processed and classified by the backend.
- **Document Classification**: Uses the `facebook/bart-large-mnli` model for zero-shot classification into categories:
  - Technical Documentation
  - Business Proposal
  - Legal Document
  - Academic Paper
  - General Article
  - Other

- **Database Storage**: Uploaded documents and their metadata (filename, content, predicted category, confidence scores, and upload timestamp) are stored in a **PostgreSQL** database.
- **RESTful API**: Well-documented API endpoints for uploading documents and retrieving classification results.
- **Error Handling**: Robust error handling for invalid file types, corrupt files, database errors, and model inference failures.
- **Logging and Monitoring**: Detailed logs for debugging and monitoring.

### Frontend
- **User-Friendly Interface**: Built with **React** for a responsive and intuitive user experience.
- **Drag-and-Drop Upload**: Users can upload files via drag-and-drop or file selection using `react-dropzone`.
- **Classification Results**: Displays the predicted category and confidence scores for each uploaded document.
- **Document List**: View all uploaded documents with sorting (by filename, category, upload time, or confidence score) and pagination (9 documents per page).
- **Error Handling**: Informative error messages for failed uploads or data fetching.
- **Responsive Design**: Works seamlessly across devices.

---

## Technologies Used

### Backend
- **FastAPI**: For building the RESTful API.
- **PostgreSQL**: For database storage.
- **SQLAlchemy**: For ORM and database interactions.
- **Hugging Face Transformers**: For zero-shot classification using the `facebook/bart-large-mnli` model.
- **Pydantic**: For data validation.
- **PyPDF2** and **python-docx**: For handling additional file formats.
- **Pytest**: For testing.

### Frontend
- **React**: For building the user interface.
- **Axios**: For API communication.
- **React-Dropzone**: For file uploads.
- **CSS Modules**: For scoped and maintainable styling.
- **Jest**: For testing.

---

## Installation and Setup

### Prerequisites
- Docker and Docker Compose installed.
- Python 3.11+.
- Node.js and npm installed for the frontend.

### Steps to Run the Application

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/asayda01/smart_app.git
   cd smart_app
   ```

2. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory with the following content:
     ```plaintext
     POSTGRES_USER = your_username
     POSTGRES_PASSWORD = your_password
     POSTGRES_DB = your_database
     POSTGRES_HOST = your_host
     POSTGRES_PORT = your_port
     ```

3. **Build and Run with Docker**:
   ```bash
   docker-compose up --build
   ```
   - The backend will be available at `http://localhost:8000`.
   - The frontend will be available at `http://localhost:3000` (if configured).

4. **Run the Frontend Locally**:
   - Navigate to the `frontend` directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm start
     ```

---

## API Documentation

### Endpoints
- **POST `/upload/`**: Upload a document for classification.
  - Request Body: `multipart/form-data` with a file.
  - Response: Classification results (predicted category and confidence scores).


- **GET `/documents/`**: Fetch all uploaded documents.
  - Response: List of documents with metadata.

- **DELETE `/documents/{doc_id}/`**: Delete a document by ID.
  - Response: JSONResponse including a message.

---

## Database Schema

The `documents` table stores the following metadata:
- `id`: Primary key.
- `filename`: Name of the uploaded file.
- `content`: Extracted text content.
- `predicted_category`: Predicted category.
- `confidence_scores`: Confidence scores for all categories.
- `upload_timestamp`: Timestamp of upload.

---

## Model Choice

The `facebook/bart-large-mnli` model was chosen for its:
- **Accuracy**: High performance in zero-shot classification tasks.
- **Speed**: Efficient inference without the need for fine-tuning.
- **Confidence Scores**: Provides useful confidence metrics for low-confidence predictions.

Alternatives considered:
- **TF-IDF with Logistic Regression**: Simpler and faster but less accurate for diverse document types.
- **Other Hugging Face Models**: Explored newer models such as `MoritzLaurer/DeBERTa-v3-base-mnli-fever-anli`,
`google/flan-t5-base` and `microsoft/deberta-v3-large-mnli` but prioritized ease of integration and reliability.

---

## Future Improvements
- Enhanced error handling and user feedback.
- Integration of newer ML models for improved accuracy.
- Expanded testing coverage.

---

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a detailed description of your changes.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For questions or feedback, please contact:
-  GitHub: [asayda01](https://github.com/asayda01)

---

-[![Download README.md](https://img.shields.io/badge/Download-README.md-blue)](https://raw.githubusercontent.com/asayda01/smart_app/main/README.md)

---

You can download the `README.md` file by clicking the "Download README.md" button above or by copying the content into a new file. Let me know if you need further assistance!