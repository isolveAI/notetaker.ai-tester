import React, { useState, useEffect } from 'react';
import { User, AppView, Quiz } from './types';
import { getUser, logoutUser } from './services/storageService';
import { Login } from './components/Login';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CreateQuiz } from './components/CreateQuiz';
import { QuizPlayer } from './components/QuizPlayer';
import { Analytics } from './components/Analytics';
import { Leaderboard } from './components/Leaderboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setView] = useState<AppView>(AppView.LOGIN);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    const existingUser = getUser();
    if (existingUser) {
      setUser(existingUser);
      setView(AppView.DASHBOARD);
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setView(AppView.LOGIN);
    setActiveQuiz(null);
  };

  const handleQuizGenerated = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setView(AppView.TAKE_QUIZ);
  };

  const handleQuizComplete = () => {
    setView(AppView.DASHBOARD);
    setActiveQuiz(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar 
        user={user} 
        currentView={currentView} 
        setView={setView} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 overflow-y-auto h-screen pb-20 lg:pb-0">
        {currentView === AppView.DASHBOARD && (
          <Dashboard user={user} setView={setView} />
        )}
        
        {currentView === AppView.CREATE_QUIZ && (
          <CreateQuiz onQuizGenerated={handleQuizGenerated} onCancel={() => setView(AppView.DASHBOARD)} />
        )}

        {currentView === AppView.TAKE_QUIZ && activeQuiz && (
          <QuizPlayer quiz={activeQuiz} onComplete={handleQuizComplete} />
        )}

        {currentView === AppView.ANALYTICS && (
          <Analytics />
        )}

        {currentView === AppView.LEADERBOARD && (
          <Leaderboard currentUser={user} />
        )}
      </main>
    </div>
  );
};

export default App;
