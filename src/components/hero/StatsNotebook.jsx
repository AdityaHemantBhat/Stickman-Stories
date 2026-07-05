import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useYouTubeData } from '../../hooks/useYouTubeData';
import styles from './StatsNotebook.module.css';

export default function StatsNotebook() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { channelStats } = useYouTubeData();

  const displayStats = [
    { label: 'YouTube Subscribers', value: channelStats.subscribers, suffix: '' },
    { label: 'Stylus Nibs Worn Out', value: 142, suffix: '' },
    { label: 'Total Channel Views', value: channelStats.views, suffix: '+' },
    { label: 'Stickman Doodles', value: channelStats.videos, suffix: '' },
  ];

  useEffect(() => {
    if (!isInView) return;

    // Animate numbers counting up
    const targets = document.querySelectorAll(`.${styles.statNumber}`);
    
    targets.forEach((target) => {
      const endValue = parseFloat(target.dataset.value) || 0;
      
      gsap.to(target, {
        innerHTML: endValue,
        duration: 2.2,
        ease: 'power3.out',
        snap: { innerHTML: 1 },
        onUpdate: function() {
          target.innerHTML = Number(Math.round(target.innerHTML)).toLocaleString();
        }
      });
    });
  }, [isInView, channelStats]);

  return (
    <section ref={sectionRef} className={styles.section} id="stats">
      {/* Red margin line on the left */}
      <div className={styles.marginLine} />

      <div className={styles.content}>
        <motion.h2 
          className={styles.title}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          By the Numbers
        </motion.h2>

        <div className={styles.grid}>
          {displayStats.map((stat, i) => (
            <motion.div 
              key={stat.label} 
              className={styles.statCard}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
            >
              <div className={styles.tape} />
              
              <div className={styles.valueWrap}>
                <span className={styles.statNumber} data-value={stat.value}>
                  0
                </span>
                <span className={styles.suffix}>{stat.suffix}</span>
              </div>
              <p className={styles.label}>{stat.label}</p>
              
              {/* Hand-drawn underline */}
              <svg viewBox="0 0 100 10" className={styles.underline} preserveAspectRatio="none">
                <path d="M0 5 Q50 8, 100 2" fill="none" stroke="var(--ink-mid)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
