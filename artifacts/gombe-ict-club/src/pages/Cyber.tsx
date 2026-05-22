import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { CYBER_TRACKS, CYBER_QUIZ_QUESTIONS, CYBER_EXAM_QUESTIONS, CYBER_LESSON_NOTES } from '@/lib/bootcamp-data';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { QuizView } from '@/components/QuizView';
import { ExamView } from '@/components/ExamView';

// ── Lesson Notes Modal ────────────────────────────────────────────────────────
function LessonNotesModal({ notes, onStartQuiz, onClose }: {
  notes: { title: string; content: string[] };
  onStartQuiz: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#030d03] border-[3px] border-[#00E676] w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b-[3px] border-[#00E676]/30">
          <h2 className="font-display text-2xl text-[#00E676]">📚 LESSON NOTES</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white font-bold text-xl">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <h3 className="font-bold text-white text-xl">{notes.title}</h3>
          <div className="space-y-3">
            {notes.content.map((point, i) => (
              <div key={i} className="flex gap-3 bg-[#0A1A0A] border border-[#00E676]/20 p-4 rounded">
                <p className="text-gray-200 text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#00E676]/10 border-[2px] border-[#00E676] p-4 mt-4">
            <p className="text-[#00E676] font-bold text-sm">🔐 Study these notes carefully — the quiz questions come directly from this content!</p>
          </div>
        </div>
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 font-bold uppercase border-[3px] border-gray-600 text-gray-400 hover:border-white hover:text-white transition-all"
          >
            Close
          </button>
          <button
            onClick={onStartQuiz}
            className="flex-1 py-3 font-bold uppercase border-[3px] bg-[#00E676] text-[#0A0A0A] border-[#00E676] hover:bg-white transition-all"
          >
            Start Quiz →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Cyber Page ────────────────────────────────────────────────────────────
export default function Cyber() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [progress, setProgress] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [activeLesson, setActiveLesson] = useState<{ trackId: string; lessonId: number } | null>(null);
  const [activeExam, setActiveExam] = useState<{ trackId: string } | null>(null);
  const [pendingLesson, setPendingLesson] = useState<{ trackId: string; lessonId: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) { setLoading(false); return; }
      try {
        const [progRes, scoresRes, boardRes] = await Promise.all([
          supabase.from('cyber_progress').select('*').eq('user_id', user.id),
          supabase.from('cyber_exam_scores').select('*').eq('user_id', user.id),
          supabase.from('cyber_exam_scores').select('*, profiles(full_name, email)').order('score', { ascending: false }).limit(10),
        ]);
        if (progRes.data) setProgress(progRes.data);
        if (scoresRes.data) setScores(scoresRes.data);
        if (boardRes.data) setLeaderboard(boardRes.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    loadData();
  }, [user]);

  const isLessonComplete = (trackId: string, lessonId: number) =>
    progress.some((p) => p.track_id === trackId && p.lesson_idx === lessonId);
  const isTrackComplete = (trackId: string) =>
    progress.filter((p) => p.track_id === trackId).length >= 5;
  const getExamScore = (trackId: string) =>
    scores.find((s) => s.track_id === trackId)?.score;
  const isTrackUnlocked = (idx: number) => {
    if (idx === 0) return true;
    return getExamScore(CYBER_TRACKS[idx - 1].id) !== undefined;
  };

  const handleLessonComplete = async (trackId: string, lessonId: number) => {
    if (!user) return;
    try {
      await supabase.from('cyber_progress').insert([{ user_id: user.id, track_id: trackId, lesson_idx: lessonId, completed_at: new Date().toISOString() }]);
      setProgress([...progress, { track_id: trackId, lesson_idx: lessonId }]);
      setActiveLesson(null);
      toast({ title: 'Lesson Complete!', description: 'Stay sharp!' });
    } catch (e) { console.error(e); }
  };

  const handleExamComplete = async (trackId: string, score: number) => {
    if (!user) return;
    try {
      const grade = score >= 8 ? 'A' : score >= 6 ? 'B' : score >= 4 ? 'C' : 'F';
      await supabase.from('cyber_exam_scores').insert([{ user_id: user.id, track_id: trackId, score, grade, taken_at: new Date().toISOString() }]);
      setScores([...scores, { track_id: trackId, score, grade }]);
      setActiveExam(null);
      toast({ title: 'Exam Complete!', description: `You scored ${score}/10 — Grade ${grade}` });
    } catch (e) { console.error(e); }
  };

  // Notes → Quiz flow
  if (pendingLesson) {
    const noteKey = `${pendingLesson.trackId}_${pendingLesson.lessonId}`;
    const notes = CYBER_LESSON_NOTES[noteKey];
    if (notes) {
      return (
        <LessonNotesModal
          notes={notes}
          onStartQuiz={() => { setActiveLesson(pendingLesson); setPendingLesson(null); }}
          onClose={() => setPendingLesson(null)}
        />
      );
    }
    setActiveLesson(pendingLesson);
    setPendingLesson(null);
  }

  if (activeLesson) {
    const qKey = `${activeLesson.trackId}_${activeLesson.lessonId}`;
    const questions = CYBER_QUIZ_QUESTIONS[qKey] || CYBER_QUIZ_QUESTIONS['recon_1'];
    return (
      <QuizView
        questions={questions}
        passMark={3}
        bgColor="#030d03"
        accentColor="#00E676"
        onComplete={() => handleLessonComplete(activeLesson.trackId, activeLesson.lessonId)}
        onClose={() => setActiveLesson(null)}
      />
    );
  }

  if (activeExam) {
    const questions = CYBER_EXAM_QUESTIONS[activeExam.trackId] || CYBER_EXAM_QUESTIONS['recon'];
    return (
      <ExamView
        questions={questions}
        durationSeconds={600}
        accentColor="#00E676"
        onComplete={(score) => handleExamComplete(activeExam.trackId, score)}
        onClose={() => setActiveExam(null)}
      />
    );
  }

  return (
    <div className="flex-1 bg-[#030d03] text-white min-h-[calc(100vh-60px)] p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h1 className="font-display text-6xl md:text-8xl text-[#00E676] drop-shadow-[4px_4px_0_#0A0A0A]">CYBERSECURITY</h1>
            <p className="text-xl text-gray-300 font-bold max-w-2xl mt-4">From recon to CTF. Learn to hack ethically and defend systems.</p>
          </div>
          {!user && (
            <div className="mt-6 md:mt-0 bg-[#0A0A0A] p-4 border-[3px] border-[#00E676]">
              <p className="mb-4 font-bold">Sign in to track your progress.</p>
              <Link href="/auth" className="bg-[#00E676] text-[#0A0A0A] px-4 py-2 font-bold uppercase block text-center border-[2px] border-[#0A0A0A]">Sign In</Link>
            </div>
          )}
        </div>

        <div className="space-y-16">
          {CYBER_TRACKS.map((track, idx) => {
            const unlocked = isTrackUnlocked(idx);
            const allLessonsDone = isTrackComplete(track.id);
            const examScore = getExamScore(track.id);
            const themeColor = track.theme === 'green' ? '#00E676' : track.theme === 'yellow' ? '#FFE500' : '#FF3B3B';

            return (
              <div key={track.id} className={`relative ${!unlocked ? 'opacity-40 pointer-events-none' : ''}`}>
                {!unlocked && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="bg-[#FFE500] text-[#0A0A0A] px-6 py-3 font-display text-2xl border-[3px] border-[#0A0A0A]">
                      LOCKED — PASS PREVIOUS EXAM
                    </div>
                  </div>
                )}
                <h2 className="font-display text-4xl mb-6" style={{ color: themeColor }}>
                  TRACK 0{idx + 1}: {track.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {track.lessons.map((lesson, lIdx) => {
                    const isDone = isLessonComplete(track.id, lesson.id);
                    const isAvailable = lIdx === 0 || isLessonComplete(track.id, track.lessons[lIdx - 1].id);
                    const noteKey = `${track.id}_${lesson.id}`;
                    const hasNotes = !!CYBER_LESSON_NOTES[noteKey];
                    return (
                      <div key={lesson.id} className={`bg-[#0A1A0A] p-6 border-[3px] flex flex-col ${isDone ? 'border-gray-600' : isAvailable ? 'border-[#00E676]' : 'border-gray-800'}`}>
                        <div className="flex justify-between items-start mb-4">
                          <span className="font-display text-2xl text-gray-400">0{lesson.id}</span>
                          <div className="flex gap-2 items-center">
                            {isDone && <span className="bg-[#00E676] text-[#0A0A0A] px-2 py-1 text-xs font-bold uppercase">Done</span>}
                            {hasNotes && isAvailable && !isDone && (
                              <span className="bg-[#00E676]/20 text-[#00E676] px-2 py-1 text-xs font-bold uppercase border border-[#00E676]">📚 Notes</span>
                            )}
                          </div>
                        </div>
                        <h3 className="font-bold text-xl mb-2 flex-1 text-white">{lesson.title}</h3>
                        <p className="text-gray-400 text-sm mb-6">{lesson.desc}</p>
                        <button
                          disabled={!isAvailable || isDone || !user}
                          onClick={() => setPendingLesson({ trackId: track.id, lessonId: lesson.id })}
                          className={`w-full py-3 font-bold uppercase border-[3px] transition-all ${isDone ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed' : isAvailable && user ? 'bg-[#00E676] text-[#0A0A0A] border-[#00E676] hover:bg-white' : 'bg-gray-800 text-gray-600 border-gray-700 cursor-not-allowed'}`}
                        >
                          {isDone ? '✓ Completed' : isAvailable ? '📖 Study & Quiz' : 'Locked'}
                        </button>
                      </div>
                    );
                  })}

                  {/* Exam Card */}
                  <div className={`bg-[#0A1A0A] p-6 border-[3px] flex flex-col ${examScore !== undefined ? 'border-gray-600' : allLessonsDone ? 'border-[#FFE500]' : 'border-gray-800'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-display text-2xl text-[#FFE500]">FINAL EXAM</span>
                      {examScore !== undefined && <span className="bg-[#00E676] text-[#0A0A0A] px-2 py-1 text-xs font-bold uppercase">Score: {examScore}/10</span>}
                    </div>
                    <h3 className="font-bold text-xl mb-2 flex-1 text-white">Track Certification</h3>
                    <p className="text-gray-400 text-sm mb-6">10 questions. 10 minutes. Pass to unlock next track.</p>
                    <button
                      disabled={!allLessonsDone || !user || examScore !== undefined}
                      onClick={() => setActiveExam({ trackId: track.id })}
                      className={`w-full py-3 font-bold uppercase border-[3px] transition-all ${examScore !== undefined ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed' : allLessonsDone && user ? 'bg-[#00E676] text-[#0A0A0A] border-[#00E676] hover:bg-[#FFE500] hover:border-[#FFE500]' : 'bg-gray-800 text-gray-600 border-gray-700 cursor-not-allowed'}`}
                    >
                      {examScore !== undefined ? `✓ Passed — ${examScore}/10` : allLessonsDone ? 'Take Exam' : 'Finish Lessons First'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Leaderboard */}
        <div className="mt-24">
          <h2 className="font-display text-5xl text-white mb-8 border-b-[3px] border-gray-800 pb-4">TOP HACKERS</h2>
          <div className="bg-[#0A1A0A] border-[3px] border-gray-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#0d1a0d] border-b-[3px] border-gray-800">
                <tr>
                  <th className="p-4 font-display text-xl text-white">Rank</th>
                  <th className="p-4 font-display text-xl text-white">Hacker</th>
                  <th className="p-4 font-display text-xl text-right text-white">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length === 0 ? (
                  <tr><td colSpan={3} className="p-8 text-center text-gray-500 font-bold">No exams taken yet. Be the first!</td></tr>
                ) : leaderboard.map((row, i) => (
                  <tr key={row.id} className="border-b border-gray-800 last:border-0">
                    <td className="p-4 font-bold text-[#00E676]">#{i + 1}</td>
                    <td className="p-4 font-bold text-white">{row.profiles?.full_name || row.profiles?.email || 'Unknown'}</td>
                    <td className="p-4 font-bold text-right text-[#FFE500]">{row.score}/10</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
