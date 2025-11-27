import React, { useState } from 'react';
import { User } from '../types';
import { Button } from './Button';
import { saveUser } from '../services/storageService';
import { BookOpen } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    const user: User = {
      username: username.trim(),
      avatarUrl: `https://ui-avatars.com/api/?name=${username}&background=4f46e5&color=fff`,
    };
    saveUser(user);
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mx-auto mb-6">
            <BookOpen className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Notetaker.ai</h1>
          <p className="text-slate-500">Turn your lecture notes into quizzes instantly with AI.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
              What should we call you?
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter your name"
              required
            />
          </div>
          <Button type="submit" className="w-full py-3 text-lg">
            Start Learning
          </Button>
        </form>
      </div>
    </div>
  );
};
