import { useState } from 'react';

interface Question {
  q: string;
  options: string[];
  correct: number;
}

interface QuizViewProps {
  questions: Question[];
  passMark: number; // out of questions.length
  bgColor: string;  // e.g. '#030312'
  accentColor: string; // e.g. '#2563FF'
  onComplete: () => void;
  onClose: () => void;
}

export function QuizView({ questions, passMark, bgColor, accentColor, onComplete, onClose }: QuizViewProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const q = questions[currentIdx];
  const total = questions.length;

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === q.correct;
    if (correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentIdx < total - 1) {
      setCurrentIdx((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const finalScore = showResult ? score : score; // already updated
  const passed = finalScore >= passMark;

  if (showResult) {
    return (
      <div
        className="flex-1 flex items-center justify-center p-4 min-h-[calc(100vh-60px)]"
        style={{ backgroundColor: bgColor }}
      >
        <div className="bg-[#F2EDE4] border-[3px] border-[#0A0A0A] neubrutalism-box p-10 max-w-md w-full text-center">
          <div
            className="font-display text-8xl mb-2"
            style={{ color: passed ? '#00E676' : '#FF3B3B' }}
          >
            {passed ? 'PASS' : 'FAIL'}
          </div>
          <p className="font-display text-4xl text-[#0A0A0A] mb-2">
            {finalScore}/{total}
          </p>
          <p className="font-bold text-gray-600 mb-8 uppercase text-sm">
            {passed ? 'Lesson unlocked!' : `Need ${passMark}/${total} to pass`}
          </p>
          {passed ? (
            <button
              onClick={onComplete}
              className="w-full py-4 font-bold uppercase border-[3px] border-[#0A0A0A] text-[#0A0A0A] hover:text-white transition-colors"
              style={{ backgroundColor: accentColor }}
            >
              Continue
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full bg-[#FF3B3B] text-white py-4 font-bold uppercase border-[3px] border-[#0A0A0A] hover:bg-[#0A0A0A] transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex items-center justify-center p-4 min-h-[calc(100vh-60px)]"
      style={{ backgroundColor: bgColor }}
    >
      <div className="bg-[#F2EDE4] border-[3px] border-[#0A0A0A] neubrutalism-box p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b-[3px] border-[#0A0A0A]">
          <div>
            <span className="font-display text-xl text-[#0A0A0A]">Question {currentIdx + 1}/{total}</span>
            <div className="flex gap-1 mt-2">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className="h-2 flex-1 border border-[#0A0A0A]"
                  style={{
                    backgroundColor: i < currentIdx ? accentColor : i === currentIdx ? '#FFE500' : '#e5e7eb',
                  }}
                />
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="font-bold uppercase text-sm text-gray-500 hover:text-[#FF3B3B] transition-colors px-3 py-1 border-[2px] border-transparent hover:border-[#FF3B3B]"
          >
            Abort
          </button>
        </div>

        {/* Question */}
        <h2 className="text-xl font-bold text-[#0A0A0A] mb-8 leading-snug">{q.q}</h2>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {q.options.map((opt, i) => {
            let btnClass = 'w-full p-4 border-[3px] text-left font-bold transition-all text-[#0A0A0A] ';
            if (!answered) {
              btnClass += 'border-[#0A0A0A] bg-white hover:bg-[#FFE500] hover:border-[#0A0A0A] cursor-pointer';
            } else if (i === q.correct) {
              btnClass += 'border-[#00E676] bg-[#00E676] text-[#0A0A0A]';
            } else if (i === selected && i !== q.correct) {
              btnClass += 'border-[#FF3B3B] bg-[#FF3B3B] text-white';
            } else {
              btnClass += 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed';
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={answered}
                className={btnClass}
              >
                <span className="inline-block w-6 h-6 border-[2px] border-current rounded-none mr-3 text-center text-xs leading-5 font-display">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Next button (shown after answering) */}
        {answered && (
          <button
            onClick={handleNext}
            className="w-full py-3 font-bold uppercase border-[3px] border-[#0A0A0A] text-[#0A0A0A] hover:text-white transition-colors"
            style={{ backgroundColor: accentColor }}
          >
            {currentIdx < total - 1 ? 'Next Question →' : 'See Result'}
          </button>
        )}
      </div>
    </div>
  );
}
