import { useState, useEffect } from 'react';

interface Question {
  q: string;
  options: string[];
  correct: number;
}

interface ExamViewProps {
  questions: Question[];
  durationSeconds: number;
  accentColor: string;
  onComplete: (score: number) => void;
  onClose: () => void;
}

export function ExamView({ questions, durationSeconds, accentColor, onComplete, onClose }: ExamViewProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  const total = questions.length;
  const q = questions[currentIdx];
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeWarning = timeLeft <= 60;

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete(score);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    const nextScore = selected === q.correct ? score : score; // already updated in handleAnswer
    if (currentIdx < total - 1) {
      setCurrentIdx((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      onComplete(score + (selected === q.correct ? 0 : 0)); // score already tallied
    }
  };

  // When last question is answered, auto-complete on next click
  const isLast = currentIdx === total - 1;

  return (
    <div
      className="flex-1 flex items-center justify-center p-4 min-h-[calc(100vh-60px)]"
      style={{ backgroundColor: timeWarning ? '#FF3B3B' : '#0A0A0A' }}
    >
      <div className="bg-[#F2EDE4] border-[3px] border-[#0A0A0A] neubrutalism-box p-8 max-w-2xl w-full">
        {/* Exam Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b-[3px] border-[#0A0A0A]">
          <div>
            <span className="font-bold text-gray-500 uppercase text-sm">Exam — Question {currentIdx + 1}/{total}</span>
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
          <div className={`font-display text-4xl border-[3px] border-[#0A0A0A] px-4 py-1 ${timeWarning ? 'bg-[#FF3B3B] text-white' : 'bg-[#FFE500] text-[#0A0A0A]'}`}>
            {mins}:{secs.toString().padStart(2, '0')}
          </div>
        </div>

        {/* Question */}
        <h2 className="text-xl font-bold text-[#0A0A0A] mb-8 leading-snug">{q.q}</h2>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {q.options.map((opt, i) => {
            let btnClass = 'w-full p-4 border-[3px] text-left font-bold transition-all ';
            if (!answered) {
              btnClass += 'border-[#0A0A0A] bg-white text-[#0A0A0A] hover:bg-[#FFE500] cursor-pointer';
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

        {answered && (
          <button
            onClick={() => {
              if (isLast) {
                onComplete(score);
              } else {
                handleNext();
              }
            }}
            className="w-full py-3 font-bold uppercase border-[3px] border-[#0A0A0A] text-[#0A0A0A] hover:text-white transition-colors"
            style={{ backgroundColor: accentColor }}
          >
            {isLast ? 'Submit Exam' : 'Next Question →'}
          </button>
        )}

        <div className="mt-4 text-center">
          <button onClick={() => onClose()} className="text-sm text-gray-400 hover:text-[#FF3B3B] font-bold uppercase">
            Abandon Exam
          </button>
        </div>
      </div>
    </div>
  );
}
