import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const FOOD_ICONS = ['🍔', '🍕', '🥩', '🍣', '🥗', '🥙', '🍟', '🌮', '🥨', '🥐'];

export function FloatingFood() {
  const [items, setItems] = useState<{ id: number; left: number; size: number; delay: number; duration: number; icon: string }[]>([]);

  useEffect(() => {
    const newItems = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 16 + 18, // 18px to 34px
      delay: Math.random() * 10,
      duration: Math.random() * 15 + 10, // 10s to 25s
      icon: FOOD_ICONS[i % FOOD_ICONS.length],
    }));
    setItems(newItems);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {items.map(item => (
        <motion.div
          key={item.id}
          className="absolute bottom-[-50px] opacity-20"
          style={{ left: `${item.left}%`, fontSize: item.size }}
          animate={{
            y: ['0vh', '-110vh'],
            x: ['0px', '20px', '-20px', '0px'],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            y: {
              duration: item.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: item.delay,
            },
            x: {
              duration: item.duration / 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay,
              repeatType: 'mirror'
            },
            rotate: {
              duration: item.duration / 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay,
              repeatType: 'mirror'
            }
          }}
        >
          {item.icon}
        </motion.div>
      ))}
    </div>
  );
}
