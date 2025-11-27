from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from firebase_admin import auth
from backend.firebase_setup import db

router = APIRouter()

class LoginRequest(BaseModel):
    idToken: str

@router.post("/login")
async def login(request: LoginRequest):
    try:
        decoded_token = auth.verify_id_token(request.idToken)
        uid = decoded_token['uid']
        email = decoded_token.get('email')
        name = decoded_token.get('name')
        picture = decoded_token.get('picture')

        user_ref = db.collection('users').document(uid)
        user_doc = user_ref.get()

        user_data = {
            'username': name or email,
            'email': email,
            'avatarUrl': picture,
            'uid': uid
        }

        if not user_doc.exists:
            user_ref.set(user_data)
        else:
            user_ref.update(user_data)

        return {"message": "Login successful", "user": user_data}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
