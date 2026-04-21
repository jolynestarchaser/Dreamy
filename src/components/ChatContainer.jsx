import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DialogueBox from './DialogueBox';
import ChoiceButton from './ChoiceButton';
import ProgressDots from './ProgressDots';
import { DreamGodAvatar, ChildAvatar } from './CharacterAvatar';
import { questions } from '../data/dialogueData';

/**
 * ChatContainer — Main game view
 * Renders character avatars, scrollable chat history, and choice buttons
 */
export default function ChatContainer({
  state,
  phase,
  PHASES,
  onAdvanceDialogue,
  onSelectChoice,
  onNextQuestion,
}) {
  const chatEndRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [state.history.length, state.showChoices]);

  const showGod =
    state.phase === PHASES.INTRO && state.sceneIndex === 0;
  const showChild =
    state.phase !== PHASES.ENDING_TRANSITION && state.phase !== PHASES.ENDING;
  const currentQuestion =
    state.phase === PHASES.QUESTION ? questions[state.questionIndex] : null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        maxWidth: '680px',
        margin: '0 auto',
        padding: '0 16px',
        position: 'relative',
      }}
    >
      {/* Character Avatars */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: '24px',
          padding: '24px 0 8px',
          minHeight: '140px',
        }}
      >
        <AnimatePresence>
          {showGod && (
            <motion.div
              key="god-avatar"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
              transition={{ duration: 0.8 }}
            >
              <DreamGodAvatar />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showChild && state.phase !== PHASES.INTRO && (
            <motion.div
              key="child-avatar"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
              transition={{ duration: 0.8 }}
            >
              <ChildAvatar />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Dots */}
      {(state.phase === PHASES.QUESTION ||
        state.phase === PHASES.CHILD_RESPONSE) && (
        <ProgressDots current={state.questionIndex} total={6} />
      )}

      {/* Chat History */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {state.history.map((msg, i) => (
          <DialogueBox
            key={msg.id}
            speaker={msg.speaker}
            text={msg.text}
            delay={i === state.history.length - 1 ? 0.1 : 0}
          />
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* Action Area */}
      <div style={{ padding: '0 0 24px', flexShrink: 0 }}>
        {/* Intro: tap to continue */}
        {state.phase === PHASES.INTRO && (
          <motion.button
            onClick={onAdvanceDialogue}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              width: '100%',
              padding: '14px',
              background: 'transparent',
              border: '2px dashed var(--color-smudge)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontFamily: 'var(--font-caveat)',
              fontSize: '1.1rem',
              color: 'var(--color-pencil-light)',
              transition: 'border-color 0.3s, color 0.3s',
            }}
            whileHover={{
              borderColor: 'var(--color-dream)',
              color: 'var(--color-dream)',
            }}
          >
            แตะเพื่อดำเนินเรื่อง...
          </motion.button>
        )}

        {/* Question: show choices */}
        <AnimatePresence>
          {state.phase === PHASES.QUESTION && state.showChoices && currentQuestion && (
            <motion.div
              key="choices"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '10px',
              }}
            >
              {currentQuestion.choices.map((choice, i) => (
                <ChoiceButton
                  key={choice.key}
                  choice={choice}
                  index={i}
                  onClick={onSelectChoice}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Child response: tap to continue */}
        {state.phase === PHASES.CHILD_RESPONSE && (
          <motion.button
            onClick={onNextQuestion}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              width: '100%',
              padding: '14px',
              background: 'transparent',
              border: '2px dashed var(--color-child)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontFamily: 'var(--font-caveat)',
              fontSize: '1.1rem',
              color: 'var(--color-child)',
              transition: 'all 0.3s',
            }}
            whileHover={{ background: 'var(--color-child-glow)' }}
          >
            ดำเนินเรื่องต่อ...
          </motion.button>
        )}

        {/* Ending transition: auto-proceed */}
        {state.phase === PHASES.ENDING_TRANSITION && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{ textAlign: 'center', padding: '20px' }}
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                fontFamily: 'var(--font-caveat)',
                color: 'var(--color-dream)',
                fontSize: '1.1rem',
              }}
            >
              ● ● ●
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
