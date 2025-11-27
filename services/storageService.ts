import { QuizResult, User } from '../types';

const KEYS = {
  USER: 'notetaker_user',
  RESULTS: 'notetaker_results',
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

export const saveQuizResult = (result: QuizResult): void => {
  const existing = getQuizResults();
  existing.push(result);
  localStorage.setItem(KEYS.RESULTS, JSON.stringify(existing));
};

export const getQuizResults = (): QuizResult[] => {
  const data = localStorage.getItem(KEYS.RESULTS);
  return data ? JSON.parse(data) : [];
};
