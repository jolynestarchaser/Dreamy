import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

/**
 * ShareCard — Result card that can be saved as image for sharing
 * Contains a styled card area (captured for image) and action buttons
 */
export default function ShareCard({ ending, innerScore, outerScore, onReset }) {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const cardRef = useRef(null);

  const handleSaveImage = useCallback(async () => {
    if (!cardRef.current || isSaving) return;

    setIsSaving(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#F5F0E8',
        scale: 2, // high-res output
        useCORS: true,
        logging: false,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      });

      const fileName = `dream-game-${ending.titleEN.toLowerCase().replace(/\s+/g, '-')}.png`;

      // Convert canvas to Blob (better Safari support than dataURL)
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );

      if (!blob) throw new Error('Failed to create image blob');

      // Strategy 1: Try Web Share API (works great on iOS Safari)
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], fileName, { type: 'image/png' });
        const shareData = { files: [file] };

        if (navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            return;
          } catch (shareErr) {
            // User cancelled share or share failed — fall through to other methods
            if (shareErr.name === 'AbortError') {
              // User cancelled, don't show error
              return;
            }
          }
        }
      }

      // Strategy 2: Blob URL download (works on Chrome, Firefox, desktop Safari)
      const blobUrl = URL.createObjectURL(blob);

      // Detect Safari (but not Chrome on iOS which reports as Safari)
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

      if (isSafari) {
        // Safari: open image in new tab — user can long-press / right-click to save
        const newTab = window.open(blobUrl, '_blank');
        if (!newTab) {
          // Popup blocked — fallback to navigating current page
          // This is a last resort; the user can press back to return
          window.location.href = blobUrl;
        }
      } else {
        // Chrome / Firefox: standard download via anchor
        const link = document.createElement('a');
        link.download = fileName;
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Clean up blob URL after a short delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save image:', err);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, ending.titleEN]);

  return (
    <div
      style={{
        maxWidth: '440px',
        margin: '0 auto',
        padding: '20px',
      }}
    >
      {/* ═══ Capturable Card Area ═══ */}
      <div
        ref={cardRef}
        style={{
          background: 'linear-gradient(180deg, #FDF8F0 0%, #F5F0E8 50%, #EDE6D8 100%)',
          borderRadius: '20px',
          padding: '36px 28px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative border */}
        <div
          style={{
            position: 'absolute',
            inset: '8px',
            border: '2px dashed rgba(196, 191, 182, 0.5)',
            borderRadius: '14px',
            pointerEvents: 'none',
          }}
        />

        {/* Corner marks */}
        <div style={{ position: 'absolute', top: '14px', left: '14px', width: '14px', height: '14px', borderTop: '2px solid #C4BFB6', borderLeft: '2px solid #C4BFB6', opacity: 0.6 }} />
        <div style={{ position: 'absolute', top: '14px', right: '14px', width: '14px', height: '14px', borderTop: '2px solid #C4BFB6', borderRight: '2px solid #C4BFB6', opacity: 0.6 }} />
        <div style={{ position: 'absolute', bottom: '14px', left: '14px', width: '14px', height: '14px', borderBottom: '2px solid #C4BFB6', borderLeft: '2px solid #C4BFB6', opacity: 0.6 }} />
        <div style={{ position: 'absolute', bottom: '14px', right: '14px', width: '14px', height: '14px', borderBottom: '2px solid #C4BFB6', borderRight: '2px solid #C4BFB6', opacity: 0.6 }} />

        {/* Header */}
        <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🌙</div>
        <div
          style={{
            fontFamily: "'Special Elite', monospace",
            fontSize: '0.75rem',
            color: '#8B8B8B',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '2px',
          }}
        >
          Dream Game
        </div>
        <div
          style={{
            fontFamily: "'Noto Serif Thai', serif",
            fontSize: '0.8rem',
            color: '#8B8B8B',
            marginBottom: '20px',
          }}
        >
          เกมแห่งความฝัน
        </div>

        {/* Divider */}
        <div
          style={{
            width: '40px',
            height: '1px',
            background: '#C4BFB6',
            margin: '0 auto 20px',
          }}
        />

        {/* Ending Emoji */}
        <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>
          {ending.giftEmoji}
        </div>

        {/* Ending Title (Thai) */}
        <div
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '2.4rem',
            fontWeight: 700,
            color: '#2C2C2C',
            lineHeight: 1.2,
            marginBottom: '4px',
          }}
        >
          {ending.title}
        </div>

        {/* Ending Title (EN) */}
        <div
          style={{
            fontFamily: "'Special Elite', monospace",
            fontSize: '1rem',
            color: '#8B8B8B',
            marginBottom: '20px',
            letterSpacing: '1px',
          }}
        >
          {ending.titleEN}
        </div>

        {/* Gift Quote */}
        <div
          style={{
            fontFamily: "'Noto Serif Thai', serif",
            fontSize: '0.88rem',
            color: '#2C2C2C',
            lineHeight: 1.8,
            fontStyle: 'italic',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '12px',
            border: '1px solid rgba(196, 191, 182, 0.3)',
          }}
        >
          "{ending.gift}"
        </div>

        {/* Score Section */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            marginTop: '20px',
            padding: '14px 0 4px',
            borderTop: '1px dashed rgba(196, 191, 182, 0.5)',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '0.75rem',
                color: '#9B72CF',
                letterSpacing: '1px',
                marginBottom: '2px',
              }}
            >
              Inner
            </div>
            <div
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#9B72CF',
              }}
            >
              {innerScore}
            </div>
          </div>
          <div
            style={{
              width: '1px',
              background: 'rgba(196, 191, 182, 0.5)',
              alignSelf: 'stretch',
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '0.75rem',
                color: '#5B9BD5',
                letterSpacing: '1px',
                marginBottom: '2px',
              }}
            >
              Outer
            </div>
            <div
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#5B9BD5',
              }}
            >
              {outerScore}
            </div>
          </div>
        </div>

        {/* Footer watermark */}
        <div
          style={{
            fontFamily: "'Special Elite', monospace",
            fontSize: '0.6rem',
            color: '#C4BFB6',
            marginTop: '16px',
            letterSpacing: '2px',
          }}
        >
          dreamy.app
        </div>
      </div>

      {/* ═══ Action Buttons (outside capturable area) ═══ */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginTop: '24px',
        }}
      >
        {/* Save Image */}
        <motion.button
          onClick={handleSaveImage}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%',
            padding: '16px 20px',
            background: isSaving
              ? 'linear-gradient(135deg, #C4A6E8, #9B72CF)'
              : saved
                ? 'linear-gradient(135deg, #A8DCA9, #7BC47F)'
                : 'linear-gradient(135deg, #C4A6E8, #9B72CF)',
            color: 'white',
            border: 'none',
            borderRadius: '14px 4px 14px 4px',
            fontFamily: 'var(--font-noto)',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: isSaving ? 'wait' : 'pointer',
            boxShadow: '3px 3px 0 rgba(155, 114, 207, 0.3)',
            transition: 'background 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {isSaving ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block' }}
              >
                ⏳
              </motion.span>
              กำลังสร้างรูป...
            </>
          ) : saved ? (
            '✅ บันทึกรูปเรียบร้อย!'
          ) : (
            '📸 บันทึกรูปเพื่อแชร์'
          )}
        </motion.button>

        {/* Play Again */}
        <motion.button
          onClick={onReset}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%',
            padding: '14px 20px',
            background: 'transparent',
            color: 'var(--color-pencil-light)',
            border: '2px dashed var(--color-smudge)',
            borderRadius: '4px 14px 4px 14px',
            fontFamily: 'var(--font-noto)',
            fontSize: '0.95rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
        >
          🔄 เล่นอีกครั้ง
        </motion.button>
      </div>
    </div>
  );
}
