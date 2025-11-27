import React, { useState } from 'react';
import { Quiz, QuizResult } from '../types';
import { Button } from './Button';
import { CheckCircle, XCircle, Share2, ArrowRight, RefreshCw, Trophy } from 'lucide-react';
import { saveQuizResult } from '../services/storageService';

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const currentQuestion = quiz.questions[currentIndex];
  const progress = ((currentIndex + (isFinished ? 1 : 0)) / quiz.questions.length) * 100;

  const handleOptionSelect = (index: number) => {
    if (isAnswerRevealed) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;

    setIsAnswerRevealed(true);
    if (selectedOption === currentQuestion.correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setIsFinished(true);
    const result: QuizResult = {
      quizId: quiz.id,
      quizTitle: quiz.title,
      score: score + (selectedOption === currentQuestion.correctAnswerIndex ? 0 : 0), // Score is already updated for previous Qs, but ensure logic holds
      total: quiz.questions.length,
      date: new Date().toISOString(),
    };
    try {
      await saveQuizResult(result);
    } catch (error) {
      console.error("Failed to save result", error);
    }
  };

  const handleShare = () => {
    const text = `I just scored ${score}/${quiz.questions.length} on the "${quiz.title}" quiz using Notetaker.ai! Can you beat me?`;
    navigator.clipboard.writeText(text);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  if (isFinished) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    let message = "Keep studying!";
    if (percentage >= 90) message = "Outstanding! A+ material.";
    else if (percentage >= 70) message = "Good job! You know your stuff.";

    return (
      <div className="max-w-lg mx-auto w-full pt-10 px-6 animate-fade-in text-center">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-yellow-600" />
          </div>

          <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Complete!</h2>
          <p className="text-slate-500 mb-8">{message}</p>

          <div className="flex items-end justify-center gap-2 mb-8">
            <span className="text-6xl font-black text-indigo-600 tracking-tighter">{score}</span>
            <span className="text-2xl font-bold text-slate-400 mb-2">/ {quiz.questions.length}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <Button variant="outline" onClick={handleShare} className="w-full relative">
              {showShareTooltip && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                  Copied to clipboard!
                </span>
              )}
              <Share2 className="w-4 h-4 mr-2" />
              Share Score
            </Button>
            <Button variant="primary" onClick={onComplete} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Done
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full pt-6 px-4 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">{quiz.title}</h2>
          <p className="text-xs text-slate-500 font-medium tracking-wide uppercase mt-1">
            Question {currentIndex + 1} of {quiz.questions.length}
          </p>
        </div>
        <div className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Score: {score}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-slate-100 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-6">
        <h3 className="text-xl font-medium text-slate-800 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let stateClass = "border-slate-200 hover:border-indigo-300 hover:bg-slate-50";
            let icon = null;

            if (isAnswerRevealed) {
              if (idx === currentQuestion.correctAnswerIndex) {
                stateClass = "border-green-500 bg-green-50 text-green-800";
                icon = <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />;
              } else if (idx === selectedOption) {
                stateClass = "border-red-300 bg-red-50 text-red-800";
                icon = <XCircle className="w-5 h-5 text-red-500 ml-auto" />;
              } else {
                stateClass = "border-slate-100 opacity-50";
              }
            } else if (selectedOption === idx) {
              stateClass = "border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-600";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={isAnswerRevealed}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center ${stateClass}`}
              >
                <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold mr-4 ${selectedOption === idx || (isAnswerRevealed && idx === currentQuestion.correctAnswerIndex)
                    ? 'border-transparent bg-current text-white bg-opacity-20' // Simplified styling logic
                    : 'border-slate-300 text-slate-400'
                  }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1">{option}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Feedback Section */}
        {isAnswerRevealed && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {selectedOption === currentQuestion.correctAnswerIndex
                  ? <div className="p-1 bg-green-100 rounded-full"><CheckCircle className="w-4 h-4 text-green-600" /></div>
                  : <div className="p-1 bg-red-100 rounded-full"><XCircle className="w-4 h-4 text-red-600" /></div>
                }
              </div>
              <div>
                <p className="font-semibold text-slate-800 mb-1">
                  {selectedOption === currentQuestion.correctAnswerIndex ? 'Correct!' : 'Incorrect'}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex justify-end">
        {!isAnswerRevealed ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null}
            className="w-full sm:w-auto"
          >
            Check Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className="w-full sm:w-auto">
            {currentIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
