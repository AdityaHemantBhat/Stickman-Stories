import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '../../utils/audio';
import styles from './Nav.module.css';

/**
 * Navigation — NOT a standard horizontal navbar.
 * Styled as notebook tab dividers poking out from the right edge of the page.
 * Each tab is slightly rotated, hand-labeled in Caveat font.
 *
 * FRAMER MOTION DOMAIN: Hover/tap micro-interactions, mobile menu toggle.
 */

const routes = [
  { 
    path: '/', 
    label: 'Home', 
    icon: (
      <svg viewBox="0 0 24 24" className={styles.doodleIcon} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M3 11 Q12 3 21 11" />
        <path d="M5 10 L5 20 Q12 21 19 20 L19 10" />
        <path d="M10 20 L10 14 Q12 13 14 14 L14 20" />
      </svg>
    )
  },
  { 
    path: '/episodes', 
    label: 'Episodes', 
    icon: (
      <svg viewBox="0 0 24 24" className={styles.doodleIcon} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M3 8 Q12 6 21 8 L21 20 Q12 22 3 20 Z" />
        <path d="M6 10 L15 10 L15 18 L6 18 Z" strokeWidth="1.5" />
        <path d="M9 3 L12 8 L15 3" />
        <circle cx="18" cy="11" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="18" cy="14" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    )
  },
  { 
    path: '/universe', 
    label: 'Universe', 
    icon: (
      <svg viewBox="0 0 24 24" className={styles.doodleIcon} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 Q12.5 9.5 20 10 Q12.5 10.5 12 18 Q11.5 10.5 4 10 Q11.5 9.5 12 2 Z" />
        <path d="M3 15 Q12 20 21 15" strokeWidth="1.5" strokeDasharray="3 2" />
      </svg>
    )
  },
  { 
    path: '/about', 
    label: 'About', 
    icon: (
      <svg viewBox="0 0 24 24" className={styles.doodleIcon} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M5 3 L14 3 L19 8 L19 21 L5 21 Z" />
        <path d="M13 3 L13 8 L19 8" />
        <line x1="8" y1="12" x2="16" y2="12" strokeWidth="2" />
        <line x1="8" y1="16" x2="14" y2="16" strokeWidth="2" />
      </svg>
    )
  },
  { 
    path: '/community', 
    label: 'Community', 
    icon: (
      <svg viewBox="0 0 24 24" className={styles.doodleIcon} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        {/* Stickman left */}
        <circle cx="8" cy="7" r="2.8" />
        <line x1="8" y1="10" x2="8" y2="16" />
        <line x1="8" y1="12" x2="11" y2="13" />
        <polyline points="5 21 8 16 11 21" />
        {/* Stickman right */}
        <circle cx="16" cy="7" r="2.8" />
        <line x1="16" y1="10" x2="16" y2="16" />
        <line x1="16" y1="12" x2="11" y2="13" />
        <polyline points="13 21 16 16 19 21" />
      </svg>
    )
  },
];

