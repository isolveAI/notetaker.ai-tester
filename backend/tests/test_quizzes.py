import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import os

os.environ['GOOGLE_CLOUD_PROJECT'] = 'test-project'
os.environ['GOOGLE_CLOUD_STORAGE_BUCKET'] = 'test-bucket'

# Must patch before app import to prevent real initialization
with patch('backend.routers.quizzes.vertexai.init'):
    from backend.main import app
    from backend.firebase_setup import get_db

mock_db = MagicMock()

def get_db_override():
    return mock_db

app.dependency_overrides[get_db] = get_db_override

client = TestClient(app)

@pytest.fixture
def mock_storage():
    # Patch where the object is used
    with patch('backend.routers.quizzes.storage.Client') as mock:
        yield mock

@pytest.fixture
def mock_vertexai():
    # Patch where the object is used
    with patch('backend.routers.quizzes.GenerativeModel') as mock:
        yield mock

@pytest.fixture(autouse=True)
def reset_mocks(mock_storage, mock_vertexai):
    mock_db.reset_mock()
    mock_storage.reset_mock()
    mock_vertexai.reset_mock()

def test_generate_quiz_no_input():
    response = client.post("/quizzes/generate")
    assert response.status_code == 400
    assert response.json() == {"detail": "Either file or text must be provided"}

def test_generate_quiz_with_text(mock_vertexai):
    mock_model_instance = mock_vertexai.return_value
    mock_response = MagicMock()
    mock_response.text = '''
    {
        "title": "Test Quiz",
        "questions": [
            {
                "question": "What is the capital of France?",
                "options": ["Paris", "London", "Berlin", "Madrid"],
                "correctAnswerIndex": 0,
                "explanation": "Paris is the capital of France."
            }
        ]
    }
    '''
    mock_model_instance.generate_content.return_value = mock_response

    response = client.post("/quizzes/generate", data={"text": "This is a test text."})

    assert response.status_code == 200
    response_json = response.json()
    assert response_json["title"] == "Test Quiz"

def test_generate_quiz_with_file(mock_storage, mock_vertexai):
    mock_bucket = MagicMock()
    mock_blob = MagicMock()
    mock_storage.return_value.bucket.return_value = mock_bucket
    mock_bucket.blob.return_value = mock_blob

    mock_model_instance = mock_vertexai.return_value
    mock_response = MagicMock()
    mock_response.text = '''
    {
        "title": "Test Quiz from File",
        "questions": []
    }
    '''
    mock_model_instance.generate_content.return_value = mock_response

    with open("test.txt", "w") as f:
        f.write("file content")

    with open("test.txt", "rb") as f:
        response = client.post("/quizzes/generate", files={"file": ("test.txt", f, "text/plain")})

    os.remove("test.txt")

    assert response.status_code == 200
    response_json = response.json()
    assert response_json["title"] == "Test Quiz from File"

def test_get_quizzes():
    mock_doc1 = MagicMock()
    mock_doc1.to_dict.return_value = {"id": "quiz1", "title": "Quiz 1"}
    mock_doc2 = MagicMock()
    mock_doc2.to_dict.return_value = {"id": "quiz2", "title": "Quiz 2"}

    mock_db.collection.return_value.stream.return_value = [mock_doc1, mock_doc2]

    response = client.get("/quizzes/")
    assert response.status_code == 200
    assert response.json() == [{"id": "quiz1", "title": "Quiz 1"}, {"id": "quiz2", "title": "Quiz 2"}]
