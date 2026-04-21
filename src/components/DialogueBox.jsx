import { motion } from 'framer-motion';

/**
 * DialogueBox — A single message bubble in chat history
 * Supports speakers: god, child, player, narration
 */
export default function DialogueBox({ speaker, text, delay = 0 }) {
  const isNarration = speaker === 'narration';
  const isGod = speaker === 'god';
  const isChild = speaker === 'child';
  const isPlayer = speaker === 'player';

  const speakerNames = {
    god: 'เทพแห่งความฝัน',
    child: 'เด็กน้อย',
    player: 'คุณ',
  };

  const boxClass = isNarration
    ? 'dialog-box dialog-box--narration'
    : isGod
      ? 'dialog-box dialog-box--god'
      : isChild
        ? 'dialog-box dialog-box--child'
        : 'dialog-box';

  const nameplateClass = isGod
    ? 'nameplate nameplate--god'
    : isChild
      ? 'nameplate nameplate--child'
      : '';

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(8px)', y: 12 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      style={isPlayer ? { display: 'flex', justifyContent: 'flex-end' } : {}}
    >
      <div
        className={boxClass}
        style={
          isPlayer
            ? {
                background: 'linear-gradient(135deg, #f0f0e8, #e8e4d8)',
                borderStyle: 'solid',
                borderColor: '#d0ccc0',
                borderRadius: '4px 18px 4px 18px',
                marginLeft: 'auto',
              }
            : {}
        }
      >
        {!isNarration && !isPlayer && (
          <div className={nameplateClass}>{speakerNames[speaker]}</div>
        )}
        {isPlayer && (
          <div
            style={{
              fontFamily: 'var(--font-caveat)',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--color-pencil-light)',
              marginBottom: '4px',
              textAlign: 'right',
            }}
          >
            คุณ
          </div>
        )}
        <p
          style={{
            margin: 0,
            fontSize: isNarration ? '0.9rem' : '1rem',
            fontFamily: isNarration
              ? 'var(--font-special)'
              : 'var(--font-noto)',
            lineHeight: 1.7,
            color: isNarration
              ? 'var(--color-pencil-light)'
              : 'var(--color-pencil)',
          }}
        >
          {text}
        </p>
      </div>
    </motion.div>
  );
}
