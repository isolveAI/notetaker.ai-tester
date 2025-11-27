import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

// Helper to encode file to Base64
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateQuizFromNotes = async (
  files: File[], 
  textContext: string = ""
): Promise<{ title: string; questions: QuizQuestion[] }> => {
  
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const parts: any[] = [];
  
  // Add files if present
  for (const file of files) {
    const part = await fileToGenerativePart(file);
    parts.push(part);
  }

  // Add text context if present
  if (textContext) {
    parts.push({ text: textContext });
  }

  // Add the prompt
  parts.push({
    text: `Act as a strict Teaching Assistant. Analyze the provided notes (document or text) deeply. 
    Create a challenging multiple-choice quiz with 5 to 10 questions to test the student's understanding of the material.
    Focus on key concepts, definitions, and logic found specifically in the notes.
    
    Return a JSON object with a 'title' for the quiz (based on the content topic) and an array of 'questions'.
    Each question must have:
    - 'question': The question text.
    - 'options': An array of 4 possible answers.
    - 'correctAnswerIndex': The index (0-3) of the correct option.
    - 'explanation': A brief explanation of why the answer is correct, citing the notes if possible.
    `
  });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: parts
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A short, descriptive title for the quiz based on the notes content." },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING } 
                },
                correctAnswerIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswerIndex", "explanation"]
            }
          }
        },
        required: ["title", "questions"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from Gemini.");
  }

  try {
    const result = JSON.parse(text);
    return result;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("Failed to parse the generated quiz. Please try again.");
  }
};
