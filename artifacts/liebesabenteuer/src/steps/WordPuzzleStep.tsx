import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function WordPuzzleStep({ onNext }: { onNext: () => void }) {
  const targetWords = ["Du", "bist", "mein", "Lieblingsmensch."];
  const [shuffled, setShuffled] = useState<{ id: number; word: string }[]>([]);
  const [selected, setSelected] = useState<{ id: number; word: string }[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const wordsObj = targetWords.map((word, i) => ({ id: i, word }));
    setShuffled([...wordsObj].sort(() => Math.random() - 0.5));
  }, []);

  const handleSelect = (item: { id: number; word: string }) => {
    setSelected(prev => [...prev, item]);
    setShuffled(prev => prev.filter(w => w.id !== item.id));
  };

  const handleDeselect = (item: { id: number; word: string }) => {
    setShuffled(prev => [...prev, item]);
    setSelected(prev => prev.filter(w => w.id !== item.id));
  };

  useEffect(() => {
    if (selected.length === targetWords.length) {
      const sentence = selected.map(s => s.word).join(" ");
      const targetSentence = targetWords.join(" ");
      if (sentence === targetSentence) {
        setIsSuccess(true);
        setTimeout(onNext, 2500);
      } else {
        // Reset after briefly showing error
        setTimeout(() => {
          setShuffled(prev => [...prev, ...selected].sort(() => Math.random() - 0.5));
          setSelected([]);
        }, 1200);
      }
    }
  }, [selected, onNext]);

  return (
    <div className="flex flex-col items-center text-center space-y-8 bg-white/40 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-white/60">
      <h2 className="font-serif text-3xl md:text-4xl text-foreground font-medium">
        Ordnung ins Chaos
      </h2>
      <p className="text-muted-foreground text-lg">
        Tippe die Worte in der richtigen Reihenfolge an.
      </p>

      <div className="w-full min-h-[90px] p-4 bg-white/50 rounded-2xl border-2 border-dashed border-primary/30 flex flex-wrap gap-3 items-center justify-center transition-colors">
        <AnimatePresence>
          {selected.map(item => (
            <motion.button
              key={`sel-${item.id}`}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => !isSuccess && handleDeselect(item)}
              className={`px-5 py-3 rounded-xl text-lg font-medium shadow-md transition-transform ${isSuccess ? 'bg-primary text-primary-foreground' : 'bg-white text-foreground hover:bg-accent hover:scale-105 active:scale-95'}`}
              disabled={isSuccess}
            >
              {item.word}
            </motion.button>
          ))}
          {selected.length === 0 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted-foreground/60 italic"
            >
              Hier entsteht dein Satz...
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-3 items-center justify-center min-h-[120px]">
        <AnimatePresence>
          {shuffled.map(item => (
            <motion.button
              key={`shuff-${item.id}`}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => handleSelect(item)}
              className="px-5 py-3 bg-white text-foreground rounded-xl text-lg font-medium shadow-sm border border-border transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-105 active:scale-95"
            >
              {item.word}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <div className="h-8 flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          {isSuccess && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-primary font-serif text-2xl flex items-center gap-2"
            >
              <span>Genau so ist es.</span>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </motion.div>
          )}
          {selected.length === targetWords.length && !isSuccess && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-destructive font-medium bg-destructive/10 px-4 py-2 rounded-full"
            >
              Fast! Versuch es noch einmal...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}