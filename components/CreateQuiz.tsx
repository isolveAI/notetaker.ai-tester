import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { Button } from './Button';
import { generateQuizFromNotes } from '../services/geminiService';
import { Quiz } from '../types';

interface CreateQuizProps {
  onQuizGenerated: (quiz: Quiz) => void;
  onCancel: () => void;
}

export const CreateQuiz: React.FC<CreateQuizProps> = ({ onQuizGenerated, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf' || selectedFile.type === 'text/plain') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a PDF or Text file.');
      }
    }
  };

  const handleGenerate = async () => {
    if (!file && !textInput.trim()) {
      setError('Please provide lecture notes via file upload or text input.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const files = file ? [file] : [];
      const generatedData = await generateQuizFromNotes(files, textInput);
      
      const newQuiz: Quiz = {
        id: crypto.randomUUID(),
        title: generatedData.title,
        questions: generatedData.questions,
        createdAt: Date.now(),
        totalQuestions: generatedData.questions.length
      };

      onQuizGenerated(newQuiz);
    } catch (err: any) {
      setError(err.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">New Quiz</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-slate-600 mb-6">
          Upload your lecture notes (PDF) or paste the content below. Notetaker.ai will act as a strict Teaching Assistant to challenge you.
        </p>

        {/* File Upload Area */}
        <div 
          className={`border-2 border-dashed rounded-xl p-8 mb-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
            file ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.txt" 
            onChange={handleFileChange} 
          />
          
          {file ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <p className="font-medium text-indigo-900">{file.name}</p>
              <p className="text-xs text-indigo-600 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              <button 
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="mt-3 text-xs font-semibold text-red-500 hover:text-red-600"
              >
                Remove File
              </button>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="font-medium text-slate-700">Click to upload lecture notes</p>
              <p className="text-sm text-slate-500 mt-1">PDF or TXT files supported</p>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-sm text-slate-400 font-medium">OR</span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        {/* Text Input Area */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-2">Paste Notes Content</label>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[150px] resize-none text-slate-700 placeholder:text-slate-400"
            placeholder="Paste your lecture notes text here..."
          ></textarea>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={handleGenerate} isLoading={isLoading}>
            Generate Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};
