import { motion } from 'framer-motion';

/**
 * CharacterAvatar — SVG silhouette illustrations
 * Dream God: tall, wispy, purple with drift animation
 * Child: round, warm, yellow with bob animation
 */

export function DreamGodAvatar({ className = '', animate = true }) {
  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={animate ? { y: [0, -4, 2, 0], rotate: [0, 1, -1, 0] } : {}}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg
        width="80"
        height="120"
        viewBox="0 0 80 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="เทพแห่งความฝัน"
      >
        {/* Pencil texture filter */}
        <defs>
          <filter id="pencil-god">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="4"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="1.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <linearGradient id="god-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C4A6E8" />
            <stop offset="100%" stopColor="#9B72CF" />
          </linearGradient>
        </defs>

        {/* Body — tall wispy shape */}
        <path
          d="M40 15 C35 15 25 25 25 40 C25 55 28 70 30 85 C31 92 28 100 25 108 C28 112 35 115 40 115 C45 115 52 112 55 108 C52 100 49 92 50 85 C52 70 55 55 55 40 C55 25 45 15 40 15Z"
          fill="url(#god-gradient)"
          opacity="0.85"
          filter="url(#pencil-god)"
        />

        {/* Head — ethereal circle */}
        <circle
          cx="40"
          cy="18"
          r="12"
          fill="#C4A6E8"
          opacity="0.9"
          filter="url(#pencil-god)"
        />

        {/* Eyes — mysterious dots */}
        <circle cx="36" cy="17" r="1.5" fill="#2E3456" />
        <circle cx="44" cy="17" r="1.5" fill="#2E3456" />

        {/* Wispy tendrils */}
        <path
          d="M25 60 C18 55 12 60 15 70"
          stroke="#C4A6E8"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
          strokeLinecap="round"
        />
        <path
          d="M55 60 C62 55 68 60 65 70"
          stroke="#C4A6E8"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
          strokeLinecap="round"
        />

        {/* Floating particles */}
        <circle cx="20" cy="35" r="2" fill="#C4A6E8" opacity="0.3" />
        <circle cx="60" cy="30" r="1.5" fill="#C4A6E8" opacity="0.4" />
        <circle cx="15" cy="50" r="1" fill="#9B72CF" opacity="0.3" />
        <circle cx="65" cy="45" r="1.8" fill="#9B72CF" opacity="0.25" />
      </svg>
    </motion.div>
  );
}

export function ChildAvatar({ className = '', animate = true }) {
  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={animate ? { y: [0, -6, 0] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg
        width="70"
        height="90"
        viewBox="0 0 70 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="ตัวเราตอนเด็ก"
      >
        <defs>
          <filter id="pencil-child">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="4"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="1.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <linearGradient id="child-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F0D080" />
            <stop offset="100%" stopColor="#E8B84B" />
          </linearGradient>
        </defs>

        {/* Body — round, warm shape */}
        <path
          d="M35 30 C25 30 15 40 15 55 C15 65 20 72 25 78 C28 82 32 85 35 85 C38 85 42 82 45 78 C50 72 55 65 55 55 C55 40 45 30 35 30Z"
          fill="url(#child-gradient)"
          opacity="0.85"
          filter="url(#pencil-child)"
        />

        {/* Head — bigger, rounder (childlike proportions) */}
        <circle
          cx="35"
          cy="22"
          r="16"
          fill="#F0D080"
          opacity="0.9"
          filter="url(#pencil-child)"
        />

        {/* Hair tuft */}
        <path
          d="M30 8 C32 3 38 3 40 8"
          stroke="#C49530"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Eyes — big, curious */}
        <circle cx="30" cy="21" r="2.5" fill="#2C2C2C" />
        <circle cx="40" cy="21" r="2.5" fill="#2C2C2C" />
        {/* Eye highlights */}
        <circle cx="31" cy="20" r="0.8" fill="white" />
        <circle cx="41" cy="20" r="0.8" fill="white" />

        {/* Smile */}
        <path
          d="M31 27 Q35 31 39 27"
          stroke="#2C2C2C"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Cheek blush */}
        <circle cx="25" cy="25" r="3" fill="#E87B9E" opacity="0.25" />
        <circle cx="45" cy="25" r="3" fill="#E87B9E" opacity="0.25" />

        {/* Sparkle */}
        <path
          d="M58 15 L60 12 L62 15 L65 17 L62 19 L60 22 L58 19 L55 17Z"
          fill="#E8B84B"
          opacity="0.5"
        />
      </svg>
    </motion.div>
  );
}
