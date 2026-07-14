import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WelcomeStep } from '@/steps/WelcomeStep';
import { QuestionStep } from '@/steps/QuestionStep';
import { HeartCollectorStep } from '@/steps/HeartCollectorStep';
import { WordPuzzleStep } from '@/steps/WordPuzzleStep';
import { DateAskStep } from '@/steps/DateAskStep';
import { FoodChoiceStep } from '@/steps/FoodChoiceStep';
import { FloatingHearts } from '@/components/FloatingHearts';
import { FloatingFood } from '@/components/FloatingFood';

export default function Adventure() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));

  const steps = [
    <WelcomeStep onNext={nextStep} />,
    <QuestionStep 
      question="Erinnerst du dich, wie alles anfing?" 
      options={["Mit einem zögerlichen Blick", "Mit einem magischen Moment", "Mit einem Lächeln"]}
      onNext={nextStep} 
    />,
    <HeartCollectorStep onNext={nextStep} />,
    <QuestionStep 
      question="Was ist das Schönste an unserer Zeit zusammen?" 
      options={["Die leisen, vertrauten Momente", "Unsere wilden Abenteuer", "Einfach alles, solange du da bist"]}
      onNext={nextStep} 
    />,
    <WordPuzzleStep onNext={nextStep} />,
    <DateAskStep onNext={nextStep} />,
    <FoodChoiceStep onNext={nextStep} />
  ];

  const FOOD_STEP_INDEX = steps.length - 1;

  return (
    <div className="min-h-[100dvh] w-full bg-background overflow-hidden relative flex items-center justify-center p-4 sm:p-8">
      {/* Decorative gradient orb */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/50 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[150px] pointer-events-none" />
      
      {currentStep === FOOD_STEP_INDEX ? <FloatingFood /> : <FloatingHearts />}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-lg z-10"
        >
          {steps[currentStep]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}