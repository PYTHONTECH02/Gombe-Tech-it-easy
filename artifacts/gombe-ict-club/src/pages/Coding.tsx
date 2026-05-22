import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { CODING_TRACKS, CODING_QUIZ_QUESTIONS, CODING_EXAM_QUESTIONS, CODING_LESSON_NOTES } from '@/lib/bootcamp-data';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { QuizView } from '@/components/QuizView';
import { ExamView } from '@/components/ExamView';

// ── Code Editor Component ─────────────────────────────────────────────────────
function CodeEditor({ onClose }: { onClose: () => void }) {
  const [lang, setLang] = useState<'html' | 'js' | 'python'>('html');
  const [code, setCode] = useState(`<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
  <style>
    body { font-family: Arial; background: #f0f0f0; padding: 20px; }
    h1 { color: #2563FF; }
    button { background: #FFE500; border: none; padding: 10px 20px; font-weight: bold; cursor: pointer; }
  </style>
</head>
<body>
  <h1>Hello, Gombe ICT Club!</h1>
  <p>Edit this code and click Run ▶</p>
  <button onclick="alert('You clicked me!')">Click Me</button>
</body>
</html>`);
  const [output, setOutput] = useState('');
  const [pyOutput, setPyOutput] = useState('');
  const [running, setRunning] = useState(false);

  const STARTER: Record<string, string> = {
    html: `<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n  <style>\n    body { font-family: Arial; background: #f0f0f0; padding: 20px; }\n    h1 { color: #2563FF; }\n    button { background: #FFE500; border: none; padding: 10px 20px; font-weight: bold; cursor: pointer; }\n  </style>\n</head>\n<body>\n  <h1>Hello, Gombe ICT Club!</h1>\n  <p>Edit this code and click Run ▶</p>\n  <button onclick="alert('You clicked me!')">Click Me</button>\n</body>\n</html>`,
    js: `// JavaScript Playground\n// Write code below and click Run ▶\n\nconst name = "Gombe Coder";\nconsole.log("Welcome, " + name + "!");\n\n// Try a loop:\nfor (let i = 1; i <= 5; i++) {\n  console.log("Count: " + i);\n}\n\n// Try a function:\nfunction add(a, b) {\n  return a + b;\n}\nconsole.log("3 + 4 =", add(3, 4));`,
    python: `# Python Playground\n# Write code below and click Run ▶\n\nname = "Gombe Coder"\nprint("Welcome,", name)\n\n# Try a loop:\nfor i in range(1, 6):\n    print("Count:", i)\n\n# Try a function:\ndef add(a, b):\n    return a + b\n\nprint("3 + 4 =", add(3, 4))`,
  };

  const handleLangChange = (l: 'html' | 'js' | 'python') => {
    setLang(l);
    setCode(STARTER[l]);
    setOutput('');
    setPyOutput('');
  };

  const runCode = async () => {
    if (lang === 'html') {
      setOutput(code);
    } else if (lang === 'js') {
      const logs: string[] = [];
      const fakeConsole = { log: (...args: any[]) => logs.push(args.map(String).join(' ')) };
      try {
        // eslint-disable-next-line no-new-func
        new Function('console', code)(fakeConsole);
        setPyOutput(logs.join('\n') || '(no output)');
      } catch (e: any) {
        setPyOutput('❌ Error: ' + e.message);
      }
      setOutput('');
    } else {
      // Python — use Pyodide via CDN or show simulated output
      setRunning(true);
      setPyOutput('');
      // We use a basic Python interpreter via Skulpt
      try {
        const Sk = (window as any).Sk;
        if (!Sk) throw new Error('Python engine loading...');
        let out = '';
        Sk.configure({ output: (t: string) => { out += t; } });
        await Sk.misceval.asyncToPromise(() =>
          Sk.importMainWithBody('<stdin>', false, code, true)
        );
        setPyOutput(out || '(no output)');
      } catch (e: any) {
        if (e.message?.includes('loading')) {
          setPyOutput('⏳ Loading Python engine (first run takes ~3s)…');
          // Dynamically load Skulpt
          await new Promise<void>((resolve) => {
            const s1 = document.createElement('script');
            s1.src = 'https://skulpt.org/js/skulpt.min.js';
            s1.onload = () => {
              const s2 = document.createElement('script');
              s2.src = 'https://skulpt.org/js/skulpt-stdlib.js';
              s2.onload = () => resolve();
              document.head.appendChild(s2);
            };
            document.head.appendChild(s1);
          });
          try {
            const Sk2 = (window as any).Sk;
            let out = '';
            Sk2.configure({ output: (t: string) => { out += t; } });
            await Sk2.misceval.asyncToPromise(() =>
              Sk2.importMainWithBody('<stdin>', false, code, true)
            );
            setPyOutput(out || '(no output)');
          } catch (e2: any) {
            setPyOutput('❌ Error: ' + (e2.tp$str ? e2.tp$str().v : e2.message));
          }
        } else {
          setPyOutput('❌ Error: ' + (e.tp$str ? e.tp$str().v : e.message));
        }
      }
      setRunning(false);
      setOutput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#0A0A0A] border-[3px] border-[#2563FF] w-full max-w-5xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-[3px] border-gray-800">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl text-[#2563FF]">CODE EDITOR</span>
            <span className="text-xs text-gray-400 font-bold uppercase">— Write & Run Real Code</span>
          </div>
          <div className="flex items-center gap-3">
            {(['html', 'js', 'python'] as const).map(l => (
              <button
                key={l}
                onClick={() => handleLangChange(l)}
                className={`px-4 py-1.5 font-bold uppercase text-sm border-[2px] transition-all ${lang === l ? 'bg-[#2563FF] text-white border-[#2563FF]' : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-400'}`}
              >
                {l === 'html' ? 'HTML/CSS' : l === 'js' ? 'JavaScript' : 'Python'}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white font-bold text-xl px-2">✕</button>
        </div>

        {/* Editor + Output */}
        <div className="flex flex-1 overflow-hidden">
          {/* Editor */}
          <div className="flex flex-col flex-1 border-r-[3px] border-gray-800">
            <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-gray-800">
              <span className="text-xs font-bold text-gray-500 uppercase">
                {lang === 'html' ? 'index.html' : lang === 'js' ? 'script.js' : 'main.py'}
              </span>
              <button
                onClick={runCode}
                disabled={running}
                className="bg-[#00E676] text-[#0A0A0A] px-5 py-1.5 font-bold uppercase text-sm border-[2px] border-[#00E676] hover:bg-white transition-all disabled:opacity-50"
              >
                {running ? '⏳ Running…' : '▶ Run'}
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-[#060610] text-[#00E676] font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed"
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>

          {/* Output */}
          <div className="flex flex-col w-[45%]">
            <div className="px-4 py-2 bg-[#111] border-b border-gray-800">
              <span className="text-xs font-bold text-gray-500 uppercase">Output</span>
            </div>
            {lang === 'html' && output ? (
              <iframe
                srcDoc={output}
                className="flex-1 bg-white"
                sandbox="allow-scripts allow-same-origin"
                title="HTML Output"
              />
            ) : (
              <div className="flex-1 bg-[#060610] p-4 overflow-auto">
                <pre className={`font-mono text-sm whitespace-pre-wrap ${pyOutput.startsWith('❌') ? 'text-[#FF3B3B]' : pyOutput.startsWith('⏳') ? 'text-[#FFE500]' : 'text-[#00E676]'}`}>
                  {pyOutput || <span className="text-gray-600">Click ▶ Run to see output here…</span>}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer tips */}
        <div className="px-4 py-2 border-t-[2px] border-gray-800 bg-[#0A0A0A]">
          <p className="text-xs text-gray-500 font-bold">
            💡 HTML/CSS → renders in browser preview  |  JavaScript → console.log() shows here  |  Python → print() shows here
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Lesson Notes Modal ────────────────────────────────────────────────────────
function LessonNotesModal({ notes, onStartQuiz, onClose }: {
  notes: { title: string; content: string[] };
  onStartQuiz: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#0A0A0A] border-[3px] border-[#2563FF] w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b-[3px] border-gray-800">
          <h2 className="font-display text-2xl text-[#2563FF]">📚 LESSON NOTES</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white font-bold text-xl">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <h3 className="font-bold text-white text-xl">{notes.title}</h3>
          <div className="space-y-3">
            {notes.content.map((point, i) => (
              <div key={i} className="flex gap-3 bg-[#111] border border-gray-800 p-4 rounded">
                <p className="text-gray-200 text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#2563FF]/10 border-[2px] border-[#2563FF] p-4 mt-4">
            <p className="text-[#2563FF] font-bold text-sm">✅ Read all notes carefully before attempting the quiz!</p>
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
            className="flex-1 py-3 font-bold uppercase border-[3px] bg-[#FFE500] text-[#0A0A0A] border-[#FFE500] hover:bg-white transition-all"
          >
            Start Quiz →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Coding Page ──────────────────────────────────────────────────────────
export default function Coding() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [progress, setProgress] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [activeLesson, setActiveLesson] = useState<{ trackId: string; lessonId: number } | null>(null);
  const [activeExam, setActiveExam] = useState<{ trackId: string } | null>(null);
  const [pendingLesson, setPendingLesson] = useState<{ trackId: string; lessonId: number } | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) { setLoading(false); return; }
      try {
        const [progRes, scoresRes, boardRes] = await Promise.all([
          supabase.from('coding_progress').select('*').eq('user_id', user.id),
          supabase.from('coding_exam_scores').select('*').eq('user_id', user.id),
          supabase.from('coding_exam_scores').select('*, profiles(full_name, email)').order('score', { ascending: false }).limit(10),
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
    return getExamScore(CODING_TRACKS[idx - 1].id) !== undefined;
  };

  const handleLessonComplete = async (trackId: string, lessonId: number) => {
    if (!user) return;
    try {
      await supabase.from('coding_progress').insert([{ user_id: user.id, track_id: trackId, lesson_idx: lessonId, completed_at: new Date().toISOString() }]);
      setProgress([...progress, { track_id: trackId, lesson_idx: lessonId }]);
      setActiveLesson(null);
      toast({ title: 'Lesson Complete!', description: 'Keep coding!' });
    } catch (e) { console.error(e); }
  };

  const handleExamComplete = async (trackId: string, score: number) => {
    if (!user) return;
    try {
      const grade = score >= 8 ? 'A' : score >= 6 ? 'B' : score >= 4 ? 'C' : 'F';
      await supabase.from('coding_exam_scores').insert([{ user_id: user.id, track_id: trackId, score, grade, taken_at: new Date().toISOString() }]);
      setScores([...scores, { track_id: trackId, score, grade }]);
      setActiveExam(null);
      toast({ title: 'Exam Complete!', description: `You scored ${score}/10 — Grade ${grade}` });
    } catch (e) { console.error(e); }
  };

  // Notes → Quiz flow
  if (pendingLesson) {
    const noteKey = `${pendingLesson.trackId}_${pendingLesson.lessonId}`;
    const notes = CODING_LESSON_NOTES[noteKey];
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
    const questions = CODING_QUIZ_QUESTIONS[qKey] || CODING_QUIZ_QUESTIONS['beginner_1'];
    return (
      <QuizView
        questions={questions}
        passMark={3}
        bgColor="#030312"
        accentColor="#2563FF"
        onComplete={() => handleLessonComplete(activeLesson.trackId, activeLesson.lessonId)}
        onClose={() => setActiveLesson(null)}
      />
    );
  }

  if (activeExam) {
    const questions = CODING_EXAM_QUESTIONS[activeExam.trackId] || CODING_EXAM_QUESTIONS['beginner'];
    return (
      <ExamView
        questions={questions}
        durationSeconds={600}
        accentColor="#2563FF"
        onComplete={(score) => handleExamComplete(activeExam.trackId, score)}
        onClose={() => setActiveExam(null)}
      />
    );
  }

  return (
    <div className="flex-1 bg-[#030312] text-white min-h-[calc(100vh-60px)] p-6 md:p-12 font-sans">
      {showEditor && <CodeEditor onClose={() => setShowEditor(false)} />}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h1 className="font-display text-6xl md:text-8xl text-[#2563FF] drop-shadow-[4px_4px_0_#0A0A0A]">SOFTWARE ENG</h1>
            <p className="text-xl text-gray-300 font-bold max-w-2xl mt-4">Master web development from HTML to React. Build, deploy, and conquer.</p>
          </div>
          <div className="mt-6 md:mt-0 flex flex-col gap-3">
            <button
              onClick={() => setShowEditor(true)}
              className="bg-[#00E676] text-[#0A0A0A] px-6 py-3 font-bold uppercase border-[3px] border-[#00E676] hover:bg-white transition-all flex items-center gap-2 text-lg"
            >
              ⌨️ Open Code Editor
            </button>
            {!user && (
              <div className="bg-[#0A0A0A] p-4 border-[3px] border-[#2563FF]">
                <p className="mb-3 font-bold text-sm">Sign in to track your progress.</p>
                <Link href="/auth" className="bg-[#2563FF] text-white px-4 py-2 font-bold uppercase block text-center border-[2px] border-[#0A0A0A]">Sign In</Link>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-16">
          {CODING_TRACKS.map((track, idx) => {
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
                    const hasNotes = !!CODING_LESSON_NOTES[noteKey];
                    return (
                      <div key={lesson.id} className={`bg-[#0A0A0A] p-6 border-[3px] flex flex-col ${isDone ? 'border-gray-600' : isAvailable ? 'border-[#2563FF]' : 'border-gray-800'}`}>
                        <div className="flex justify-between items-start mb-4">
                          <span className="font-display text-2xl text-gray-400">0{lesson.id}</span>
                          <div className="flex gap-2 items-center">
                            {isDone && <span className="bg-[#2563FF] text-white px-2 py-1 text-xs font-bold uppercase">Done</span>}
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
                          className={`w-full py-3 font-bold uppercase border-[3px] transition-all ${isDone ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed' : isAvailable && user ? 'bg-[#FFE500] text-[#0A0A0A] border-[#FFE500] hover:bg-white hover:border-white' : 'bg-gray-800 text-gray-600 border-gray-700 cursor-not-allowed'}`}
                        >
                          {isDone ? '✓ Completed' : isAvailable ? '📖 Study & Quiz' : 'Locked'}
                        </button>
                      </div>
                    );
                  })}

                  {/* Exam Card */}
                  <div className={`bg-[#0A0A0A] p-6 border-[3px] flex flex-col ${examScore !== undefined ? 'border-gray-600' : allLessonsDone ? 'border-[#FFE500]' : 'border-gray-800'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-display text-2xl text-[#FFE500]">FINAL EXAM</span>
                      {examScore !== undefined && <span className="bg-[#2563FF] text-white px-2 py-1 text-xs font-bold uppercase">Score: {examScore}/10</span>}
                    </div>
                    <h3 className="font-bold text-xl mb-2 flex-1 text-white">Track Certification</h3>
                    <p className="text-gray-400 text-sm mb-6">10 questions. 10 minutes. Pass to unlock next track.</p>
                    <button
                      disabled={!allLessonsDone || !user || examScore !== undefined}
                      onClick={() => setActiveExam({ trackId: track.id })}
                      className={`w-full py-3 font-bold uppercase border-[3px] transition-all ${examScore !== undefined ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed' : allLessonsDone && user ? 'bg-[#2563FF] text-white border-[#2563FF] hover:bg-[#FFE500] hover:text-[#0A0A0A] hover:border-[#FFE500]' : 'bg-gray-800 text-gray-600 border-gray-700 cursor-not-allowed'}`}
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
          <h2 className="font-display text-5xl text-white mb-8 border-b-[3px] border-gray-800 pb-4">TOP DEVELOPERS</h2>
          <div className="bg-[#0A0A0A] border-[3px] border-gray-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-900 border-b-[3px] border-gray-800">
                <tr>
                  <th className="p-4 font-display text-xl text-white">Rank</th>
                  <th className="p-4 font-display text-xl text-white">Developer</th>
                  <th className="p-4 font-display text-xl text-right text-white">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length === 0 ? (
                  <tr><td colSpan={3} className="p-8 text-center text-gray-500 font-bold">No exams taken yet. Be the first!</td></tr>
                ) : leaderboard.map((row, i) => (
                  <tr key={row.id} className="border-b border-gray-800 last:border-0">
                    <td className="p-4 font-bold text-[#2563FF]">#{i + 1}</td>
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
