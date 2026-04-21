import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DreamGodAvatar } from './CharacterAvatar';
import GiftMessage from './GiftMessage';
import ShareCard from './ShareCard';
import { outro } from '../data/dialogueData';

/**
 * EndingScene — Displays after all 6 questions are answered
 * Shows ending title, child farewell dialogues (typewriter), god's gift, and outro
 */

const ENDING_STAGES = {
  TITLE: 'TITLE',
  CHILD_DIALOGUE: 'CHILD_DIALOGUE',
  GOD_RETURNS: 'GOD_RETURNS',
  GOD_DIALOGUE: 'GOD_DIALOGUE',
  GIFT: 'GIFT',
  OUTRO: 'OUTRO',
  SHARE: 'SHARE',
};

export default function EndingScene({ ending, innerScore, outerScore, onReset }) {
  const [stage, setStage] = useState(ENDING_STAGES.TITLE);
  const [childDialogueIndex, setChildDialogueIndex] = useState(0);
  const [godDialogueIndex, setGodDialogueIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Typewriter for child dialogue
  useEffect(() => {
    if (stage === ENDING_STAGES.CHILD_DIALOGUE) {
      const text = ending.childDialogue[childDialogueIndex];
      if (!text) return;

      setIsTyping(true);
      setTypedText('');
      let charIndex = 0;

      const interval = setInterval(() => {
        charIndex++;
        setTypedText(text.slice(0, charIndex));
        if (charIndex >= text.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 60);

      return () => clearInterval(interval);
    }
  }, [stage, childDialogueIndex, ending.childDialogue]);

  // Auto-advance from title
  useEffect(() => {
    if (stage === ENDING_STAGES.TITLE) {
      const timer = setTimeout(() => setStage(ENDING_STAGES.CHILD_DIALOGUE), 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleContinue = useCallback(() => {
    if (isTyping) return;

    switch (stage) {
      case ENDING_STAGES.CHILD_DIALOGUE: {
        if (childDialogueIndex < ending.childDialogue.length - 1) {
          setChildDialogueIndex((prev) => prev + 1);
        } else {
          setStage(ENDING_STAGES.GOD_RETURNS);
          setTimeout(() => setStage(ENDING_STAGES.GOD_DIALOGUE), 1500);
        }
        break;
      }
      case ENDING_STAGES.GOD_DIALOGUE: {
        if (godDialogueIndex < ending.godDialogue.length - 1) {
          setGodDialogueIndex((prev) => prev + 1);
        } else {
          setStage(ENDING_STAGES.GIFT);
        }
        break;
      }
      case ENDING_STAGES.GIFT:
        setStage(ENDING_STAGES.OUTRO);
        break;
      case ENDING_STAGES.OUTRO:
        setStage(ENDING_STAGES.SHARE);
        break;
      default:
        break;
    }
  }, [stage, isTyping, childDialogueIndex, godDialogueIndex, ending]);

  return (
    <div
      className={ending.className}
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        cursor: stage !== ENDING_STAGES.SHARE ? 'pointer' : 'default',
      }}
      onClick={stage !== ENDING_STAGES.SHARE ? handleContinue : undefined}
    >
      <div
        style={{
          maxWidth: '580px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <AnimatePresence mode="wait">
          {/* Stage: Title */}
          {stage === ENDING_STAGES.TITLE && (
            <motion.div
              key="title"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <motion.div
                style={{
                  fontFamily: 'var(--font-caveat)',
                  fontSize: '1rem',
                  color: 'var(--color-pencil-light)',
                  marginBottom: '8px',
                  letterSpacing: '2px',
                }}
              >
                ENDING {ending.number}
              </motion.div>
              <motion.h1
                style={{
                  fontFamily: 'var(--font-caveat)',
                  fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                  color: 'var(--color-pencil)',
                  margin: '0 0 12px',
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {ending.title}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.5 }}
                style={{
                  fontFamily: 'var(--font-special)',
                  fontSize: '1.2rem',
                  color: 'var(--color-pencil-light)',
                }}
              >
                {ending.titleEN}
              </motion.div>
            </motion.div>
          )}

          {/* Stage: Child Dialogue */}
          {stage === ENDING_STAGES.CHILD_DIALOGUE && (
            <motion.div
              key={`child-${childDialogueIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              style={{ minHeight: '120px' }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-caveat)',
                  fontSize: '0.9rem',
                  color: 'var(--color-child)',
                  marginBottom: '16px',
                }}
              >
                เด็กน้อย
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-noto)',
                  fontSize: '1.2rem',
                  lineHeight: 2,
                  color: 'var(--color-pencil)',
                  margin: 0,
                }}
              >
                {typedText}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    style={{
                      display: 'inline-block',
                      width: '2px',
                      height: '1.2em',
                      background: 'var(--color-child)',
                      marginLeft: '2px',
                      verticalAlign: 'text-bottom',
                    }}
                  />
                )}
              </p>
              {!isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    fontFamily: 'var(--font-caveat)',
                    fontSize: '0.85rem',
                    color: 'var(--color-smudge)',
                    marginTop: '24px',
                  }}
                >
                  แตะเพื่อดำเนินเรื่อง
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Stage: God Returns */}
          {stage === ENDING_STAGES.GOD_RETURNS && (
            <motion.div
              key="god-returns"
              initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1 }}
              style={{ padding: '40px 0' }}
            >
              <DreamGodAvatar animate={true} />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.5 }}
                style={{
                  fontFamily: 'var(--font-special)',
                  color: 'var(--color-dream)',
                  marginTop: '12px',
                  fontSize: '0.9rem',
                }}
              >
                [ เทพแห่งความฝันกลับมา... ]
              </motion.p>
            </motion.div>
          )}

          {/* Stage: God Dialogue */}
          {stage === ENDING_STAGES.GOD_DIALOGUE && (
            <motion.div
              key={`god-${godDialogueIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              style={{ minHeight: '120px' }}
            >
              <DreamGodAvatar animate={true} />
              <div
                style={{
                  fontFamily: 'var(--font-caveat)',
                  fontSize: '0.9rem',
                  color: 'var(--color-dream)',
                  margin: '16px 0',
                }}
              >
                เทพแห่งความฝัน
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-noto)',
                  fontSize: '1.1rem',
                  lineHeight: 2,
                  color: 'var(--color-pencil)',
                  margin: 0,
                  fontStyle: 'italic',
                }}
              >
                {ending.godDialogue[godDialogueIndex]}
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.8 }}
                style={{
                  fontFamily: 'var(--font-caveat)',
                  fontSize: '0.85rem',
                  color: 'var(--color-smudge)',
                  marginTop: '24px',
                }}
              >
                แตะเพื่อดำเนินเรื่อง
              </motion.div>
            </motion.div>
          )}

          {/* Stage: Gift */}
          {stage === ENDING_STAGES.GIFT && (
            <motion.div
              key="gift"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GiftMessage
                gift={ending.gift}
                emoji={ending.giftEmoji}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 3 }}
                style={{
                  fontFamily: 'var(--font-caveat)',
                  fontSize: '0.85rem',
                  color: 'var(--color-smudge)',
                  marginTop: '16px',
                }}
              >
                แตะเพื่อดำเนินเรื่อง
              </motion.div>
            </motion.div>
          )}

          {/* Stage: Outro */}
          {stage === ENDING_STAGES.OUTRO && (
            <motion.div
              key="outro"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              style={{ padding: '40px 0' }}
            >
              <motion.div
                style={{
                  width: '60px',
                  height: '2px',
                  background: 'var(--color-smudge)',
                  margin: '0 auto 32px',
                }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-noto)',
                  fontSize: '1.15rem',
                  lineHeight: 2.2,
                  color: 'var(--color-pencil)',
                  fontWeight: 500,
                }}
              >
                {outro.text}
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1 }}
                style={{
                  fontFamily: 'var(--font-noto)',
                  fontSize: '0.95rem',
                  color: 'var(--color-pencil-light)',
                  marginTop: '20px',
                  lineHeight: 1.8,
                }}
              >
                {outro.subtext}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 2 }}
                style={{
                  fontFamily: 'var(--font-caveat)',
                  fontSize: '0.85rem',
                  color: 'var(--color-smudge)',
                  marginTop: '32px',
                }}
              >
                แตะเพื่อดูผลลัพธ์
              </motion.div>
            </motion.div>
          )}

          {/* Stage: Share */}
          {stage === ENDING_STAGES.SHARE && (
            <motion.div
              key="share"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <ShareCard
                ending={ending}
                innerScore={innerScore}
                outerScore={outerScore}
                onReset={onReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
