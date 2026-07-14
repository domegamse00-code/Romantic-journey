import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const STAGE_ONE_AT = 8;
const STAGE_TWO_AT = 16;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function DateAskStep({ onNext }: { onNext: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const jaRef = useRef<HTMLButtonElement>(null);
  const neinRef = useRef<HTMLButtonElement>(null);
  const lastEvadeRef = useRef(0);
  const posRef = useRef({ x: 0, y: 0 });

  const [attempts, setAttempts] = useState(0);
  const [neinPos, setNeinPos] = useState({ x: 0, y: 0, rotate: 0 });
  const [ready, setReady] = useState(false);

  const placeInitial = useCallback(() => {
    const container = containerRef.current;
    const nein = neinRef.current;
    const ja = jaRef.current;
    if (!container || !nein || !ja) return;

    const containerRect = container.getBoundingClientRect();
    const neinRect = nein.getBoundingClientRect();
    const jaRect = ja.getBoundingClientRect();

    const maxX = containerRect.width - neinRect.width;
    const maxY = containerRect.height - neinRect.height;
    const startX = clamp(
      containerRect.width - neinRect.width - 8,
      jaRect.width + 24,
      maxX,
    );
    const startY = clamp((containerRect.height - neinRect.height) / 2, 0, maxY);

    posRef.current = { x: startX, y: startY };
    setNeinPos({ x: startX, y: startY, rotate: 0 });
    setReady(true);
  }, []);

  useEffect(() => {
    placeInitial();
    window.addEventListener('resize', placeInitial);
    return () => window.removeEventListener('resize', placeInitial);
  }, [placeInitial]);

  const evade = useCallback(() => {
    const container = containerRef.current;
    const nein = neinRef.current;
    const ja = jaRef.current;
    if (!container || !nein || !ja) return;

    const now = Date.now();
    if (now - lastEvadeRef.current < 220) return;
    lastEvadeRef.current = now;

    const containerRect = container.getBoundingClientRect();
    const neinRect = nein.getBoundingClientRect();
    const jaRect = ja.getBoundingClientRect();

    const maxX = Math.max(0, containerRect.width - neinRect.width);
    const maxY = Math.max(0, containerRect.height - neinRect.height);

    // Keep clear of the "Ja" button so the two never overlap.
    const jaSafeRight = jaRect.right - containerRect.left + 16;

    const bigJump = Math.random() > 0.35 || attempts < 2;
    let nextX: number;
    let nextY: number;

    if (bigJump) {
      nextX = Math.random() * maxX;
      nextY = Math.random() * maxY;
      if (nextX < jaSafeRight) {
        nextX = clamp(jaSafeRight + Math.random() * (maxX - jaSafeRight), 0, maxX);
      }
    } else {
      const nudge = 50 + attempts * 4;
      nextX = clamp(posRef.current.x + (Math.random() - 0.5) * nudge * 2, 0, maxX);
      nextY = clamp(posRef.current.y + (Math.random() - 0.5) * nudge * 2, 0, maxY);
      if (nextX < jaSafeRight) {
        nextX = clamp(jaSafeRight, 0, maxX);
      }
    }

    const rotate = (Math.random() - 0.5) * clamp(16 + attempts * 2, 16, 50);

    posRef.current = { x: nextX, y: nextY };
    setNeinPos({ x: nextX, y: nextY, rotate });
    setAttempts((a) => a + 1);
  }, [attempts]);

  const handlePointerMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const nein = neinRef.current;
      if (!nein) return;

      const rect = nein.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const triggerRadius = clamp(85 + attempts * 5, 85, 170);
      if (distance < triggerRadius) {
        evade();
      }
    },
    [attempts, evade],
  );

  const escapeDuration = clamp(0.5 - attempts * 0.015, 0.22, 0.5);

  const message =
    attempts >= STAGE_TWO_AT
      ? 'Ich glaube, wir kennen die Antwort eigentlich beide. 😉❤️'
      : attempts >= STAGE_ONE_AT
        ? 'Du gibst aber wirklich nicht auf... 😂'
        : null;

  return (
    <div className="flex flex-col items-center text-center space-y-6 bg-white/40 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-white/60 relative overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-serif text-3xl md:text-4xl text-foreground font-medium z-10 leading-snug"
      >
        ❤️ Hast du Lust auf ein Date mit mir? ❤️
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="text-foreground/70 text-base md:text-lg z-10"
      >
        Ich habe mir etwas ganz Besonderes überlegt... ❤️
      </motion.p>

      <div
        ref={containerRef}
        onMouseMove={handlePointerMove}
        className="relative w-full h-56 sm:h-40 mt-4 z-10 overflow-hidden touch-none select-none"
      >
        <motion.button
          ref={jaRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: ready ? 1 : 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={onNext}
          className="absolute left-2 top-1/2 -translate-y-1/2 px-8 py-4 rounded-2xl text-lg font-semibold bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200"
          data-testid="button-date-yes"
        >
          💚 Ja
        </motion.button>

        <motion.button
          ref={neinRef}
          animate={{
            x: neinPos.x,
            y: neinPos.y,
            rotate: neinPos.rotate,
            opacity: ready ? 1 : 0,
          }}
          transition={{ duration: escapeDuration, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', left: 0, top: 0 }}
          onMouseEnter={evade}
          onTouchStart={(event) => {
            event.preventDefault();
            evade();
          }}
          onClick={(event) => {
            event.preventDefault();
            evade();
          }}
          className="px-8 py-4 rounded-2xl text-lg font-semibold bg-white/70 text-foreground border border-white/60 shadow-md cursor-pointer"
          data-testid="button-date-no"
        >
          ❤️ Nein
        </motion.button>
      </div>

      <div className="h-6 z-10">
        <AnimatePresence mode="wait">
          {message && (
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              className="text-sm text-muted-foreground italic"
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
