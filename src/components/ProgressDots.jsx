import { motion } from 'framer-motion';

/**
 * ProgressDots — Shows game progress through 6 questions
 * Irregular dot sizes for hand-drawn feel
 */

const dotSizes = [7, 8, 6, 9, 7, 8]; // irregular sizes

export default function ProgressDots({ current, total = 6 }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '12px 0',
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i < current;
        const isCurrent = i === current;
        const size = dotSizes[i] || 7;

        return (
          <motion.div
            key={i}
            animate={{
              scale: isCurrent ? [1, 1.2, 1] : 1,
              opacity: isActive ? 1 : isCurrent ? 0.8 : 0.3,
            }}
            transition={{
              duration: isCurrent ? 1.5 : 0.3,
              repeat: isCurrent ? Infinity : 0,
              ease: 'easeInOut',
            }}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              background: isActive
                ? 'var(--color-dream)'
                : isCurrent
                  ? 'var(--color-child)'
                  : 'var(--color-smudge)',
              border: `1.5px solid ${
                isActive
                  ? 'var(--color-dream)'
                  : isCurrent
                    ? 'var(--color-child)'
                    : 'var(--color-smudge)'
              }`,
              transition: 'background 0.3s, border-color 0.3s',
            }}
          />
        );
      })}
    </div>
  );
}
