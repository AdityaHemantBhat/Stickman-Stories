import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { audioManager } from '../../utils/audio';
import styles from './PageTransition.module.css';

/**
 * Page transition wrapper — simulates a page being torn out
 * and a new one sliding in on every route change.
 *
 * FRAMER MOTION DOMAIN: Route transitions are discrete UI state changes.
 * Uses AnimatePresence (called from App.jsx) for exit/enter orchestration.
 *
 * Variants:
 * - exit: page tears away (translateY up + slight rotate + fade + clip-path rip)
 * - enter: new page slides up from below with paper-flutter spring
 */

const pageVariants = {
  initial: {
    opacity: 0,
    y: 60,
    rotate: 0.5,
    filter: 'blur(2px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    rotate: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // ease-out-expo
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -80,
    rotate: -0.8,
    filter: 'blur(3px)',
    transition: {
      duration: 0.4,
      ease: [0.85, 0, 0.15, 1], // ease-in-out-circ
    },
  },
};

export default function PageTransition({ children }) {
  useEffect(() => {
    // Play paper tear sound effect on page transition mount
    audioManager.playTear();
  }, []);

  return (
    <motion.div
      className={styles.page}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Paper edge overlay — visible during transition */}
      <div className={styles.paperEdge} aria-hidden="true" />
      {children}
    </motion.div>
  );
}
