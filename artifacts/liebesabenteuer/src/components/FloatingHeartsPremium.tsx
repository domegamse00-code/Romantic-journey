import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const HeartIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

// A denser, more luminous heart field used only on the premium "Chapter"
// pages — larger size range, varied glow/opacity, and a subtle blur while
// drifting for a cinematic, dreamy depth effect.
export function FloatingHeartsPremium() {
  const [hearts, setHearts] = useState<{ id: number; left: number; size: number; delay: number; duration: number; opacity: number; blur: number }[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 26 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 38 + 8, // 8px to 46px
      delay: Math.random() * 12,
      duration: Math.random() * 18 + 12, // 12s to 30s
      opacity: Math.random() * 0.3 + 0.08, // 0.08 to 0.38
      blur: Math.random() * 1.8, // 0 to 1.8px
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          className="absolute bottom-[-60px] text-pink-400"
          style={{
            left: `${heart.left}%`,
            width: heart.size,
            height: heart.size,
            opacity: heart.opacity,
            filter: `drop-shadow(0 0 6px rgba(244,114,182,0.6)) blur(${heart.blur}px)`,
          }}
          animate={{
            y: ['0vh', '-115vh'],
            x: ['0px', '24px', '-24px', '0px'],
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
