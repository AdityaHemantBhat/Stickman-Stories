import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePerformanceTier } from '../../hooks/usePerformanceTier';
import InkCanvas from '../../webgl/InkCanvas';
import styles from './CommunityCTA.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Chapter 5 — Join the Story (Community CTA)
 * Interactive WebGL background with a large call to action.
 */
export default function CommunityCTA() {
  const sectionRef = useRef(null);
  const tier = usePerformanceTier();

  return (
    <section ref={sectionRef} className={styles.section} id="join">
      {/* Interactive Chalkboard / Ink background */}
      {/* We only render the interactive WebGL if performance tier allows */}
      {tier !== 'low' && (
        <div className={styles.webglWrapper}>
          <InkCanvas theme="chalkboard" interactive={true} className={styles.inkCanvas} />
        </div>
      )}

      {/* Dark overlay to ensure text is readable over the particles */}
      <div className={styles.overlay} />

      <div className={styles.content}>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          Pick up a pen.
        </motion.h2>

        <motion.p
          className={styles.body}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Join the community on Discord. Share fan art, theorize about the lore, and help shape the next chapter of the notebook.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.4, type: 'spring' }}
        >
          <Link to="/community" className={styles.ctaButton} data-cursor="link">
            <span className={styles.btnText}>Join Discord</span>
            <svg viewBox="0 0 24 24" className={styles.btnIcon}>
              <path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Rough sketch footer element */}
      <svg viewBox="0 0 1000 100" className={styles.footerSketch} preserveAspectRatio="none">
        <path d="M0 50 Q250 80, 500 40 T1000 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
        <path d="M0 60 Q200 40, 500 70 T1000 60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
      </svg>
    </section>
  );
}
