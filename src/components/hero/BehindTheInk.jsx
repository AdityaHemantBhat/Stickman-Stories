import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './BehindTheInk.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Chapter 3 — Behind the Ink
 * Wipe reveal effect from polished frame to rough sketch.
 */
export default function BehindTheInk() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  // Framer Motion parallax for floating elements
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-30, 80]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Pin the section and wipe the overlay to reveal the "sketch" underneath
      gsap.to(`.${styles.polishedLayer}`, {
        clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} id="behind-the-ink">
      <div className={styles.stickyContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Behind the Ink</h2>
        <p className={styles.subtitle}>Every polished frame starts as a messy thought.</p>
      </div>

      <div ref={containerRef} className={styles.revealContainer}>
        {/* Base Layer — The Rough Sketch (Revealed) */}
        <div className={`${styles.layer} ${styles.sketchLayer}`}>
          <div className={styles.contentWrap}>
            <img 
              src="/thumbnails/ep01.png" 
              alt="Rough sketch" 
              className={styles.layerImage} 
              style={{ filter: 'grayscale(100%) contrast(150%) opacity(0.6)' }}
            />
            <div className={styles.sketchNotes}>
              <p>Scene 4: Add more contrast</p>
              <p>Wanderer needs to look isolated</p>
              <svg viewBox="0 0 100 50" className={styles.handDrawnArrow}>
                <path d="M10 40 Q50 10, 90 30 M80 20 L90 30 L75 35" fill="none" stroke="var(--accent-red)" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Top Layer — The Polished Frame (Wiped away) */}
        <div className={`${styles.layer} ${styles.polishedLayer}`}>
          <div className={styles.contentWrap}>
            <img 
              src="/thumbnails/ep01.png" 
              alt="Polished frame" 
              className={styles.layerImage} 
            />
            <div className={styles.polishedUI}>
              <span className={styles.renderBadge}>Final Render / EP01</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating doodles */}
      <motion.img 
        src="/favicon.svg" 
        className={styles.doodle1}
        style={{ y: y1 }}
        alt=""
        aria-hidden="true"
      />
      <motion.div 
        className={styles.doodle2}
        style={{ y: y2 }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke="var(--ink-faint)" strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      </motion.div>
      </div>
    </section>
  );
}
