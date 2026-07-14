import { motion } from 'framer-motion';

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center text-center space-y-8 bg-white/40 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-white/60">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2, duration: 1.5 }}
        className="w-20 h-20 text-primary mb-4"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
           <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </motion.div>
      <div className="space-y-4">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground font-medium tracking-tight leading-tight">
          Für Dich. <br/><span className="text-primary italic">Ein kleines Abenteuer.</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl font-light">
          Nimm dir einen Moment Zeit für eine kleine Reise.
        </p>
      </div>
      <button
        onClick={onNext}
        className="mt-8 px-10 py-4 bg-primary text-primary-foreground rounded-full font-medium text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/20"
      >
        Beginnen
      </button>
    </div>
  );
}