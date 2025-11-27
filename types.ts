export interface User {
  username: string;
  avatarUrl: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  createdAt: number;
  score?: number;
  totalQuestions: number;
}

export interface QuizResult {
  quizId: string;
  score: number;
  total: number;
  date: string;
  quizTitle: string;
}

export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  CREATE_QUIZ = 'CREATE_QUIZ',
  TAKE_QUIZ = 'TAKE_QUIZ',
  ANALYTICS = 'ANALYTICS',
  LEADERBOARD = 'LEADERBOARD'
}

export interface LeaderboardEntry {
  username: string;
  score: number;
  rank: number;
  avatar: string;
}
