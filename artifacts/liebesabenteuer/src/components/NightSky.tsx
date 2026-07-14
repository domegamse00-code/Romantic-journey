import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

type ShootingStar = {
  id: number;
  top: number;
  left: number;
  angle: number;
  distance: number;
  duration: number;
};

// Full-screen cinematic night scene used only on the Chapter 3 "date & time"
// page: a glowing moon, a starfield with slow twinkling, soft pink clouds,
// a moonlit water reflection at the bottom, and randomly spawning shooting
// stars. Purely decorative — no state leaves this component.
export function NightSky() {
  const stars = useMemo(
    () =>
      Array.from({ length: 160 }).map((_, i) => ({
        id: i,
        top: Math.random() * 62,
        left: Math.random() * 100,
        size: Math.random() * 2 + 0.6,
        baseOpacity: Math.random() * 0.5 + 0.35,
        twinkle: Math.random() > 0.55,
        duration: Math.random() * 4 + 3,
        delay: Math.random() * 5,
      })),
    [],
  );

  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  useEffect(() => {
    let cancelled = false;
    let idCounter = 0;

    const spawn = () => {
      if (cancelled) return;

      const burst = Math.random() > 0.7 ? 2 : 1;
      const newStars: ShootingStar[] = Array.from({ length: burst }).map(() => ({
        id: idCounter++,
        top: Math.random() * 35,
        left: Math.random() * 70,
        angle: 28 + Math.random() * 12,
        distance: 260 + Math.random() * 180,
        duration: 1.1 + Math.random() * 0.7,
      }));

      setShootingStars(prev => [...prev, ...newStars]);

      const maxLife = Math.max(...newStars.map(s => s.duration)) * 1000 + 200;
      setTimeout(() => {
        setShootingStars(prev => prev.filter(s => !newStars.some(n => n.id === s.id)));
      }, maxLife);

      const next = 3000 + Math.random() * 2000;
      setTimeout(spawn, next);
    };

    const initial = setTimeout(spawn, 1500);
    return () => {
      cancelled = true;
      clearTimeout(initial);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Night sky base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050212] via-[#0f0a24] to-[#1a0e2e]" />

      {/* Starfield */}
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size,
            height: star.size,
            opacity: star.baseOpacity,
            boxShadow: '0 0 3px rgba(255,255,255,0.8)',
          }}
          animate={
            star.twinkle
              ? { opacity: [star.baseOpacity, star.baseOpacity * 0.15, star.baseOpacity] }
              : {}
          }
          transition={{ duration: star.duration, repeat: Infinity, ease: 'easeInOut', delay: star.delay }}
        />
      ))}

      {/* Shooting stars */}
      <AnimatePresence>
        {shootingStars.map(star => {
          const rad = (star.angle * Math.PI) / 180;
          const dx = Math.cos(rad) * star.distance;
          const dy = Math.sin(rad) * star.distance;
          return (
            <motion.div
              key={star.id}
              className="absolute h-[2px] w-[90px] rounded-full"
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0.95), rgba(244,194,255,0.4), transparent)',
                boxShadow: '0 0 8px 1px rgba(255,255,255,0.7)',
                transform: `rotate(${star.angle}deg)`,
                transformOrigin: 'left center',
              }}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{ x: dx, y: dy, opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: star.duration, ease: 'easeOut' }}
            />
          );
        })}
      </AnimatePresence>

      {/* Glowing moon, right side */}
      <div className="absolute top-[8%] right-[6%] sm:right-[10%]">
        <div className="absolute -inset-24 rounded-full bg-pink-300/20 blur-[70px]" />
        <div className="absolute -inset-12 rounded-full bg-white/30 blur-[45px]" />
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-white via-[#fbe8f5] to-[#f3b6d9] shadow-[0_0_90px_20px_rgba(255,220,240,0.55)]" />
      </div>

      {/* Soft pink clouds near the bottom */}
      <div className="absolute bottom-[18%] left-[-5%] w-[55%] h-24 rounded-full bg-pink-300/10 blur-[50px]" />
      <div className="absolute bottom-[22%] right-[-8%] w-[60%] h-28 rounded-full bg-fuchsia-300/10 blur-[55px]" />
      <div className="absolute bottom-[15%] left-[30%] w-[40%] h-20 rounded-full bg-white/[0.06] blur-[45px]" />

      {/* Lake / ocean reflection */}
      <div className="absolute bottom-0 left-0 right-0 h-[22%] bg-gradient-to-b from-[#170c2c]/70 via-[#0c0620] to-black" />
      <div className="absolute bottom-0 right-[8%] sm:right-[12%] w-32 sm:w-40 h-[22%] bg-gradient-to-b from-[#f3d3ea]/25 via-[#c98fc0]/10 to-transparent blur-[6px]" />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[22%]"
        style={{
          background:
            'repeating-linear-gradient(100deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 14px)',
        }}
        animate={{ backgroundPositionX: ['0px', '140px'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      {/* Overall vignette for cinematic depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
    </div>
  );
}
