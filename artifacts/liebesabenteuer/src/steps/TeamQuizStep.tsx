import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { setAnswer } from '@/lib/answers';

// Chapter 4 — hidden word "TEAM" revealed one letter per correct answer.
const HIDDEN_WORD = ['T', 'E', 'A', 'M'];

type Question = {
  question: string;
  options: { label: string; correct: boolean }[];
};

const QUESTIONS: Question[] = [
  {
    question: 'Wo sind wir das erste Mal gemeinsam in den Urlaub geflogen?',
    options: [
      { label: '🇵🇹 Madeira', correct: true },
      { label: '🇬🇷 Griechenland', correct: false },
      { label: '🇭🇷 Kroatien', correct: false },
    ],
  },
  {
    question: 'Welchen Künstler hört Dominic am meisten?',
    options: [
      { label: '🔥 Travis Scott', correct: true },
      { label: '🎤 Ariana Grande', correct: false },
      { label: '🎧 HeadB3ats', correct: false },
    ],
  },
  {
    question: 'Von welcher TV-Serie hat Dominic einen Teppich?',
    options: [
      { label: '🟢 Adventure Time', correct: true },
      { label: '🟡 Rick and Morty', correct: false },
      { label: '🔵 Stranger Things', correct: false },
    ],
  },
  {
    question: 'Was sind wir zusammen?',
    options: [
      { label: '❤️ Ein Team', correct: true },
      { label: '💕 Ein Paar', correct: false },
      { label: '🙋 Nicht allein', correct: false },
    ],
  },
];

const CONFETTI_COLORS = ['#f472b6', '#facc15', '#fb923c', '#f9a8d4', '#ffffff', '#c084fc'];

