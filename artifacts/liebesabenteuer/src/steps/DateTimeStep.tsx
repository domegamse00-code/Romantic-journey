import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { setAnswer } from '@/lib/answers';

const MONTH_NAMES = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];
const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const QUICK_TIMES = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
const YEAR = 2026;

function buildMonthGrid(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first
  const cells: (number | null)[] = Array.from({ length: firstWeekday }).map(() => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function DateTimeStep({ onNext }: { onNext: () => void }) {
  const initialMonth = useMemo(() => {
    const now = new Date();
    return now.getFullYear() === YEAR ? now.getMonth() : 0;
  }, []);

  const [viewMonth, setViewMonth] = useState(initialMonth);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [phase, setPhase] = useState<'select' | 'transition' | 'done'>('select');

  const grid = useMemo(() => buildMonthGrid(YEAR, viewMonth), [viewMonth]);
  const canContinue = selectedDay !== null && !!selectedTime;

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
  };

  const handleMonthNav = (dir: -1 | 1) => {
    setViewMonth(prev => Math.min(11, Math.max(0, prev + dir)));
    setSelectedDay(null);
  };

  const handleContinue = () => {
    if (!canContinue || !selectedDay || !selectedTime) return;

    const dateLabel = `${selectedDay}. ${MONTH_NAMES[viewMonth]} ${YEAR}`;
    setAnswer('selectedDate', dateLabel);
    setAnswer('selectedTime', selectedTime);

    setPhase('transition');
    setTimeout(() => setPhase('done'), 550);
    setTimeout(onNext, 2600);
  };

  return (
    <div className="relative w-[92vw] sm:w-[85vw] md:w-auto md:min-w-[650px] md:max-w-[760px] max-w-[760px] left-1/2 -translate-x-1/2 rounded-[3rem] border border-white/15 bg-white/[0.07] backdrop-blur-2xl shadow-[0_0_90px_-10px_rgba(244,114,182,0.4)] p-8 md:p-14 overflow-hidden">
      {/* Glassmorphism inner light */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-pink-300/[0.04] pointer-events-none" />
      <div className="absolute top-[-20%] right-[-15%] w-[60%] h-[50%] rounded-full bg-pink-300/15 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[-25%] left-[-15%] w-[65%] h-[55%] rounded-full bg-fuchsia-300/10 blur-[120px] pointer-events-none" />

      <AnimatePresence>
        {phase !== 'select' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 z-20"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {phase !== 'done' ? (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex flex-col items-center text-center space-y-8"
          >
            {/* Progress indicator */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="flex gap-2 text-2xl">
                {['full', 'full', 'full', 'empty', 'empty'].map((state, i) => (
                  <motion.span
                    key={i}
                    animate={
                      state === 'full'
                        ? {
                            filter: [
                              'drop-shadow(0 0 2px rgba(244,114,182,0.5))',
                              'drop-shadow(0 0 10px rgba(244,114,182,0.95))',
                              'drop-shadow(0 0 2px rgba(244,114,182,0.5))',
                            ],
                          }
                        : {}
                    }
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
                  >
                    {state === 'full' ? '❤️' : '🤍'}
                  </motion.span>
                ))}
              </div>
              <p className="text-pink-200/70 text-xs tracking-[0.3em] uppercase font-medium">
                Kapitel 3 von 5
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-3xl md:text-5xl text-white font-semibold leading-tight tracking-tight drop-shadow-[0_2px_20px_rgba(244,114,182,0.3)]">
                🌙 Wann passt es dir am besten?
              </h2>
              <p className="text-white/60 text-base md:text-xl font-light leading-relaxed max-w-md mx-auto">
                Wähle einfach einen Tag und eine Uhrzeit aus. ❤️
              </p>
            </div>

            {/* Calendar */}
            <div className="w-full rounded-3xl bg-white/[0.05] border border-white/10 p-4 md:p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => handleMonthNav(-1)}
                  disabled={viewMonth === 0}
                  className="p-2 rounded-full text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-25 disabled:hover:bg-transparent transition-colors"
                  data-testid="button-month-prev"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-serif text-lg md:text-xl text-white font-medium tracking-wide">
                  {MONTH_NAMES[viewMonth]} {YEAR}
                </span>
                <button
                  type="button"
                  onClick={() => handleMonthNav(1)}
                  disabled={viewMonth === 11}
                  className="p-2 rounded-full text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-25 disabled:hover:bg-transparent transition-colors"
                  data-testid="button-month-next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {WEEKDAYS.map(w => (
                  <div key={w} className="text-center text-[11px] tracking-wider text-white/35 font-medium py-1">
                    {w}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {grid.map((day, idx) => (
                  <div key={idx} className="aspect-square flex items-center justify-center">
                    {day !== null && (
                      <motion.button
                        type="button"
                        onClick={() => handleSelectDay(day)}
                        whileTap={{ scale: 0.9 }}
                        animate={
                          selectedDay === day
                            ? { scale: [1, 1.15, 1] }
                            : { scale: 1 }
                        }
                        transition={{ duration: 0.35 }}
                        className={`relative w-full h-full rounded-xl text-sm md:text-base flex items-center justify-center transition-colors duration-300 ${
                          selectedDay === day
                            ? 'bg-gradient-to-br from-pink-400 to-fuchsia-500 text-white font-semibold shadow-[0_0_18px_rgba(244,114,182,0.75)]'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                        data-testid={`button-day-${viewMonth + 1}-${day}`}
                      >
                        {day}
                      </motion.button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Time */}
            <div className="w-full space-y-4">
              <p className="text-white/70 text-sm md:text-base tracking-wide font-medium">
                🕒 Uhrzeit auswählen
              </p>

              <div className="flex flex-wrap justify-center gap-2.5">
                {QUICK_TIMES.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-2 rounded-full text-sm md:text-base font-medium border transition-all duration-300 ${
                      selectedTime === time
                        ? 'bg-gradient-to-br from-pink-400 to-fuchsia-500 text-white border-transparent shadow-[0_0_16px_rgba(244,114,182,0.7)]'
                        : 'bg-white/[0.05] text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                    data-testid={`button-time-${time}`}
                  >
                    {time}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-center gap-3">
                <span className="text-white/40 text-xs uppercase tracking-widest">oder manuell</span>
              </div>

              <div className="flex justify-center">
                <input
                  type="time"
                  value={selectedTime ?? ''}
                  onChange={e => setSelectedTime(e.target.value || null)}
                  className="bg-white/[0.06] border border-white/15 rounded-full px-5 py-2.5 text-white text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-pink-400/60 [color-scheme:dark]"
                  data-testid="input-time-manual"
                />
              </div>
            </div>

            {/* Continue button */}
            <motion.button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue}
              whileHover={canContinue ? { scale: 1.04 } : {}}
              whileTap={canContinue ? { scale: 0.97 } : {}}
              animate={
                canContinue
                  ? {
                      boxShadow: [
                        '0 0 20px rgba(244,114,182,0.4)',
                        '0 0 40px rgba(244,114,182,0.8)',
                        '0 0 20px rgba(244,114,182,0.4)',
                      ],
                    }
                  : { boxShadow: '0 0 0px rgba(244,114,182,0)' }
              }
              transition={canContinue ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
              className={`px-10 py-3.5 rounded-full font-semibold text-base md:text-lg tracking-wide transition-colors duration-300 ${
                canContinue
                  ? 'bg-gradient-to-r from-pink-400 to-fuchsia-500 text-white cursor-pointer'
                  : 'bg-white/[0.06] text-white/30 border border-white/10 cursor-not-allowed'
              }`}
              data-testid="button-continue"
            >
              ❤️ Weiter ❤️
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'done' && (
          <motion.div
            key="perfect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-20 flex flex-col items-center text-center space-y-4 py-10 min-h-[300px] justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ type: 'spring', damping: 10, duration: 0.9 }}
              className="text-5xl md:text-6xl drop-shadow-[0_0_30px_rgba(244,114,182,0.6)]"
            >
              ✨ Perfekt! ❤️
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-pink-100 font-light text-lg md:text-xl max-w-sm"
            >
              Ich freue mich schon riesig auf unseren gemeinsamen Tag.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
