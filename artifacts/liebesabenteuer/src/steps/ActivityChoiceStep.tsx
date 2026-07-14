import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { setAnswer } from '@/lib/answers';

type Activity = { id: string; label: string; icon: string };

const ACTIVITIES: Activity[] = [
  { id: 'kino', label: 'Kino', icon: '🎬' },
  { id: 'therme', label: 'Ein Tag in der Therme', icon: '🧖' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'minigolf', label: 'Minigolf', icon: '⛳' },
  { id: 'picknick', label: 'Picknick', icon: '🧺' },
  { id: 'netflix', label: 'Netflix and Chill', icon: '📺' },
];

export function ActivityChoiceStep({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<Activity | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!selected) return;

    // Store the choice internally — never displayed, used later together
    // with the other collected answers.
    setAnswer('activityChoice', selected.label);

    const t1 = setTimeout(() => setShowMessage(true), 500);
    const t2 = setTimeout(onNext, 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div className="relative w-[92vw] sm:w-[85vw] md:w-auto md:min-w-[650px] md:max-w-[750px] max-w-[750px] left-1/2 -translate-x-1/2 bg-gradient-to-br from-[#1a0b2e] via-[#2b123f] to-[#08040c] p-10 md:p-16 rounded-[3rem] shadow-[0_0_80px_-10px_rgba(219,39,119,0.35)] border border-white/10 backdrop-blur-2xl overflow-hidden">
      {/* Cinematic depth lighting */}
      <div className="absolute top-[-25%] left-[-15%] w-[80%] h-[65%] rounded-full bg-primary/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-30%] right-[-20%] w-[80%] h-[70%] rounded-full bg-fuchsia-400/15 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[50%] rounded-full bg-pink-300/10 blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/25 z-0"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center space-y-10 relative z-10"
          >
            {/* Progress indicator */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="flex gap-2 text-2xl">
                {['full', 'full', 'empty', 'empty', 'empty'].map((state, i) => (
                  <motion.span
                    key={i}
                    animate={
                      state === 'full'
                        ? {
                            filter: [
                              'drop-shadow(0 0 2px rgba(244,114,182,0.5))',
                              'drop-shadow(0 0 10px rgba(244,114,182,0.95))',
                              'drop-shadow(0 0 2px rgba(244,114,182,0.5))',
                            ],
                          }
                        : {}
                    }
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
                  >
                    {state === 'full' ? '❤️' : '🤍'}
                  </motion.span>
                ))}
              </div>
              <p className="text-pink-200/70 text-xs tracking-[0.3em] uppercase font-medium">
                Kapitel 2 von 5
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif text-4xl md:text-5xl text-white font-semibold leading-tight tracking-tight drop-shadow-[0_2px_20px_rgba(244,114,182,0.25)]">
                ❤️ Wo möchtest du <br className="hidden sm:block" /> am liebsten hin? ❤️
              </h2>
              <p className="text-white/50 text-lg md:text-xl font-light leading-relaxed max-w-md mx-auto">
                Wähle einfach aus, worauf du am meisten Lust hast.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 md:gap-6 w-full">
              {ACTIVITIES.map((activity, idx) => (
                <motion.button
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 + 0.2 }}
                  whileHover={{ y: -6, scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelected(activity)}
                  className="group flex flex-col items-center justify-center gap-3 px-4 py-8 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:bg-white/[0.12] hover:border-pink-300/30 hover:shadow-[0_0_40px_-5px_rgba(244,114,182,0.5)] transition-all duration-500 ease-out"
                  data-testid={`button-activity-${activity.id}`}
                >
                  <span className="text-5xl drop-shadow-[0_0_18px_rgba(244,114,182,0.35)] transition-transform duration-500 group-hover:scale-110">
                    {activity.icon}
                  </span>
                  <span className="text-white/90 font-medium text-sm md:text-base tracking-wide">
                    {activity.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center space-y-6 relative z-10 py-8 min-h-[380px] justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: [0, 1.25, 1], rotate: 0 }}
              transition={{ type: 'spring', damping: 10, duration: 0.9 }}
              className="text-9xl drop-shadow-[0_0_40px_rgba(244,114,182,0.5)]"
            >
              {selected.icon}
            </motion.div>

            <h2 className="font-serif text-3xl md:text-4xl text-white font-semibold tracking-tight">
              {selected.label}
            </h2>

            <AnimatePresence>
              {showMessage && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="text-pink-200 font-medium text-xl"
                >
                  ✨ Super! Ich freue mich schon riesig darauf. ❤️
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
