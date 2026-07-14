import { useState } from 'react';
import { motion } from 'framer-motion';

export function QuestionStep({ question, options, onNext }: { question: string, options: string[], onNext: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    setSelected(idx);
    setTimeout(() => {
      onNext();
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center text-center space-y-8 bg-white/40 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-white/60 relative overflow-hidden">
      <h2 className="font-serif text-3xl md:text-4xl text-foreground font-medium z-10">
        {question}
      </h2>
      <div className="flex flex-col gap-4 w-full mt-8 z-10">
        {options.map((opt, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 + 0.3 }}
            onClick={() => handleSelect(idx)}
            className={`px-6 py-4 rounded-2xl text-lg font-medium transition-all duration-300 text-left border ${
              selected === idx 
                ? 'bg-primary text-primary-foreground border-primary scale-[1.02] shadow-md'
                : selected !== null
                  ? 'bg-white/50 text-muted-foreground border-transparent opacity-50 cursor-not-allowed'
                  : 'bg-white/60 text-foreground border-white/40 hover:bg-white hover:shadow-sm hover:scale-[1.01]'
            }`}
            disabled={selected !== null}
          >
            {opt}
          </motion.button>
        ))}
      </div>
      {selected !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        >
          <div className="w-48 h-48 text-primary/10 drop-shadow-2xl">
            <svg viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        </motion.div>
      )}
    </div>
  );
}