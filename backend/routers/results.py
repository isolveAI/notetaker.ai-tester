from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from backend.firebase_setup import get_db
import time
from firebase_admin import firestore

router = APIRouter()

class QuizResult(BaseModel):
    quizId: str
    score: int
    total: int
    quizTitle: str

@router.post("/{quiz_id}/results")
async def save_result(quiz_id: str, result: QuizResult, db: firestore.Client = Depends(get_db)):
    try:
        result_data = result.dict()
        result_data['date'] = time.strftime("%Y-%m-%d")
        result_data['timestamp'] = int(time.time() * 1000)
        
        # Save to a subcollection or a top-level collection with user ID
        # For simplicity, let's use a top-level 'results' collection
        # In a real app, we'd want to associate this with the logged-in user
        
        db.collection('results').add(result_data)
        return {"message": "Result saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save result: {str(e)}")

@router.get("/")
async def get_results(db: firestore.Client = Depends(get_db)):
    try:
        results_ref = db.collection('results')
        docs = results_ref.stream()
        return [doc.to_dict() for doc in docs]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get results: {str(e)}")