// Deterministic rotation per tab for hand-placed feel
const tabRotations = [1.5, -0.8, 1.2, -1.5, 0.7];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSoundEnabled(audioManager.isEnabled());
  }, []);

  const handleToggleSound = () => {
    const newState = audioManager.toggle();
    setSoundEnabled(newState);
  };

  return (
    <>
      {/* Desktop: Tab dividers on right edge */}
      <nav className={styles.nav} aria-label="Main navigation">
        <div className={styles.tabsDesktop}>
          {routes.map((route, i) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                `${styles.tab} ${isActive ? styles.active : ''}`
              }
              data-cursor="link"
            >
              <motion.div
                className={styles.tabInner}
                style={{ rotate: tabRotations[i] }}
                whileHover={{
                  x: -12,
                  rotate: 0,
                  transition: { type: 'spring', stiffness: 400, damping: 20 },
                }}
                onMouseEnter={() => audioManager.playTap()}
                whileTap={{ scale: 0.95 }}
              >
                <span className={styles.tabLabel}>{route.label}</span>
              </motion.div>
            </NavLink>
          ))}
        </div>

        {/* Logo / Home link — top left, doodled */}
        <NavLink to="/" className={styles.logo} data-cursor="link">
          <motion.div
            whileHover={{ rotate: [0, -5, 5, -3, 0], transition: { duration: 0.5 } }}
          >
            <svg viewBox="0 0 40 40" className={styles.logoSvg}>
              {/* Simple stickman head */}
              <circle cx="20" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="2.5" />
              {/* Body */}
              <line x1="20" y1="19" x2="20" y2="30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              {/* Arms */}
              <line x1="12" y1="23" x2="28" y2="23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              {/* Legs */}
              <line x1="20" y1="30" x2="14" y2="38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="20" y1="30" x2="26" y2="38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </motion.div>
        </NavLink>

        {/* Sound Effects Toggle Button */}
        <motion.button
          className={styles.soundToggle}
          onClick={handleToggleSound}
          whileHover={{ scale: 1.15, rotate: [0, -6, 6, -3, 0] }}
          whileTap={{ scale: 0.9 }}
          data-cursor="link"
          aria-label="Toggle Sound Effects"
        >
          <svg viewBox="0 0 24 24" className={styles.soundIcon} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {soundEnabled ? (
              <>
                <path d="M11 5 L6 9 H2 V15 H6 L11 19 Z" />
                <path d="M15.5 8.5 A 5 5 0 0 1 15.5 15.5" />
                <path d="M19 6 A 9 9 0 0 1 19 18" />
              </>
            ) : (
              <>
                <path d="M11 5 L6 9 H2 V15 H6 L11 19 Z" />
                <line x1="16" y1="9" x2="22" y2="15" />
                <line x1="22" y1="9" x2="16" y2="15" />
              </>
            )}
          </svg>
        </motion.button>

        {/* Mobile hamburger — notebook cover flip */}
        <motion.button
          className={styles.hamburger}
          onClick={() => {
            const nextState = !mobileOpen;
            setMobileOpen(nextState);
            if (nextState) {
              audioManager.playTear();
            }
          }}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <motion.span
            className={styles.hamburgerLine}
            animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
          />
          <motion.span
            className={styles.hamburgerLine}
            animate={mobileOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
          />
          <motion.span
            className={styles.hamburgerLine}
            animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
          />
        </motion.button>
      </nav>

      {/* Mobile backdrop dim overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile menu notebook overlay sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileOverlay}
            initial={{ x: '100%', rotate: 8 }}
            animate={{ x: 0, rotate: 0 }}
            exit={{ x: '100%', rotate: 8 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          >
            {/* Binder spiral ring holes on the left margin */}
            <div className={styles.binderHoles}>
              {[...Array(9)].map((_, idx) => (
                <div key={idx} className={styles.binderHole} />
              ))}
            </div>

            {/* Vertical torn paper edge decoration on the left */}
            <div className={styles.verticalTornEdge}>
              <svg viewBox="0 0 20 100" preserveAspectRatio="none" className={styles.verticalTornSvg}>
                <path d="M20,0 L10,5 L20,10 L5,15 L20,20 L12,25 L20,30 L8,35 L20,40 L15,45 L20,50 L10,55 L20,60 L5,65 L20,70 L12,75 L20,80 L8,85 L20,90 L15,95 L20,100 Z" />
              </svg>
            </div>

            {/* wobbly Close Button inside the notebook sheet */}
            <button
              className={styles.closeBtn}
              onClick={() => {
                setMobileOpen(false);
                audioManager.playTear();
              }}
              aria-label="Close menu"
              data-cursor="link"
            >
              <svg viewBox="0 0 24 24" className={styles.closeIcon}>
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>

            <div className={styles.mobileLinks}>
              {routes.map((route, i) => (
                <motion.div
                  key={route.path}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, type: 'spring', stiffness: 200 }}
                  onMouseEnter={() => audioManager.playTap()}
                >
                  <NavLink
                    to={route.path}
                    className={({ isActive }) =>
                      `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className={styles.mobileLinkIcon}>{route.icon}</span>
                    <span className={styles.mobileLinkLabel}>{route.label}</span>
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
