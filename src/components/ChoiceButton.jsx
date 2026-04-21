import { motion } from 'framer-motion';

/**
 * ChoiceButton — Clay blob style button for player choices
 * Colors: A=memory(green), B=present(blue), C=child(yellow), D=longing(pink)
 */

const keyLabels = {
  A: 'ก.',
  B: 'ข.',
  C: 'ค.',
  D: 'ง.',
};

export default function ChoiceButton({ choice, index, onClick, disabled }) {
  const colorClass = `clay-btn clay-btn--${choice.key.toLowerCase()}`;
  const delayMs = index * 0.08;

  return (
    <motion.button
      className={colorClass}
      onClick={() => onClick(choice)}
      disabled={disabled}
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.35,
        delay: delayMs,
        ease: [0.34, 1.56, 0.64, 1], // bouncy
      }}
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.97, y: 2 }}
      style={{
        width: '100%',
        display: 'flex',
        gap: '8px',
        alignItems: 'flex-start',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-caveat)',
          fontWeight: 700,
          fontSize: '1.1rem',
          minWidth: '24px',
          opacity: 0.7,
        }}
      >
        {keyLabels[choice.key]}
      </span>
      <span>{choice.text}</span>
    </motion.button>
  );
}
