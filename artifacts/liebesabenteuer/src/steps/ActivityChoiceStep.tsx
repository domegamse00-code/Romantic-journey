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
    <div className="relative bg-gradient-to-br from-[#1a0b2e] via-[#2b123f] to-[#0b0611] p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden">
      {/* Soft pink lighting */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[60%] rounded-full bg-primary/25 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-25%] right-[-15%] w-[70%] h-[60%] rounded-full bg-fuchsia-400/10 blur-[110px] pointer-events-none" />

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
            className="flex flex-col items-center text-center space-y-6 relative z-10"
          >
            {/* Progress indicator */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex gap-1 text-xl">
                {['full', 'full', 'empty', 'empty', 'empty'].map((state, i) => (
                  <motion.span
                    key={i}
                    animate={
                      state === 'full'
                        ? {
                            filter: [
                              'drop-shadow(0 0 2px rgba(244,114,182,0.5))',
                              'drop-shadow(0 0 8px rgba(244,114,182,0.9))',
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
              <p className="text-pink-200/70 text-xs tracking-[0.2em] uppercase font-medium">
                Kapitel 2 von 5
              </p>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl text-white font-medium leading-snug">
              ❤️ Wo möchtest du am liebsten hin? ❤️
            </h2>
            <p className="text-white/60 text-lg">
              Wähle einfach aus, worauf du am meisten Lust hast.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full mt-4">
              {ACTIVITIES.map((activity, idx) => (
                <motion.button
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 + 0.2 }}
                  onClick={() => setSelected(activity)}
                  className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-sm hover:bg-white/20 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300"
                  data-testid={`button-activity-${activity.id}`}
                >
                  <span className="text-4xl drop-shadow-sm">{activity.icon}</span>
                  <span className="text-white font-medium">{activity.label}</span>
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
            className="flex flex-col items-center text-center space-y-4 relative z-10 py-6 min-h-[320px] justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: [0, 1.25, 1], rotate: 0 }}
              transition={{ type: 'spring', damping: 10, duration: 0.9 }}
              className="text-8xl drop-shadow-xl"
            >
              {selected.icon}
            </motion.div>

            <h2 className="font-serif text-2xl md:text-3xl text-white font-medium">
              {selected.label}
            </h2>

            <AnimatePresence>
              {showMessage && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="text-pink-200 font-medium text-lg"
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
