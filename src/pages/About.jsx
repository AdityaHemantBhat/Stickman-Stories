import { motion } from 'framer-motion';
import styles from './About.module.css';

/**
 * About page — creator's story as vertical timeline.
 * Styled as torn notebook pages stacked and slightly fanned.
 * Phase 3 will add: GSAP scroll-pinned page flip animation.
 */
export default function About() {
  const milestones = [
    { year: 'July 02, 2026', title: 'The First Doodle', text: 'Tired of writing code and debugging programs, a computer engineer decides to sketch a simple stickman on a drawing tablet. No complicated software—just a figure, an idea, and the very first commit.' },
    { year: 'July 03, 2026', title: 'First Video Uploaded', text: 'The first short goes live on YouTube! A simple story about life, choices, and moms rules. It turns out, animating frame-by-frame is a lot more work than coding!' },
    { year: 'Ongoing', title: 'The Story Continues', text: 'You are here, watching the stories and exploring the doodles. The stylus is active, new ideas are constantly loading, and the next frame is waiting to be drawn.' },
  ];

  return (
    <div className={styles.about} data-page="about">
      <header className={styles.header}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 20, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          About
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          The story behind the stories.
        </motion.p>
      </header>

      <div className={styles.timeline}>
        {milestones.map((milestone, i) => (
          <motion.div
            key={i}
            className={styles.page}
            style={{ rotate: `${(i % 2 === 0 ? -1 : 1) * (1 + Math.random())}deg` }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <span className={styles.pageYear}>{milestone.year}</span>
            <h3 className={styles.pageTitle}>{milestone.title}</h3>
            <p className={styles.pageText}>{milestone.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
