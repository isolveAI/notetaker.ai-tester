from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional, List
from google.cloud import storage
import vertexai
from vertexai.generative_models import GenerativeModel, Part
import json
import os
import time
import uuid
from backend.firebase_setup import db

router = APIRouter()

# Initialize Vertex AI
project_id = os.getenv('GOOGLE_CLOUD_PROJECT')
location = os.getenv('GOOGLE_CLOUD_LOCATION', 'us-central1')
if project_id:
    vertexai.init(project=project_id, location=location)

def upload_to_gcs(file: UploadFile, filename: str) -> str:
    bucket_name = os.getenv('GOOGLE_CLOUD_STORAGE_BUCKET')
    if not bucket_name:
        raise HTTPException(status_code=500, detail="Storage bucket not configured")
    
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(filename)
    blob.upload_from_file(file.file)
    return f"gs://{bucket_name}/{filename}"

@router.post("/generate")
async def generate_quiz(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None)
):
    if not file and not text:
        raise HTTPException(status_code=400, detail="Either file or text must be provided")

    parts = []
    
    if text:
        parts.append(Part.from_text(text))

    if file:
        filename = f"uploads/{uuid.uuid4()}_{file.filename}"
        gcs_uri = upload_to_gcs(file, filename)
        # For Gemini, we can pass the GCS URI directly if it's a supported file type
        # Or we can read the file content. For now, let's assume text/pdf and pass as Part
        # Actually, for Vertex AI, passing GCS URI for documents is best.
        # But for simplicity in this prototype, let's read text if it's small, or use GCS URI.
        # Let's stick to the prompt structure from the original code but adapted for Vertex AI SDK.
        
        # Note: Vertex AI SDK handles GCS URIs for some mime types.
        # Let's try to just pass the text content if it's a text file, or use the GCS URI.
        parts.append(Part.from_uri(uri=gcs_uri, mime_type=file.content_type))

    prompt = """
    Act as a strict Teaching Assistant. Analyze the provided notes (document or text) deeply. 
    Create a challenging multiple-choice quiz with 5 to 10 questions to test the student's understanding of the material.
    Focus on key concepts, definitions, and logic found specifically in the notes.
    
    Return a JSON object with a 'title' for the quiz (based on the content topic) and an array of 'questions'.
    Each question must have:
    - 'question': The question text.
    - 'options': An array of 4 possible answers.
    - 'correctAnswerIndex': The index (0-3) of the correct option.
    - 'explanation': A brief explanation of why the answer is correct, citing the notes if possible.
    """
    parts.append(Part.from_text(prompt))

    model = GenerativeModel("gemini-1.5-flash-001")
    
    try:
        response = model.generate_content(
            parts,
            generation_config={"response_mime_type": "application/json"}
        )
        
        quiz_data = json.loads(response.text)
        
        # Add metadata
        quiz_id = str(uuid.uuid4())
        quiz_data['id'] = quiz_id
        quiz_data['createdAt'] = int(time.time() * 1000)
        quiz_data['totalQuestions'] = len(quiz_data['questions'])
        
        # Save to Firestore
        db.collection('quizzes').document(quiz_id).set(quiz_data)
        
        return quiz_data
        
    except Exception as e:
        print(f"Error generating quiz: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")

@router.get("/")
async def get_quizzes():
    quizzes_ref = db.collection('quizzes')
    docs = quizzes_ref.stream()
    return [doc.to_dict() for doc in docs]
