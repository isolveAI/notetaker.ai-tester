import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import auth, quizzes, results

app = FastAPI(title="Notetaker AI Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(quizzes.router, prefix="/quizzes", tags=["quizzes"])
app.include_router(results.router, prefix="/results", tags=["results"])

@app.get("/")
async def root():
    return {"message": "Welcome to Notetaker AI API"}
