import { motion } from 'framer-motion';

export function FinaleStep() {
  return (
    <div className="flex flex-col items-center text-center space-y-8 bg-white/50 backdrop-blur-lg p-10 md:p-16 rounded-[3rem] shadow-2xl border border-white/60 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/30 pointer-events-none" />
      
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, delay: 0.2, duration: 1 }}
        className="w-32 h-32 text-primary relative z-10 drop-shadow-xl"
      >
        <motion.svg 
          viewBox="0 0 24 24" 
          fill="currentColor"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
           <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </motion.svg>
      </motion.div>

      <div className="space-y-6 relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="font-serif text-4xl md:text-5xl text-foreground font-semibold tracking-tight leading-tight"
        >
          Danke, dass es <br className="md:hidden" /> dich gibt.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-foreground/80 text-lg md:text-xl font-medium max-w-sm mx-auto leading-relaxed"
        >
          Du bist mein größtes Abenteuer und mein liebster Hafen. <br/><br/>
          <span className="italic font-serif text-primary text-3xl block mt-4 drop-shadow-sm">Ich liebe dich.</span>
        </motion.p>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={() => window.location.reload()}
        className="mt-12 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest relative z-10"
      >
        Nochmal erleben
      </motion.button>
    </div>
  );
}