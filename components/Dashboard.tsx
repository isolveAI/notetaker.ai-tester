import React from 'react';
import { User, QuizResult, AppView } from '../types';
import { getQuizResults } from '../services/storageService';
import { Button } from './Button';
import { PlusCircle, TrendingUp, Clock, Book } from 'lucide-react';

interface DashboardProps {
  user: User;
  setView: (view: AppView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, setView }) => {
  const [results, setResults] = React.useState<QuizResult[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getQuizResults();
        setResults(data);
      } catch (error) {
        console.error("Failed to fetch results", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const recentResults = results.slice().reverse().slice(0, 3);
  const totalQuizzes = results.length;
  const avgScore = totalQuizzes > 0
    ? Math.round(results.reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0) / totalQuizzes)
    : 0;

  return (
    <div className="max-w-5xl mx-auto w-full p-6 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.username}!</h1>
            <p className="text-indigo-100 max-w-lg">
              Ready to master your lecture notes? Upload a PDF or paste your notes to generate a new quiz instantly.
            </p>
          </div>
          <Button
            variant="secondary"
            className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-none border-none whitespace-nowrap"
            onClick={() => setView(AppView.CREATE_QUIZ)}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create New Quiz
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Book className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Quizzes</p>
            <p className="text-2xl font-bold text-slate-800">{totalQuizzes}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Average Score</p>
            <p className="text-2xl font-bold text-slate-800">{avgScore}%</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Study Streak</p>
            <p className="text-2xl font-bold text-slate-800">3 Days</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
          <button onClick={() => setView(AppView.ANALYTICS)} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View All
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {recentResults.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentResults.map((res, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                      {Math.round((res.score / res.total) * 100)}%
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{res.quizTitle}</p>
                      <p className="text-xs text-slate-500">{new Date(res.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    {res.score}/{res.total}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <p>No quizzes taken yet. Start studying!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
