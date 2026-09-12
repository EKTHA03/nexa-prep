import React, { useState } from 'react';
import { Award, RotateCcw, CheckCircle2, XCircle, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../common/Button';
import { getScoreColorClass } from '../../utils/colorMap';
import { QuizQuestionReviewItem } from '../../hooks/useQuiz';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  reviewItems?: QuizQuestionReviewItem[];
  onRetake: () => void;
}

export function QuizResults({ score, totalQuestions, reviewItems = [], onRetake }: QuizResultsProps) {
  const scoreColor = getScoreColorClass(score);
  const [filterMode, setFilterMode] = useState<'wrong-only' | 'all'>('wrong-only');
  const [expandedExplanations, setExpandedExplanations] = useState<{ [qId: string]: boolean }>({});

  const incorrectItems = reviewItems.filter(item => !item.isCorrect);
  const displayedItems = filterMode === 'wrong-only' ? incorrectItems : reviewItems;

  const toggleExplanation = (qId: string) => {
    setExpandedExplanations(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Top Score Summary Banner */}
      <div className="glass-card p-8 rounded-2xl border border-slate-800 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
          <Award className="w-10 h-10" />
        </div>

        <div>
          <h3 className="text-2xl font-black text-slate-100">Quiz Completed!</h3>
          <p className="text-xs text-slate-400 mt-1">
            Skill assessment calculated strictly from your 30-second timed responses
          </p>
        </div>

        <div className={`inline-block px-6 py-3 rounded-2xl border text-3xl font-black font-mono ${scoreColor}`}>
          {score}% Score
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button variant="outline" size="sm" icon={<RotateCcw className="w-4 h-4" />} onClick={onRetake}>
            Retake Assessment
          </Button>
        </div>
      </div>

      {/* Question Review Section (Issue 3 Requirement) */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>📋 Question Review & Correct Answers</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Review missed questions, auto-submitted timeouts, and official model explanations.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs font-bold shrink-0">
            <button
              onClick={() => setFilterMode('wrong-only')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === 'wrong-only'
                  ? 'bg-rose-600/30 border border-rose-500/50 text-rose-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Incorrect / Missed ({incorrectItems.length})
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === 'all'
                  ? 'bg-indigo-600/30 border border-indigo-500/50 text-indigo-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Questions ({reviewItems.length})
            </button>
          </div>
        </div>

        {displayedItems.length === 0 ? (
          <div className="p-8 text-center bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h5 className="font-bold text-emerald-300 text-base">Perfect Score! No wrong answers!</h5>
            <p className="text-xs text-emerald-200/80">You answered all {totalQuestions} questions correctly within the 30s limit.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedItems.map((item) => {
              const qId = item.question.id;
              const isExpanded = expandedExplanations[qId] !== false; // Default open

              return (
                <div
                  key={qId}
                  className={`p-5 rounded-2xl border transition-all ${
                    item.isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : item.isTimeout
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : 'bg-rose-950/20 border-rose-500/40'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Question {item.questionNumber} • {item.question.category}
                        </span>
                        {item.isCorrect ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Correct
                          </span>
                        ) : item.isTimeout ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Time Expired (00:00)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30 flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Incorrect
                          </span>
                        )}
                      </div>
                      <h5 className="text-sm sm:text-base font-bold text-slate-100 leading-snug">
                        {item.question.question}
                      </h5>
                    </div>

                    <button
                      onClick={() => toggleExplanation(qId)}
                      className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800/40 transition shrink-0"
                      title={isExpanded ? "Collapse explanation" : "Expand explanation"}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Answer Comparison Block */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-xs font-medium">
                    {/* User's Choice */}
                    <div
                      className={`p-3 rounded-xl border ${
                        item.isCorrect
                          ? 'bg-emerald-900/30 border-emerald-500/40 text-emerald-200'
                          : item.isTimeout
                          ? 'bg-amber-900/30 border-amber-500/40 text-amber-200'
                          : 'bg-rose-900/30 border-rose-500/40 text-rose-200'
                      }`}
                    >
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Your Answer:
                      </span>
                      <div className="flex items-center gap-2">
                        {item.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : item.isTimeout ? (
                          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span className="font-bold">{item.selectedText}</span>
                      </div>
                    </div>

                    {/* Official Correct Answer */}
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                        Official Correct Answer:
                      </span>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-bold">{item.correctText}</span>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Explanation */}
                  {isExpanded && item.explanation && (
                    <div className="mt-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Explanation & Key Concept:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed pl-5">{item.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

