import { QuizQuestion } from "../types";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const generateQuizFromNotes = async (
  files: File[],
  textContext: string = ""
): Promise<{ title: string; questions: QuizQuestion[] }> => {

  const formData = new FormData();

  if (files.length > 0) {
    formData.append('file', files[0]);
  }

  if (textContext) {
    formData.append('text', textContext);
  }

  try {
    const response = await fetch(`${API_URL}/quizzes/generate`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to generate quiz');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};
