import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * GiftMessage — Typewriter effect at 60ms per character
 * Dramatic slow-appear animation for the "gift" reveal
 */
export default function GiftMessage({ gift, emoji, onComplete }) {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (displayedChars < gift.length) {
      const timer = setTimeout(() => {
        setDisplayedChars((prev) => prev + 1);
      }, 60);
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
      if (onComplete) {
        const timer = setTimeout(onComplete, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [displayedChars, gift.length, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        textAlign: 'center',
        padding: '32px 20px',
      }}
    >
      {/* Gift emoji */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        style={{ fontSize: '3rem', marginBottom: '16px' }}
      >
        {emoji}
      </motion.div>

      {/* Label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          fontFamily: 'var(--font-caveat)',
          fontSize: '1rem',
          color: 'var(--color-pencil-light)',
          marginBottom: '12px',
          letterSpacing: '1px',
        }}
      >
        เทพแห่งความฝันมอบของขวัญให้เจ้า
      </motion.div>

      {/* Gift text with typewriter */}
      <div
        style={{
          fontFamily: 'var(--font-noto)',
          fontSize: '1.15rem',
          lineHeight: 1.8,
          color: 'var(--color-pencil)',
          fontWeight: 500,
          minHeight: '3em',
          position: 'relative',
        }}
      >
        <span>{gift.slice(0, displayedChars)}</span>
        {!isComplete && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{
              display: 'inline-block',
              width: '2px',
              height: '1.2em',
              background: 'var(--color-dream)',
              marginLeft: '2px',
              verticalAlign: 'text-bottom',
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
