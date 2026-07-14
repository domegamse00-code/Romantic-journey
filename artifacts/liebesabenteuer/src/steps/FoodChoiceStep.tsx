import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { setAnswer } from '@/lib/answers';

type Food = { id: string; label: string; icon: string };

const FOODS: Food[] = [
  { id: 'burger', label: 'Burger', icon: '🍔' },
  { id: 'pizza', label: 'Pizza', icon: '🍕' },
  { id: 'steak', label: 'Steak', icon: '🥩' },
  { id: 'chinesisch', label: 'Chinesisch', icon: '🥡' },
  { id: 'japanisch', label: 'Japanisch', icon: '🍣' },
  { id: 'ueberraschung', label: 'Überraschung', icon: '🎁' },
];

export function FoodChoiceStep({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<Food | null>(null);
  const [revealStage, setRevealStage] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    if (!selected) return;

    // Store the choice internally — never displayed, used later together
    // with the other collected answers.
    setAnswer('foodChoice', selected.label);

    if (selected.id === 'ueberraschung') {
      const t = setTimeout(onNext, 2200);
      return () => clearTimeout(t);
    }

    const t1 = setTimeout(() => setRevealStage(1), 500);
    const t2 = setTimeout(() => setRevealStage(2), 1500);
    const t3 = setTimeout(onNext, 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div className="relative bg-white/40 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-white/60 overflow-hidden">
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/15 z-0"
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
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-medium leading-snug">
              🍴 Wo möchtest du mit mir essen gehen? ❤️
            </h2>
            <p className="text-muted-foreground text-lg">
              Such dir einfach aus, worauf du heute am meisten Lust hast.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full mt-4">
              {FOODS.map((food, idx) => (
                <motion.button
                  key={food.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 + 0.2 }}
                  onClick={() => setSelected(food)}
                  className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-2xl bg-white/60 border border-white/40 shadow-sm hover:bg-white hover:shadow-lg hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300"
                  data-testid={`button-food-${food.id}`}
                >
                  <span className="text-4xl drop-shadow-sm">{food.icon}</span>
                  <span className="text-foreground font-medium">{food.label}</span>
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
            className="flex flex-col items-center text-center space-y-4 relative z-10 py-6 min-h-[280px] justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: [0, 1.25, 1], rotate: 0 }}
              transition={{ type: 'spring', damping: 10, duration: 0.9 }}
              className="text-8xl drop-shadow-xl"
            >
              {selected.icon}
            </motion.div>

            {selected.id === 'ueberraschung' ? (
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-serif text-2xl md:text-3xl text-foreground font-medium max-w-xs mx-auto"
              >
                Hab ich mir schon fast gedacht. 😄❤️
              </motion.h2>
            ) : (
              <>
                <h2 className="font-serif text-2xl md:text-3xl text-foreground font-medium">
                  {selected.label}
                </h2>
                <AnimatePresence mode="wait">
                  {revealStage === 1 && (
                    <motion.p
                      key="first"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.4 }}
                      className="text-primary font-medium text-lg"
                    >
                      ✨ Eine ausgezeichnete Wahl! 😍
                    </motion.p>
                  )}
                  {revealStage === 2 && (
                    <motion.p
                      key="second"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.4 }}
                      className="text-foreground/70 text-base leading-relaxed"
                    >
                      Mmmm... lecker! <br />
                      Ich freue mich schon.
                    </motion.p>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
