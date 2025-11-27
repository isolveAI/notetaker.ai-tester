import React from 'react';
import { getQuizResults } from '../services/storageService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Analytics: React.FC = () => {
  const results = getQuizResults();
  
  // Format data for chart
  const data = results.map((r, i) => ({
    name: `Quiz ${i + 1}`,
    score: Math.round((r.score / r.total) * 100),
    title: r.quizTitle,
    date: new Date(r.date).toLocaleDateString()
  })).slice(-10); // Last 10 quizzes

  return (
    <div className="max-w-4xl mx-auto w-full p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Performance Analytics</h2>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <h3 className="text-lg font-semibold text-slate-700 mb-6">Score History</h3>
        <div className="h-[300px] w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  tick={{fontSize: 12}} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  tick={{fontSize: 12}} 
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#4f46e5', fontWeight: 600 }}
                  labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#4f46e5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              Not enough data to display analytics yet.
            </div>
          )}
        </div>
      </div>
      
      {data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg">
             <p className="text-indigo-200 text-sm font-medium uppercase tracking-wider mb-1">Highest Score</p>
             <p className="text-4xl font-bold">{Math.max(...data.map(d => d.score))}%</p>
             <p className="text-sm text-indigo-300 mt-2">Personal Best</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Last Quiz</p>
             <p className="text-4xl font-bold text-slate-800">{data[data.length-1].score}%</p>
             <p className="text-sm text-slate-500 mt-2 truncate max-w-xs">{data[data.length-1].title}</p>
          </div>
        </div>
      )}
    </div>
  );
};
