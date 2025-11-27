import React from 'react';
import { User, AppView } from '../types';
import { BookOpen, BarChart2, Award, LogOut, PlusCircle } from 'lucide-react';

interface NavbarProps {
  user: User;
  currentView: AppView;
  setView: (view: AppView) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, currentView, setView, onLogout }) => {
  const navItemClass = (view: AppView) => 
    `flex flex-col items-center justify-center p-2 text-xs font-medium rounded-lg transition-colors ${
      currentView === view 
        ? 'text-indigo-600 bg-indigo-50' 
        : 'text-slate-500 hover:text-indigo-500 hover:bg-slate-50'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg lg:relative lg:border-t-0 lg:shadow-none lg:bg-transparent lg:w-64 lg:flex-col lg:h-screen lg:border-r z-50">
      
      {/* Desktop Header */}
      <div className="hidden lg:flex items-center gap-3 px-6 py-8">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <BookOpen className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Notetaker.ai</h1>
      </div>

      <div className="flex lg:flex-col justify-around lg:justify-start lg:px-4 lg:gap-2 h-16 lg:h-auto">
        <button onClick={() => setView(AppView.DASHBOARD)} className={`${navItemClass(AppView.DASHBOARD)} lg:flex-row lg:justify-start lg:px-4 lg:py-3 lg:text-sm`}>
          <BookOpen className="w-6 h-6 lg:w-5 lg:h-5 lg:mr-3 mb-1 lg:mb-0" />
          <span className="hidden lg:inline">Dashboard</span>
          <span className="lg:hidden">Home</span>
        </button>

        <button onClick={() => setView(AppView.CREATE_QUIZ)} className={`${navItemClass(AppView.CREATE_QUIZ)} lg:flex-row lg:justify-start lg:px-4 lg:py-3 lg:text-sm`}>
          <PlusCircle className="w-6 h-6 lg:w-5 lg:h-5 lg:mr-3 mb-1 lg:mb-0" />
          <span className="hidden lg:inline">New Quiz</span>
          <span className="lg:hidden">Create</span>
        </button>

        <button onClick={() => setView(AppView.ANALYTICS)} className={`${navItemClass(AppView.ANALYTICS)} lg:flex-row lg:justify-start lg:px-4 lg:py-3 lg:text-sm`}>
          <BarChart2 className="w-6 h-6 lg:w-5 lg:h-5 lg:mr-3 mb-1 lg:mb-0" />
          <span className="hidden lg:inline">Progress</span>
          <span className="lg:hidden">Stats</span>
        </button>

        <button onClick={() => setView(AppView.LEADERBOARD)} className={`${navItemClass(AppView.LEADERBOARD)} lg:flex-row lg:justify-start lg:px-4 lg:py-3 lg:text-sm`}>
          <Award className="w-6 h-6 lg:w-5 lg:h-5 lg:mr-3 mb-1 lg:mb-0" />
          <span className="hidden lg:inline">Leaderboard</span>
          <span className="lg:hidden">Rank</span>
        </button>
      </div>

      {/* User Profile / Logout (Desktop Bottom) */}
      <div className="hidden lg:flex flex-col mt-auto p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <img src={user.avatarUrl} alt={user.username} className="w-10 h-10 rounded-full bg-slate-100" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-800">{user.username}</span>
            <span className="text-xs text-slate-500">Student</span>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </nav>
  );
};
