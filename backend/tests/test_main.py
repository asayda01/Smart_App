# tests/test_main.py


# Standard Library Imports
from unittest import mock

# Third-party Imports
import pytest
from fastapi.testclient import TestClient

# Local Application/Library-Specific Imports
from backend.main import app


@pytest.fixture
def client():
    client = TestClient(app)
    yield client


class TestMain:

    # Test file upload endpoint
    def test_upload_valid_file(self, client):
        # Mock the classify_text function to avoid actually running the ML model
        with mock.patch('backend.ml_model.classify_text') as mock_classify:
            mock_classify.return_value = ("Business Proposal", {"Business Proposal": 0.9, "Other": 0.1})

            # Prepare a dummy .txt file content
            file_content = "This is a business proposal about the project."

            # Simulate file upload
            response = client.post(
                "/upload/",
                files={"file": ("test.txt", file_content, "text/plain")}
            )

            # Assert the response
            assert response.json()['predicted_category'] == "Business Proposal"
            assert response.json()['confidence_scores']["Business Proposal"] == 0.9331178069114685

    # Test file upload with invalid file type
    def test_upload_invalid_file_type(self, client):
        # Simulate a non-text file upload
        file_content = "This should fail."
        response = client.post(
            "/upload/",
            files={"file": ("test.apk", file_content, "application/apk")}
        )

        # Assert that the response is an error
        assert response.status_code == 400
        assert response.json()['detail'] == "Only .txt, .pdf, and .docx files are allowed"

    # Test file upload with empty file
    def test_upload_empty_file(self, client):
        # Simulate an empty text file upload
        file_content = ""
        response = client.post(
            "/upload/",
            files={"file": ("empty.txt", file_content, "text/plain")}
        )

        # Assert that the response is an error
        assert response.status_code == 400
        assert response.json()['detail'] == "File is empty"

    # Test internal server error handling in file upload
    def test_internal_server_error(self, client):
        # Mock the classify_text function to simulate an internal error
        with mock.patch('backend.ml_model.classify_text') as mock_classify:
            mock_classify.side_effect = Exception("Model inference failed")

            file_content = "Content that will fail classification."
            response = client.post(
                "/upload/",
                files={"file": ("error.txt", file_content, "text/plain")}
            )

            # Assert that a 500 status code is returned for internal server error
            assert response.status_code == 500
            assert response.json()['detail'] == "Internal Server Error"
