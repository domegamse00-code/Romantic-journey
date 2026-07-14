import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { setAnswer, getAnswers } from '@/lib/answers';
import coupleIllustration from '@/assets/couple_illustration.png';

const HEART_COLORS = ['#f472b6', '#fb7185', '#facc15', '#f9a8d4', '#ffffff'];

export function FinalDateStep() {
  const [celebrating, setCelebrating] = useState(false);
  const [showSecondLine, setShowSecondLine] = useState(false);

  const handleSubmit = () => {
    if (celebrating) return;

    // Save every collected answer from the journey together with the
    // final confirmation — nothing is displayed, it is only kept in
    // memory to be exported later.
    setAnswer('dateAccepted', true);
    const all = getAnswers();
    setAnswer('foodChoice', all.foodChoice);
    setAnswer('activityChoice', all.activityChoice);
    setAnswer('selectedDate', all.selectedDate);
    setAnswer('selectedTime', all.selectedTime);
    setAnswer('quizCompleted', all.quizCompleted);

    setCelebrating(true);
    setTimeout(() => setShowSecondLine(true), 2000);
  };

  return (
    <div className="relative w-[92vw] sm:w-[85vw] md:w-auto md:min-w-[650px] md:max-w-[800px] max-w-[800px] left-1/2 -translate-x-1/2 rounded-[3rem] border border-white/20 bg-white/[0.09] backdrop-blur-2xl shadow-[0_0_120px_-10px_rgba(244,114,182,0.55)] p-8 md:p-14 overflow-hidden">
      {/* Premium glassmorphism inner light + pink glow edges */}
      <div className="absolute inset-0 rounded-[3rem] pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(244,114,182,0.15)' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-pink-300/[0.05] pointer-events-none" />
      <div className="absolute top-[-20%] right-[-15%] w-[60%] h-[50%] rounded-full bg-pink-300/20 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[-25%] left-[-15%] w-[65%] h-[55%] rounded-full bg-orange-200/15 blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!celebrating ? (
          <motion.div
            key="ask"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex flex-col items-center text-center space-y-7"
          >
            {/* Progress indicator */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="flex gap-2 text-2xl">
                {[0, 1, 2, 3, 4].map(i => (
                  <motion.span
                    key={i}
                    animate={{
                      filter: [
                        'drop-shadow(0 0 2px rgba(244,114,182,0.5))',
                        'drop-shadow(0 0 10px rgba(244,114,182,0.95))',
                        'drop-shadow(0 0 2px rgba(244,114,182,0.5))',
                      ],
                    }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
                  >
                    ❤️
                  </motion.span>
                ))}
              </div>
              <p className="text-pink-100/70 text-xs tracking-[0.3em] uppercase font-medium">
                Kapitel 5 von 5
              </p>
            </div>

            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative w-48 h-48 md:w-64 md:h-64"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-300/30 via-orange-200/20 to-purple-300/25 blur-2xl" />
              <img
                src={coupleIllustration}
                alt="Illustration eines umarmenden Paares"
                className="relative w-full h-full object-contain drop-shadow-[0_10px_40px_rgba(244,114,182,0.45)]"
              />
            </motion.div>

            <h2 className="font-serif text-3xl md:text-5xl text-white font-semibold leading-tight tracking-tight drop-shadow-[0_2px_20px_rgba(244,114,182,0.35)]">
              ❤️ Unser Date wartet... ❤️
            </h2>

            <p className="text-white/75 text-base md:text-xl font-light leading-relaxed max-w-lg">
              Ich würde mich riesig freuen,<br />
              wenn du mit mir auf dieses Date gehst.<br />
              Ich habe mir wirklich viel Mühe gegeben,<br />
              diese kleine Reise für dich zu erstellen.<br />
              Jetzt fehlt nur noch deine Bewerbung.
            </p>

            <motion.button
              type="button"
              onClick={handleSubmit}
              whileHover={{ scale: 1.045 }}
              whileTap={{ scale: 0.97 }}
              animate={{
                boxShadow: [
                  '0 0 25px rgba(244,114,182,0.45)',
                  '0 0 55px rgba(244,114,182,0.9)',
                  '0 0 25px rgba(244,114,182,0.45)',
                ],
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="px-10 py-4 md:py-5 rounded-full font-semibold text-base md:text-xl tracking-wide bg-gradient-to-r from-pink-400 via-fuchsia-400 to-orange-300 text-white cursor-pointer"
              data-testid="button-submit-application"
            >
              💌 Bewerbung zum Date absenden 💌
            </motion.button>

            <p className="text-white/45 text-xs md:text-sm font-light max-w-md leading-relaxed">
              Mit dem Absenden bestätigst du deine Bewerbung für das schönste Date des Jahres.
              <br />
              Eine Zusage wird mit ganz viel Liebe bearbeitet. ❤️
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="celebration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-col items-center justify-center text-center min-h-[380px] py-10 space-y-6"
          >
            <CelebrationHearts />

            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: 1,
                textShadow: [
                  '0 0 12px rgba(244,114,182,0.5)',
                  '0 0 35px rgba(244,114,182,0.95)',
                  '0 0 12px rgba(244,114,182,0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative font-serif text-2xl md:text-4xl text-white font-semibold leading-relaxed max-w-md z-10"
            >
              ❤️<br />
              Ich freue mich sehr auf dich.<br />
              ❤️
            </motion.h2>

            <AnimatePresence>
              {showSecondLine && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative text-pink-100 text-lg md:text-2xl font-light z-10"
                >
                  Bis ganz bald... ❤️
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CelebrationHearts() {
  const [hearts] = useState(() =>
    Array.from({ length: 220 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 34 + 8,
      delay: Math.random() * 4,
      duration: Math.random() * 10 + 6,
      opacity: Math.random() * 0.5 + 0.25,
      color: HEART_COLORS[i % HEART_COLORS.length],
      blur: Math.random() > 0.6 ? Math.random() * 2.5 : 0,
      sparkle: Math.random() > 0.7,
      rotateSlow: Math.random() > 0.5,
    })),
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map(h => (
        <motion.div
          key={h.id}
          className="absolute bottom-[-60px]"
          style={{
            left: `${h.left}%`,
            width: h.size,
            height: h.size,
            color: h.color,
            opacity: h.opacity,
            filter: `drop-shadow(0 0 ${h.sparkle ? 10 : 4}px ${h.color}) blur(${h.blur}px)`,
          }}
          initial={{ y: 0 }}
          animate={{
            y: ['0vh', '-115vh'],
            x: ['0px', '20px', '-20px', '0px'],
            rotate: h.rotateSlow ? [0, 180, 360] : [0, 0],
            scale: h.sparkle ? [1, 1.25, 1] : 1,
          }}
          transition={{
            y: { duration: h.duration, repeat: Infinity, ease: 'linear', delay: h.delay },
            x: { duration: h.duration / 2, repeat: Infinity, ease: 'easeInOut', delay: h.delay, repeatType: 'mirror' },
            rotate: { duration: h.duration * 1.4, repeat: Infinity, ease: 'linear', delay: h.delay },
            scale: { duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: h.delay },
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
