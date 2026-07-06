import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionLink = motion(Link);
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VideoModal from '../ui/VideoModal';
import { useYouTubeData, formatViewCount } from '../../hooks/useYouTubeData';
import styles from './LatestEpisodes.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Chapter 1 — Latest Episodes
 * Horizontal scroll-scrub through storyboard panels.
 *
 * GSAP DOMAIN: Pinned scroll + horizontal translateX scrub.
 * FRAMER MOTION DOMAIN: Hover animations, modal open/close.
 */

// Torn-paper clip paths — each thumbnail gets a unique one
const clipPaths = [
  'polygon(3% 0%, 98% 2%, 100% 97%, 1% 100%)',
  'polygon(0% 3%, 97% 0%, 100% 98%, 2% 97%)',
  'polygon(1% 1%, 100% 3%, 98% 100%, 0% 97%)',
  'polygon(2% 2%, 99% 0%, 97% 98%, 0% 100%)',
];

const rotations = [-2.5, 1.8, -1.2, 3, -2, 1.5];

export default function LatestEpisodes() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [modalVideo, setModalVideo] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch up to 6 latest episodes from YouTube (falls back to local data if no API key)
  const { episodes, loading, error, isLive } = useYouTubeData({ maxResults: 6 });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (loading || episodes.length === 0) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 769px)": function() {
          function getScrollAmount() {
            const trackWidth = track.scrollWidth;
            return Math.max(0, trackWidth - window.innerWidth + 100); 
          }

          gsap.to(track, {
            x: () => -getScrollAmount(),
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom bottom', // The end is dictated by the CSS height of the section
              scrub: 1,
              invalidateOnRefresh: true,
            }
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, episodes.length]);

  return (
    <>
      <section
        ref={sectionRef}
        className={`${styles.section} ${isMobile ? styles.mobile : ''}`}
        id="latest-episodes"
      >
        <div className={styles.stickyContainer}>
          {/* Section title — hand-scrawled */}
          <div className={styles.titleWrap}>
            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Latest Episodes
            </motion.h2>
            <motion.div
              className={styles.titleUnderline}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
            {error && <p className={styles.errorText}>API Error: {error}. Showing offline data.</p>}
          </div>

          {/* Horizontal scroll track */}
          <div ref={trackRef} className={styles.track} style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease' }}>
            {episodes.map((ep, i) => (
              <motion.div
                key={ep.id}
                className={styles.panel}
                style={{ rotate: `${rotations[i % rotations.length]}deg` }}
                whileHover={{ scale: 1.05, rotate: '0deg', zIndex: 10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Thumbnail */}
                <div
                  className={styles.thumbnail}
                  style={{ clipPath: clipPaths[i % clipPaths.length] }}
                  onClick={() => setModalVideo(ep)}
                  data-cursor="play"
                  role="button"
                  tabIndex={0}
                  aria-label={`Play ${ep.title}`}
                >
                  <img
                    src={ep.thumbnailUrl}
                    alt={ep.title}
                    className={styles.thumbImg}
                    loading="lazy"
                  />
                  {/* Play overlay */}
                  <div className={styles.playOverlay}>
                    <svg viewBox="0 0 48 48" className={styles.playIcon}>
                      <circle cx="24" cy="24" r="22" fill="rgba(10,10,10,0.6)" stroke="white" strokeWidth="2" />
                      <polygon points="18,14 36,24 18,34" fill="white" />
                    </svg>
                  </div>
                </div>

                {/* Tape strip decoration */}
                <div className={styles.tapeStrip} style={{ transform: `rotate(${-rotations[i % rotations.length] * 0.5}deg)` }} />

                {/* Episode info — hand-labeled */}
                <div className={styles.info}>
                  <span className={styles.epNumber}>{isLive ? 'VID' : ep.id}</span>
                  <h3 className={styles.epTitle}>{ep.title}</h3>
                  <span className={styles.epViews}>{formatViewCount(ep.viewCount)} views</span>
                </div>
              </motion.div>
            ))}

          {/* "See all" arrow at end */}
          <MotionLink
            to="/episodes"
            className={styles.seeAll}
            whileHover={{ x: 10 }}
            data-cursor="link"
          >
            <span className={styles.seeAllText}>See all episodes</span>
            <svg viewBox="0 0 40 20" className={styles.seeAllArrow}>
              <path d="M0 10 L30 10 M25 4 L32 10 L25 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MotionLink>
        </div>
      </div>
    </section>

      {/* Video modal */}
      <VideoModal
        isOpen={!!modalVideo}
        onClose={() => setModalVideo(null)}
        videoId={modalVideo?.videoId || ''}
        title={modalVideo?.title || ''}
        isShort={true}
      />
    </>
  );
}
