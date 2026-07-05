import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const [isTouch, setIsTouch] = useState(false);
  const [cursorType, setCursorType] = useState('default'); // default | link | play | grab | text
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring-based following for natural lag
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Detect touch device
    const touchQuery = window.matchMedia('(pointer: coarse)');
    setIsTouch(touchQuery.matches);
    const touchHandler = (e) => setIsTouch(e.matches);
    touchQuery.addEventListener('change', touchHandler);

    if (touchQuery.matches) return () => touchQuery.removeEventListener('change', touchHandler);

    const onMouseMove = (e) => {
      setIsVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onMouseDown = () => setIsPressed(true);
    const onMouseUp = () => setIsPressed(false);

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    // Detect interactive element hover types
    const onMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        setCursorType(target.dataset.cursor);
      } else if (e.target.closest('input, textarea, [contenteditable="true"]')) {
        setCursorType('text');
      } else if (e.target.closest('a, button, [role="button"]')) {
        setCursorType('link');
      } else {
        setCursorType('default');
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', onMouseOver);
      touchQuery.removeEventListener('change', touchHandler);
    };
  }, [cursorX, cursorY]);

  if (isTouch) return null;

  return (
    <motion.div
      className={styles.cursor}
      style={{ x, y }}
      animate={{
        scale: isPressed ? 0.8 : 1,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 400 }}
    >
      <AnimatePresence mode="wait">
        {cursorType === 'default' && (
          <motion.svg
            key="default"
            className={styles.defaultIcon}
            viewBox="0 0 24 24"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          >
            {/* Hand-drawn arrow pointing top-left */}
            <path
              d="M4.5 4.5 L11.5 20.5 L13.5 13.5 L20.5 11.5 Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
        {cursorType === 'link' && (
          <motion.svg
            key="link"
            className={styles.centerIcon}
            viewBox="0 0 24 24"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          >
            <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8 L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 12 L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </motion.svg>
        )}
        {cursorType === 'play' && (
          <motion.svg
            key="play"
            className={styles.centerIcon}
            viewBox="0 0 24 24"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          >
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="10,7 18,12 10,17" fill="currentColor" />
          </motion.svg>
        )}
        {cursorType === 'grab' && (
          <motion.svg
            key="grab"
            className={styles.centerIcon}
            viewBox="0 0 24 24"
            initial={{ scale: 0 }}
            animate={{ scale: 1.2 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          >
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
          </motion.svg>
        )}
        {cursorType === 'text' && (
          <motion.svg
            key="text"
            className={styles.centerIcon}
            viewBox="0 0 24 24"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          >
            {/* Blinking red text cursor (I-beam) */}
            <path
              d="M9 4 L15 4 M12 4 L12 20 M9 20 L15 20"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className={styles.blinkingLine}
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
