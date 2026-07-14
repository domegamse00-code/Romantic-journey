import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// The most romantic background of the whole journey — Chapter 5 only.
// Warm sunset gradient, softly floating hearts, fairy lights, candles,
// a cozy blanket texture and soft bokeh. Confined to this component.
export function RomanticFinale() {
  const [bokeh, setBokeh] = useState<{ id: number; top: number; left: number; size: number; delay: number; duration: number; hue: string }[]>([]);
  const [hearts, setHearts] = useState<{ id: number; left: number; size: number; delay: number; duration: number; opacity: number }[]>([]);
  const [lights, setLights] = useState<{ id: number; left: number; delay: number; hue: string }[]>([]);

  useEffect(() => {
    const hues = ['#ffd08a', '#ff9ec4', '#c084fc', '#ffb37a'];
    setBokeh(
      Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 70 + 30,
        delay: Math.random() * 6,
        duration: Math.random() * 8 + 8,
        hue: hues[i % hues.length],
      })),
    );
    setHearts(
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 22 + 10,
        delay: Math.random() * 10,
        duration: Math.random() * 14 + 14,
        opacity: Math.random() * 0.25 + 0.12,
      })),
    );
    const lightCount = 24;
    setLights(
      Array.from({ length: lightCount }).map((_, i) => ({
        id: i,
        left: (i / (lightCount - 1)) * 100,
        delay: Math.random() * 2,
        hue: hues[i % hues.length],
      })),
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Dreamy sunset sky */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3a1650] via-[#7a2f5f] to-[#ff9a56]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#ffcf9a]/35 via-transparent to-[#2a0f45]/40" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] rounded-full bg-orange-200/25 blur-[130px]" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[70%] h-[60%] rounded-full bg-fuchsia-400/20 blur-[140px]" />
      <div className="absolute top-[10%] left-[-10%] w-[55%] h-[50%] rounded-full bg-purple-400/15 blur-[120px]" />

      {/* Bokeh */}
      {bokeh.map(b => (
        <motion.div
          key={b.id}
          className="absolute rounded-full blur-2xl"
          style={{ top: `${b.top}%`, left: `${b.left}%`, width: b.size, height: b.size, background: b.hue, opacity: 0.18 }}
          animate={{ opacity: [0.08, 0.28, 0.08], scale: [1, 1.15, 1] }}
          transition={{ duration: b.duration, repeat: Infinity, ease: 'easeInOut', delay: b.delay }}
        />
      ))}

      {/* Fairy lights strung across the top */}
      <svg className="absolute top-0 left-0 w-full h-24" viewBox="0 0 100 20" preserveAspectRatio="none">
        <path d="M0,2 Q25,18 50,4 Q75,-8 100,3" stroke="rgba(255,220,180,0.35)" strokeWidth="0.3" fill="none" />
      </svg>
      {lights.map(l => (
        <motion.div
          key={l.id}
          className="absolute top-3 md:top-4 rounded-full"
          style={{
            left: `${l.left}%`,
            width: 7,
            height: 7,
            background: l.hue,
            boxShadow: `0 0 8px 2px ${l.hue}`,
          }}
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 2.5 + Math.random() * 1.5, repeat: Infinity, ease: 'easeInOut', delay: l.delay }}
        />
      ))}

      {/* Candles, bottom corners */}
      <Candle className="absolute bottom-6 left-6 sm:left-10" />
      <Candle className="absolute bottom-6 right-6 sm:right-10" />

      {/* Cozy blanket texture along the bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[18%] opacity-[0.14]"
        style={{
          background:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 2px, transparent 2px, transparent 18px), repeating-linear-gradient(-45deg, rgba(120,40,60,0.4) 0px, rgba(120,40,60,0.4) 2px, transparent 2px, transparent 18px)',
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-[12%] bg-gradient-to-t from-[#3a1650]/70 to-transparent" />

      {/* Softly floating hearts */}
      {hearts.map(h => (
        <motion.div
          key={h.id}
          className="absolute bottom-[-40px] text-pink-200"
          style={{ left: `${h.left}%`, width: h.size, height: h.size, opacity: h.opacity, filter: 'drop-shadow(0 0 6px rgba(255,180,210,0.6))' }}
          animate={{ y: ['0vh', '-110vh'], x: ['0px', '18px', '-18px', '0px'], rotate: [0, 15, -15, 0] }}
          transition={{
            y: { duration: h.duration, repeat: Infinity, ease: 'linear', delay: h.delay },
            x: { duration: h.duration / 2, repeat: Infinity, ease: 'easeInOut', delay: h.delay, repeatType: 'mirror' },
            rotate: { duration: h.duration / 1.5, repeat: Infinity, ease: 'easeInOut', delay: h.delay },
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

function Candle({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative w-6 md:w-8">
        <motion.div
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-3 h-4 rounded-full bg-gradient-to-t from-orange-400 via-yellow-200 to-transparent"
          style={{ filter: 'blur(1px)' }}
          animate={{ opacity: [0.7, 1, 0.75, 1], scaleY: [1, 1.15, 0.95, 1.05, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-orange-300/30 blur-lg" />
        <div className="w-6 md:w-8 h-16 md:h-20 rounded-t-sm bg-gradient-to-b from-[#fff6e0] to-[#f2dfb0]" />
      </div>
    </div>
  );
}
