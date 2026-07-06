import { motion } from 'framer-motion';
import styles from './Community.module.css';

/**
 * Community page — fan art wall, social embeds, fan theory form.
 * Phase 3 will add: WebGL hover distortion, typewriter form effect.
 */
export default function Community() {
  return (
    <div className={styles.community} data-page="community">
      <header className={styles.header}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 20, rotate: 1 }}
          animate={{ opacity: 1, y: 0, rotate: 1.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Community
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          The story is bigger than one pen.
        </motion.p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Fan Art Wall</h2>
        <div className={styles.artWall}>
          <p className={styles.placeholder}>Fan art masonry wall coming in Phase 3...</p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Share Your Theory</h2>
        <div className={styles.formWrap}>
          <p className={styles.placeholder}>Typewriter-style fan theory form coming in Phase 3...</p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Join the Conversation</h2>
        <div className={styles.socialLinks}>
          <motion.a
            href="https://discord.gg/4X69Ktv336"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialCard}
            whileHover={{ y: -4, rotate: -1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <svg viewBox="0 0 100 100" className={styles.socialIcon}>
              <path
                d="M23,38 C32,32 68,32 77,38 C75,47 75,59 72,67 C66,67 63,64 60,61 C57,63 54,64 50,64 C46,64 43,63 40,61 C37,64 34,67 28,67 C25,59 25,47 23,38 Z M21,36 C31,30 69,30 79,36 C77,47 77,59 74,69 M60,61 C56,65 44,65 40,61"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="41" cy="47" r="3.5" fill="currentColor" />
              <circle cx="59" cy="47" r="3.5" fill="currentColor" />
            </svg>
            <span className={styles.socialName}>Discord</span>
            <span className={styles.socialDesc}>Join 12K+ storytellers</span>
          </motion.a>
          <motion.a
            href="https://www.instagram.com/stickmanstories_youtube/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialCard}
            whileHover={{ y: -4, rotate: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <svg viewBox="0 0 100 100" className={styles.socialIcon}>
              <path
                d="M26,24 C36,21 64,21 74,24 C79,28 79,72 74,76 C64,79 36,79 26,76 C21,72 21,28 26,24 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24,22 C35,19 65,19 76,22 C81,27 81,73 76,78 C65,81 35,81 24,78 C19,73 19,27 24,22 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
              />
              <path
                d="M37,50 C37,42 42,37 50,37 C58,37 63,42 63,50 C63,58 58,63 50,63 C42,63 37,58 37,50 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M35,50 C35,40 40,35 50,35 C60,35 65,40 65,50 C65,60 60,65 50,65 C40,65 35,60 35,50 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.5"
              />
              <circle cx="66" cy="34" r="3.5" fill="currentColor" />
            </svg>
            <span className={styles.socialName}>Instagram</span>
            <span className={styles.socialDesc}>Behind-the-scenes sketches</span>
          </motion.a>
          <motion.a
            href="#"
            className={styles.socialCard}
            whileHover={{ y: -4, rotate: -0.5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <svg viewBox="0 0 100 100" className={styles.socialIcon}>
              <path
                d="M22,22 L72,78 M25,20 L75,76"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M74,22 L24,78 M76,20 L26,76"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.85"
              />
              <path
                d="M23,21 L28,21 M72,77 L77,77"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <span className={styles.socialName}>X / Twitter</span>
            <span className={styles.socialDesc}>Updates & hot takes</span>
          </motion.a>
        </div>
      </section>
    </div>
  );
}
