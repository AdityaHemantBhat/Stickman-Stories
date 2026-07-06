import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { audioManager } from '../../utils/audio';
import styles from './Preloader.module.css';

const loadingPhrases = [
  { max: 20, text: 'Sharpening the drawing pencils...' },
  { max: 40, text: 'Stretching the sketchbook pages...' },
  { max: 60, text: 'Inking the stickman characters...' },
  { max: 80, text: 'Animating the flipbook sequences...' },
  { max: 95, text: 'Erasing stray pencil outlines...' },
  { max: 100, text: 'Opening the notebook...' },
];

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusPhrase, setStatusPhrase] = useState(loadingPhrases[0].text);
  const [channelLogo, setChannelLogo] = useState(null);

  // Fetch YouTube Channel Logo on load
  useEffect(() => {
    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY?.trim();
    const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID?.trim();

    if (API_KEY && CHANNEL_ID) {
      fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${CHANNEL_ID}&key=${API_KEY}`
      )
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Channel Logo Fetch failed');
        })
        .then((data) => {
          if (data.items && data.items.length > 0) {
            const snippet = data.items[0].snippet;
            const logoUrl = snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url;
            setChannelLogo(logoUrl);
          }
        })
        .catch((err) => {
          console.warn('[Preloader] Error fetching channel logo:', err.message);
        });
    }
  }, []);

  useEffect(() => {
    // Block scroll at document level to make absolutely sure no scrolling happens
    document.body.style.overflow = 'hidden';

    let currentProgress = 0;
    
    // Simulate loading progress
    const timer = setInterval(() => {
      // Custom increment speed - faster at start, slows down slightly near end for dramatic tension
      const increment = currentProgress < 70 
        ? Math.floor(Math.random() * 8) + 4 // 4-11% at start
        : Math.floor(Math.random() * 4) + 1; // 1-4% near the end

      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);

      // Update the status phrase based on current progress
      const phrase = loadingPhrases.find(p => currentProgress <= p.max);
      if (phrase) {
        setStatusPhrase(phrase.text);
      }

      if (currentProgress >= 100) {
        clearInterval(timer);
        // Small delay at 100% so the user can see it complete, then transition out
        const completeTimeout = setTimeout(() => {
          document.body.style.overflow = '';
          // Play satisfying paper tear whoosh sound on transition
          audioManager.playTear();
          onComplete();
        }, 700);
        return () => clearTimeout(completeTimeout);
      }
    }, 80);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <motion.div
      className={styles.preloaderContainer}
      initial={{ y: 0 }}
      exit={{ 
        y: '-100%',
        transition: { 
          duration: 0.95, 
          ease: [0.85, 0, 0.15, 1], // ease-in-out-circ
        }
      }}
    >
      {/* Decorative notebook vignette overlay */}
      <div className={styles.vignette} />

      <div className={styles.content}>
        {/* Animated Drawing Logo SVG */}
        <div className={styles.logoWrapper}>
          <svg viewBox="0 0 40 40" className={styles.logoSvg}>
            <defs>
              {/* Circular clipPath to fit channel logo exactly inside stickman head */}
              <clipPath id="headClip">
                <circle cx="20" cy="12" r="6.7" />
              </clipPath>
            </defs>

            {/* Waving Right Leg */}
            <line
              x1="20"
              y1="30"
              x2="26"
              y2="38"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className={styles.drawPath}
              style={{
                '--length': '10',
                '--delay': '1.1s',
                '--duration': '0.3s'
              }}
            />
            {/* Waving Left Leg */}
            <line
              x1="20"
              y1="30"
              x2="14"
              y2="38"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className={styles.drawPath}
              style={{
                '--length': '10',
                '--delay': '0.9s',
                '--duration': '0.3s'
              }}
            />
            {/* Waving Arms */}
            <line
              x1="12"
              y1="23"
              x2="28"
              y2="23"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className={styles.drawPath}
              style={{
                '--length': '16',
                '--delay': '0.7s',
                '--duration': '0.4s'
              }}
            />
            {/* Body */}
            <line
              x1="20"
              y1="19"
              x2="20"
              y2="30"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className={styles.drawPath}
              style={{
                '--length': '11',
                '--delay': '0.4s',
                '--duration': '0.3s'
              }}
            />

            {/* Channel Logo Image - masked inside head circle, fades in */}
            {channelLogo && (
              <image
                href={channelLogo}
                x="13.3"
                y="5.3"
                width="13.4"
                height="13.4"
                clipPath="url(#headClip)"
                className={styles.channelLogoImage}
              />
            )}

            {/* Simple stickman head outline - always drawn */}
            <circle
              cx="20"
              cy="12"
              r="7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className={styles.drawPath}
              style={{
                '--length': '44',
                '--delay': '0.1s',
                '--duration': '0.5s'
              }}
            />
          </svg>
        </div>

        {/* Brand Text */}
        <h1 className={styles.loadingTitle}>Stickman Stories</h1>

        {/* Percentage Counter */}
        <div className={styles.percentage}>{progress}%</div>

        {/* Hand-drawn sketchy Progress Bar */}
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }} 
          />
        </div>

        {/* Loading status phrase */}
        <div className={styles.statusText}>{statusPhrase}</div>
      </div>

      {/* Jagged Torn Paper Bottom Border Transition */}
      <div className={styles.tornDivider}>
        <svg viewBox="0 0 1440 24" preserveAspectRatio="none" className={styles.tornSvg}>
          <path 
            d="M0,0 L1440,0 L1440,8 C1400,16 1360,6 1320,12 C1280,18 1240,8 1200,14 C1160,20 1120,10 1080,12 C1040,14 1000,6 960,12 C920,18 880,10 840,12 C800,14 760,6 720,12 C680,18 640,10 600,12 C560,14 520,6 480,12 C440,18 400,10 360,12 C320,14 280,6 240,12 C200,18 160,10 120,12 C80,14 40,6 0,10 Z" 
          />
        </svg>
      </div>
    </motion.div>
  );
}
