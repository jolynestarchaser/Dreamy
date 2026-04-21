import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameEngine } from './hooks/useGameEngine';
import ChatContainer from './components/ChatContainer';
import EndingScene from './components/EndingScene';
import { DreamGodAvatar } from './components/CharacterAvatar';

/**
 * App — Dream Game main component
 * Three phases: TITLE → INTRO/GAME → ENDING
 */
function App() {
  const {
    state,
    PHASES,
    startGame,
    advanceDialogue,
    selectChoice,
    nextQuestion,
    showEnding,
    resetGame,
  } = useGameEngine();

  const [showTitle, setShowTitle] = useState(true);
  const [titleFading, setTitleFading] = useState(false);

  // Handle ending transition
  useEffect(() => {
    if (state.phase === PHASES.ENDING_TRANSITION) {
      const timer = setTimeout(() => {
        showEnding();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.phase, PHASES.ENDING_TRANSITION, showEnding]);

  const handleStartGame = useCallback(() => {
    setTitleFading(true);
    setTimeout(() => {
      setShowTitle(false);
      startGame();
    }, 800);
  }, [startGame]);

  const handleReset = useCallback(() => {
    resetGame();
    setShowTitle(true);
    setTitleFading(false);
  }, [resetGame]);

  // ─── Title Screen ───
  if (showTitle) {
    return (
      <motion.div
        animate={{ opacity: titleFading ? 0 : 1 }}
        transition={{ duration: 0.8 }}
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Floating particles background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(i) * 20, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                width: `${4 + (i % 4) * 2}px`,
                height: `${4 + (i % 4) * 2}px`,
                borderRadius: '50%',
                background:
                  i % 3 === 0
                    ? 'var(--color-dream-light)'
                    : i % 3 === 1
                      ? 'var(--color-child-light)'
                      : 'var(--color-longing-light)',
                top: `${10 + (i * 7) % 80}%`,
                left: `${5 + (i * 13) % 90}%`,
              }}
            />
          ))}
        </div>

        {/* Dream God Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <DreamGodAvatar animate={true} />
        </motion.div>

        {/* Moon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ fontSize: '2.5rem', marginTop: '16px' }}
        >
          🌙
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{
            fontFamily: 'var(--font-caveat)',
            fontSize: 'clamp(3rem, 10vw, 5rem)',
            fontWeight: 700,
            color: 'var(--color-pencil)',
            margin: '16px 0 4px',
            lineHeight: 1.1,
          }}
        >
          เกมแห่งความฝัน
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          style={{
            fontFamily: 'var(--font-special)',
            fontSize: 'clamp(1rem, 3vw, 1.3rem)',
            color: 'var(--color-pencil-light)',
            margin: '0 0 8px',
            letterSpacing: '2px',
          }}
        >
          DREAM GAME
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{
            fontFamily: 'var(--font-noto)',
            fontSize: '0.9rem',
            color: 'var(--color-pencil-light)',
            maxWidth: '380px',
            lineHeight: 1.7,
            margin: '16px 0 40px',
          }}
        >
          ถ้าคุณได้พูดคุยกับตัวเองตอนเด็ก
          <br />
          คุณจะบอกอะไรกับเขา?
        </motion.p>

        {/* Start Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95, y: 2 }}
          onClick={handleStartGame}
          style={{
            padding: '16px 48px',
            background:
              'linear-gradient(135deg, var(--color-dream-light), var(--color-dream))',
            color: 'white',
            border: 'none',
            borderRadius: '24px 8px 24px 8px',
            fontFamily: 'var(--font-noto)',
            fontSize: '1.1rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '4px 4px 0 rgba(155, 114, 207, 0.3)',
            letterSpacing: '1px',
          }}
        >
          เริ่มต้นความฝัน
        </motion.button>

        {/* Subtle hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ duration: 0.8, delay: 2 }}
          style={{
            fontFamily: 'var(--font-caveat)',
            fontSize: '0.85rem',
            color: 'var(--color-smudge)',
            marginTop: '24px',
          }}
        >
          6 คำถาม · 6 ตอนจบ · ไม่มีคำตอบที่ผิด
        </motion.p>
      </motion.div>
    );
  }

  // ─── Ending Scene ───
  if (state.phase === PHASES.ENDING) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <EndingScene
            ending={state.ending}
            innerScore={state.innerScore}
            outerScore={state.outerScore}
            onReset={handleReset}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  // ─── Game (Intro + Questions) ───
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ChatContainer
          state={state}
          phase={state.phase}
          PHASES={PHASES}
          onAdvanceDialogue={advanceDialogue}
          onSelectChoice={selectChoice}
          onNextQuestion={nextQuestion}
        />
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
