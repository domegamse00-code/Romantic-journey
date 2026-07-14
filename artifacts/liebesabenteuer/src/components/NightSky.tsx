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
      Array.from({ length: 260 }).map((_, i) => ({
        id: i,
        top: Math.random() * 62,
        left: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        baseOpacity: Math.random() * 0.55 + 0.25,
        twinkle: Math.random() > 0.5,
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
        top: Math.random() * 40,
        left: Math.random() * 75,
        angle: 18 + Math.random() * 30,
        distance: 200 + Math.random() * 260,
        duration: 0.9 + Math.random() * 1.1,
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

      {/* Glowing moon — drifts extremely slowly across the sky, looping forever */}
      <motion.div
        className="absolute top-[8%]"
        initial={{ left: '6%' }}
        animate={{ left: ['6%', '82%', '6%'] }}
        transition={{ duration: 240, times: [0, 0.5, 1], repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute -inset-24 rounded-full bg-pink-300/20 blur-[70px]" />
        <div className="absolute -inset-12 rounded-full bg-white/30 blur-[45px]" />
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-white via-[#fbe8f5] to-[#f3b6d9] shadow-[0_0_90px_20px_rgba(255,220,240,0.55)]" />
      </motion.div>

      {/* Soft pink clouds near the bottom */}
      <div className="absolute bottom-[18%] left-[-5%] w-[55%] h-24 rounded-full bg-pink-300/10 blur-[50px]" />
      <div className="absolute bottom-[22%] right-[-8%] w-[60%] h-28 rounded-full bg-fuchsia-300/10 blur-[55px]" />
      <div className="absolute bottom-[15%] left-[30%] w-[40%] h-20 rounded-full bg-white/[0.06] blur-[45px]" />

      {/* Soft purple/pink ambient moonlight glow behind the skyline */}
      <div className="absolute bottom-0 left-[10%] w-[45%] h-[26%] rounded-full bg-fuchsia-400/15 blur-[90px]" />
      <div className="absolute bottom-0 right-[8%] w-[40%] h-[24%] rounded-full bg-purple-400/15 blur-[90px]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[55%] h-[20%] rounded-full bg-pink-300/10 blur-[100px]" />

      {/* Atmospheric haze between the sky and the skyline, for cinematic depth */}
      <div className="absolute bottom-[14%] left-0 right-0 h-[10%] bg-gradient-to-t from-[#160c26]/50 via-[#1c1030]/15 to-transparent blur-[8px]" />

      {/* Munich skyline silhouette — minimalistic, almost black with a subtle purple tint */}
      <div className="absolute bottom-0 left-0 right-0 h-[16%] sm:h-[19%]">
        <svg
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="skylineFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1c1130" />
              <stop offset="100%" stopColor="#060309" />
            </linearGradient>
          </defs>

          {/* Generic low-rise silhouette across the full width */}
          <g fill="url(#skylineFill)">
            <rect x="0" y="175" width="70" height="45" />
            <rect x="75" y="160" width="55" height="60" />
            <rect x="195" y="180" width="90" height="40" />
            <rect x="290" y="150" width="60" height="70" />
            <rect x="355" y="170" width="80" height="50" />
            <rect x="440" y="185" width="65" height="35" />
            <rect x="670" y="165" width="75" height="55" />
            <rect x="750" y="185" width="60" height="35" />
            <rect x="815" y="150" width="55" height="70" />
            <rect x="1030" y="170" width="70" height="50" />
            <rect x="1105" y="185" width="60" height="35" />
            <rect x="1225" y="160" width="85" height="60" />
            <rect x="1315" y="180" width="70" height="40" />
            <rect x="1390" y="165" width="50" height="55" />
          </g>

          {/* Olympiaturm */}
          <g fill="url(#skylineFill)">
            <rect x="140" y="55" width="3" height="165" />
            <rect x="140.5" y="30" width="2" height="25" />
            <circle cx="141.5" cy="47" r="11" />
          </g>

          {/* Frauenkirche — twin onion-domed towers */}
          <g fill="url(#skylineFill)">
            <rect x="545" y="75" width="24" height="145" />
            <rect x="590" y="75" width="24" height="145" />
            <circle cx="557" cy="72" r="15" />
            <circle cx="602" cy="72" r="15" />
          </g>

          {/* Allianz Arena — low glowing dome */}
          <path
            d="M 895 220 A 68 46 0 0 1 1015 220 Z"
            fill="#241a38"
            opacity="0.9"
          />

          {/* Neues Rathaus — tower with spire */}
          <g fill="url(#skylineFill)">
            <rect x="1170" y="70" width="28" height="150" />
            <polygon points="1170,70 1184,38 1198,70" />
          </g>

          {/* Tiny warm window lights */}
          <g fill="#f6c98a">
            <motion.rect x="20" y="195" width="3" height="4" animate={{ opacity: [0.85, 0.25, 0.85] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.rect x="100" y="180" width="3" height="4" animate={{ opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />
            <motion.rect x="310" y="170" width="3" height="4" animate={{ opacity: [0.9, 0.4, 0.9] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} />
            <motion.rect x="700" y="185" width="3" height="4" animate={{ opacity: [0.4, 0.85, 0.4] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }} />
            <motion.rect x="840" y="170" width="3" height="4" animate={{ opacity: [0.85, 0.3, 0.85] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }} />
            <motion.rect x="1050" y="190" width="3" height="4" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }} />
            <motion.rect x="1180" y="110" width="3" height="4" animate={{ opacity: [0.8, 0.35, 0.8] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }} />
            <motion.rect x="1250" y="180" width="3" height="4" animate={{ opacity: [0.35, 0.9, 0.35] }} transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }} />
          </g>

          {/* Soft fade where the skyline meets the night sky */}
          <rect x="0" y="0" width="1440" height="60" fill="url(#skylineFill)" opacity="0" />
        </svg>
        <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-t from-transparent via-transparent to-[#0f0a24]/40 pointer-events-none" />
      </div>

      {/* Overall vignette for cinematic depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
    </div>
  );
}
