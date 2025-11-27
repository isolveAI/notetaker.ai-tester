import React from 'react';
import { User, LeaderboardEntry } from '../types';
import { getQuizResults } from '../services/storageService';
import { Award, User as UserIcon } from 'lucide-react';

interface LeaderboardProps {
  currentUser: User;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser }) => {
  const results = getQuizResults();
  
  // Calculate user's total score (simplified for demo)
  const userTotalScore = results.reduce((acc, curr) => acc + (curr.score * 10), 0);
  
  // Mock data + Current User
  const mockUsers: LeaderboardEntry[] = [
    { username: 'AlexStudyBot', score: 4500, rank: 1, avatar: 'https://picsum.photos/100/100?random=1' },
    { username: 'NotesMaster99', score: 3250, rank: 2, avatar: 'https://picsum.photos/100/100?random=2' },
    { username: 'QuizQueen', score: 2800, rank: 3, avatar: 'https://picsum.photos/100/100?random=3' },
    { username: 'LateNightCoder', score: 1500, rank: 4, avatar: 'https://picsum.photos/100/100?random=4' },
    { username: currentUser.username, score: userTotalScore, rank: 0, avatar: currentUser.avatarUrl },
  ];

  // Sort
  const sortedUsers = mockUsers.sort((a, b) => b.score - a.score);
  
  // Assign ranks
  const finalLeaderboard = sortedUsers.map((u, i) => ({ ...u, rank: i + 1 }));

  return (
    <div className="max-w-3xl mx-auto w-full p-6 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Class Leaderboard</h2>
        <p className="text-slate-500">Compete with friends and see who knows the material best!</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {finalLeaderboard.map((entry) => {
            const isCurrentUser = entry.username === currentUser.username;
            const isTop3 = entry.rank <= 3;
            
            return (
              <div 
                key={entry.rank} 
                className={`flex items-center p-4 md:p-6 transition-colors ${isCurrentUser ? 'bg-indigo-50/60' : 'hover:bg-slate-50'}`}
              >
                <div className={`flex-shrink-0 w-8 md:w-12 text-center font-bold text-lg md:text-xl mr-4 md:mr-6 ${
                  entry.rank === 1 ? 'text-yellow-500' :
                  entry.rank === 2 ? 'text-slate-400' :
                  entry.rank === 3 ? 'text-orange-500' :
                  'text-slate-400'
                }`}>
                  #{entry.rank}
                </div>
                
                <div className="relative mr-4">
                  <img src={entry.avatar} alt={entry.username} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-200 object-cover" />
                  {isTop3 && (
                    <div className="absolute -top-1 -right-1 bg-yellow-100 rounded-full p-1 border border-white">
                      <Award className="w-3 h-3 text-yellow-600" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className={`font-semibold md:text-lg ${isCurrentUser ? 'text-indigo-900' : 'text-slate-800'}`}>
                    {entry.username} {isCurrentUser && '(You)'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {Math.floor(entry.score / 100)} quizzes completed
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-indigo-600 md:text-xl">{entry.score}</p>
                  <p className="text-xs text-indigo-400 uppercase tracking-wide font-medium">XP</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
