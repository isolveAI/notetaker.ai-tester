import React, { useState } from 'react';
import { User } from '../types';
import { Button } from './Button';
import { saveUser, loginUser } from '../services/storageService';
import { BookOpen } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      const user = await loginUser(token);
      onLogin(user);
    } catch (err: any) {
      console.error("Login failed", err);
      setError('Failed to sign in with Google. Please check your configuration.');
    } finally {
      setLoading(false);
    }
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

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 text-lg bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-2"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or continue as guest</span>
            </div>
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
    </div>
  );
};
