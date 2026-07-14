import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Warm vacation-sunset background used only for Chapter 4 — sunset sky,
// calm ocean with gentle waves, palm silhouettes, drifting clouds and
// slowly-appearing stars. Confined to this component; does not affect
// any other chapter's background.
export function SunsetOcean() {
  const [stars, setStars] = useState<{ id: number; top: number; left: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      top: Math.random() * 45, // upper portion of the sky only
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 6,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Sunset sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2c1250] via-[#7b2e5a] via-40% to-[#ff9a56] to-90%" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#ffb37a]/40 via-transparent to-transparent" />

      {/* Sun glow */}
      <motion.div
        className="absolute rounded-full bg-gradient-to-br from-[#ffd08a] to-[#ff7d5c]"
        style={{ width: 180, height: 180, left: '50%', top: '38%', translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: [0.85, 1, 0.85], scale: [1, 1.04, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 rounded-full blur-[50px] bg-orange-300/70" />
      </motion.div>

      {/* Slowly appearing stars, upper sky only */}
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{ top: `${star.top}%`, left: `${star.left}%`, width: star.size, height: star.size }}
          animate={{ opacity: [0, 0.8, 0.3, 0.8] }}
          transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut', delay: star.delay }}
        />
      ))}

      {/* Soft moving clouds */}
      {[
        { top: '14%', width: 220, dur: 70, opacity: 0.22, delay: 0 },
        { top: '22%', width: 160, dur: 90, opacity: 0.16, delay: 5 },
        { top: '9%', width: 130, dur: 60, opacity: 0.18, delay: 12 },
      ].map((cloud, i) => (
        <motion.div
          key={i}
          className="absolute h-10 rounded-full bg-white blur-2xl"
          style={{ top: cloud.top, width: cloud.width, opacity: cloud.opacity }}
          animate={{ left: ['-20%', '110%'] }}
          transition={{ duration: cloud.dur, repeat: Infinity, ease: 'linear', delay: cloud.delay }}
        />
      ))}

      {/* Palm tree silhouettes */}
      <div className="absolute bottom-0 left-[2%] sm:left-[4%]" style={{ width: 130, height: 260 }}>
        <PalmTree />
      </div>
      <div className="absolute bottom-0 right-[3%] sm:right-[6%] scale-x-[-1]" style={{ width: 110, height: 220 }}>
        <PalmTree />
      </div>

      {/* Ocean */}
      <div className="absolute bottom-0 left-0 right-0 h-[26%] bg-gradient-to-b from-[#3a2350]/70 via-[#20123a] to-black" />
      <Waves />
    </div>
  );
}

function PalmTree() {
  return (
    <svg viewBox="0 0 130 260" className="w-full h-full text-black/75" fill="currentColor">
      {/* trunk */}
      <path d="M62 260 C58 200 70 150 60 100 C58 90 64 88 66 98 C78 148 68 200 70 260 Z" />
      {/* fronds */}
      <g transform="translate(64,96)">
        <path d="M0 0 C-30 -8 -55 -28 -65 -55 C-40 -50 -15 -30 0 0 Z" />
        <path d="M0 0 C-15 -30 -12 -55 -2 -78 C8 -55 10 -30 0 0 Z" />
        <path d="M0 0 C10 -30 8 -55 -2 -78 C12 -60 20 -35 0 0 Z" transform="scale(-1,1)" />
        <path d="M0 0 C30 -8 55 -28 65 -55 C40 -50 15 -30 0 0 Z" />
        <path d="M0 0 C25 5 48 15 62 35 C35 38 12 25 0 0 Z" />
        <path d="M0 0 C-25 5 -48 15 -62 35 C-35 38 -12 25 0 0 Z" />
      </g>
    </svg>
  );
}

function Waves() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[16%] overflow-hidden">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute bottom-0 left-0 w-[200%] h-full opacity-[0.12]"
          style={{
            background:
              'repeating-linear-gradient(100deg, transparent 0px, transparent 40px, rgba(255,200,150,0.5) 42px, transparent 60px)',
          }}
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 14 + i * 6, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}
