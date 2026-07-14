import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function HeartCollectorStep({ onNext }: { onNext: () => void }) {
  const [collected, setCollected] = useState(0);
  const target = 5;
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    // Generate initial collectible hearts scattered around
    const newHearts = Array.from({ length: target }).map((_, i) => ({
      id: i,
      x: 15 + Math.random() * 70, // percentage 15 to 85
      y: 25 + Math.random() * 60, // percentage 25 to 85 (leaving room for title)
    }));
    setHearts(newHearts);
  }, []);

  const collect = (id: number) => {
    setHearts(prev => prev.filter(h => h.id !== id));
    setCollected(prev => {
      const next = prev + 1;
      if (next === target) {
        setTimeout(onNext, 1800);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col items-center text-center space-y-8 bg-white/40 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-white/60 relative min-h-[450px]">
      <div className="z-10 relative">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground font-medium">
          Ein kleines Spiel
        </h2>
        <p className="text-muted-foreground mt-2 text-lg">
          Finde und sammle {target} leuchtende Herzen.
        </p>
        <div className="mt-6 text-2xl font-serif font-medium text-primary bg-white/60 px-6 py-2 rounded-full inline-block shadow-sm">
          {collected} / {target}
        </div>
      </div>
      
      <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
        <div className="pointer-events-auto absolute inset-0">
          <AnimatePresence>
            {hearts.map(heart => (
              <motion.button
                key={heart.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: 1,
                  y: [0, -5, 0]
                }}
                exit={{ scale: 2, opacity: 0 }}
                transition={{ 
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
                onClick={() => collect(heart.id)}
                className="absolute w-12 h-12 text-primary drop-shadow-md hover:text-primary/80 transition-colors focus:outline-none hover:scale-110"
                style={{ left: `${heart.x}%`, top: `${heart.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {collected === target && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-md rounded-[2.5rem]"
          >
            <motion.p 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="font-serif text-3xl text-primary font-medium bg-white px-10 py-5 rounded-full shadow-xl border border-primary/10"
            >
              Wundervoll!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}