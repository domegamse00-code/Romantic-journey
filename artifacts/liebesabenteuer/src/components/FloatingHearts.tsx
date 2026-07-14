import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const HeartIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

export function FloatingHearts() {
  const [hearts, setHearts] = useState<{ id: number; left: number; size: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate initial hearts
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 20 + 10, // 10px to 30px
      delay: Math.random() * 10,
      duration: Math.random() * 15 + 10, // 10s to 25s
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          className="absolute bottom-[-50px] text-primary/10"
          style={{ left: `${heart.left}%`, width: heart.size, height: heart.size }}
          animate={{
            y: ['0vh', '-110vh'],
            x: ['0px', '20px', '-20px', '0px']
          }}
          transition={{
            y: {
              duration: heart.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: heart.delay,
            },
            x: {
              duration: heart.duration / 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: heart.delay,
              repeatType: 'mirror'
            }
          }}
        >
          <HeartIcon />
        </motion.div>
      ))}
    </div>
  );
}