export function TeamQuizStep({ onNext }: { onNext: () => void }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong' | 'finished'>('idle');
  const [shake, setShake] = useState(false);

  const handleAnswer = (correct: boolean) => {
    if (status !== 'idle') return;

    if (correct) {
      const newRevealed = revealedCount + 1;
      setStatus('correct');
      setRevealedCount(newRevealed);

      if (newRevealed === HIDDEN_WORD.length) {
        setTimeout(() => {
          setAnswer('quizCompleted', true);
          setStatus('finished');
        }, 1000);
        setTimeout(onNext, 4000);
      } else {
        setTimeout(() => {
          setQuestionIndex(prev => prev + 1);
          setStatus('idle');
        }, 1000);
      }
    } else {
      setStatus('wrong');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => {
        setQuestionIndex(0);
        setRevealedCount(0);
        setStatus('idle');
      }, 1500);
    }
  };

  const currentQuestion = QUESTIONS[questionIndex];

  return (
    <motion.div
      animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
      transition={{ duration: 0.5 }}
      className="relative w-full rounded-[3rem] border border-white/20 bg-white/[0.08] backdrop-blur-2xl shadow-[0_0_90px_-10px_rgba(255,157,90,0.45)] p-8 md:p-12 overflow-hidden"
    >
      {/* Warm glassmorphism inner light */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-200/[0.08] via-transparent to-pink-300/[0.06] pointer-events-none" />
      <div className="absolute top-[-20%] right-[-15%] w-[60%] h-[50%] rounded-full bg-orange-300/20 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[-25%] left-[-15%] w-[65%] h-[55%] rounded-full bg-pink-300/15 blur-[120px] pointer-events-none" />

      <AnimatePresence>
        {status === 'wrong' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-500/15 z-20 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center text-center space-y-8">
        {/* Progress indicator */}
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex gap-2 text-2xl">
            {['full', 'full', 'full', 'full', 'empty'].map((state, i) => (
              <motion.span
                key={i}
                animate={
                  state === 'full'
                    ? {
                        filter: [
                          'drop-shadow(0 0 2px rgba(255,157,90,0.5))',
                          'drop-shadow(0 0 10px rgba(255,157,90,0.95))',
                          'drop-shadow(0 0 2px rgba(255,157,90,0.5))',
                        ],
                      }
                    : {}
                }
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
              >
                {state === 'full' ? '❤️' : '🤍'}
              </motion.span>
            ))}
          </div>
          <p className="text-orange-100/70 text-xs tracking-[0.3em] uppercase font-medium">
            Kapitel 4 von 5
          </p>
        </div>

        <h2 className="font-serif text-2xl md:text-4xl text-white font-semibold leading-tight tracking-tight drop-shadow-[0_2px_20px_rgba(255,157,90,0.35)]">
          🌴 Unsere gemeinsame Zeit als...
        </h2>

        {/* Hidden word */}
        <div className="flex gap-3 md:gap-4">
          {HIDDEN_WORD.map((letter, i) => (
            <div
              key={i}
              className="w-12 h-14 md:w-16 md:h-20 rounded-2xl border border-white/25 bg-white/[0.06] flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                {i < revealedCount ? (
                  <motion.span
                    key="revealed"
                    initial={{ scale: 0, opacity: 0, y: 10 }}
                    animate={{ scale: [0, 1.3, 1], opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'backOut' }}
                    className="font-serif text-3xl md:text-5xl font-bold text-white drop-shadow-[0_0_16px_rgba(250,204,21,0.85)]"
                  >
                    {letter}
                  </motion.span>
                ) : (
                  <motion.span key="hidden" className="text-2xl md:text-4xl text-white/25 font-serif">
                    _
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Question + answers, or finish screen */}
        <AnimatePresence mode="wait">
          {status === 'finished' ? (
            <motion.div
              key="finished"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col items-center space-y-4 py-6 relative"
            >
              <Confetti />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ type: 'spring', damping: 10, duration: 0.9 }}
                className="text-3xl md:text-4xl font-serif font-semibold text-white drop-shadow-[0_0_24px_rgba(250,204,21,0.7)]"
              >
                🎉 Super!
              </motion.div>
              <p className="text-white/85 text-lg md:text-xl font-light">Du hast es geschafft!</p>
              <p className="text-pink-100 text-lg md:text-xl font-medium">❤️ Wir sind ein Team. ❤️</p>
            </motion.div>
          ) : (
            <motion.div
              key={questionIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="w-full flex flex-col items-center space-y-6"
            >
              <p className="text-white/85 text-lg md:text-xl font-light max-w-md">
                {currentQuestion.question}
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 w-full">
                {currentQuestion.options.map((opt, i) => (
                  <motion.button
                    key={i}
                    type="button"
                    disabled={status !== 'idle'}
                    onClick={() => handleAnswer(opt.correct)}
                    whileHover={status === 'idle' ? { scale: 1.03 } : {}}
                    whileTap={status === 'idle' ? { scale: 0.96 } : {}}
                    className="px-6 py-3 rounded-full text-sm md:text-base font-medium border border-white/15 bg-white/[0.06] text-white/85 hover:bg-white/15 hover:text-white transition-colors duration-300 disabled:opacity-70"
                    data-testid={`button-quiz-option-${i}`}
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>

              <div className="h-8 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {status === 'correct' && (
                    <motion.p
                      key="correct"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-emerald-300 font-medium"
                    >
                      ✅ Richtig! 🎉
                    </motion.p>
                  )}
                  {status === 'wrong' && (
                    <motion.p
                      key="wrong"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-300 font-medium"
                    >
                      Oh nein... versuch's nochmal! ❤️
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: Math.random() * 8 + 5,
    delay: Math.random() * 0.6,
    duration: Math.random() * 1.5 + 2,
    rotate: Math.random() * 360,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          className="absolute top-[-10%] rounded-sm"
          style={{ left: `${p.left}%`, width: p.size, height: p.size * 0.4, backgroundColor: p.color }}
          initial={{ y: '-10%', opacity: 1, rotate: 0 }}
          animate={{ y: '250%', opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}
