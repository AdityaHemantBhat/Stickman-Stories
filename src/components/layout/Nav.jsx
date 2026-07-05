import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Nav.module.css';

/**
 * Navigation — NOT a standard horizontal navbar.
 * Styled as notebook tab dividers poking out from the right edge of the page.
 * Each tab is slightly rotated, hand-labeled in Caveat font.
 *
 * FRAMER MOTION DOMAIN: Hover/tap micro-interactions, mobile menu toggle.
 */

const routes = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/episodes', label: 'Episodes', icon: '📺' },
  { path: '/universe', label: 'Universe', icon: '✦' },
  { path: '/about', label: 'About', icon: '✎' },
  { path: '/community', label: 'Community', icon: '♡' },
];

// Deterministic rotation per tab for hand-placed feel
const tabRotations = [1.5, -0.8, 1.2, -1.5, 0.7];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

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

        {/* Mobile hamburger — notebook cover flip */}
        <motion.button
          className={styles.hamburger}
          onClick={() => setMobileOpen(!mobileOpen)}
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

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileOverlay}
            initial={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 40px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.mobileLinks}>
              {routes.map((route, i) => (
                <motion.div
                  key={route.path}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, type: 'spring', stiffness: 200 }}
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
