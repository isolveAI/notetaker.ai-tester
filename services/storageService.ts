import { QuizResult, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const KEYS = {
  USER: 'notetaker_user',
};

export const saveUser = (user: User): void => {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const data = localStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const logoutUser = (): void => {
  localStorage.removeItem(KEYS.USER);
};

export const loginUser = async (idToken: string): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  saveUser(data.user);
  return data.user;
};

export const saveQuizResult = async (result: QuizResult): Promise<void> => {
  const response = await fetch(`${API_URL}/results/${result.quizId}/results`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(result),
  });

  if (!response.ok) {
    throw new Error('Failed to save result');
  }
};

export const getQuizResults = async (): Promise<QuizResult[]> => {
  const response = await fetch(`${API_URL}/results`);
  if (!response.ok) {
    throw new Error('Failed to get results');
  }
  return response.json();
};
