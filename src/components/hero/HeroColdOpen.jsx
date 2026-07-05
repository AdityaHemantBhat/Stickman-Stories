import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './HeroColdOpen.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function HeroColdOpen() {
  const sectionRef = useRef(null);
  const svgRef = useRef(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [speech, setSpeech] = useState(null);
  const [isWalking, setIsWalking] = useState(true);
  const speechTimeoutRef = useRef(null);

  // Track mouse relative coordinates to make eyes follow cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Hotspot interaction speech triggers
  const triggerReaction = (part) => {
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);

    let text = '';
    switch (part) {
      case 'head':
        const headQuotes = [
          'Watch the hair! 😳',
          'Press Ctrl + Z! 🔄',
          'Save my file! 💾',
          'System crash alert! ⚠️'
        ];
        text = headQuotes[Math.floor(Math.random() * headQuotes.length)];
        break;
      case 'tummy':
        text = 'Aha! That tickles! 😂';
        break;
      case 'hand':
        text = 'High five! 👋';
        break;
      case 'feet':
        text = 'Don\'t trip my frame rate! ⚡';
        break;
      default:
        text = 'Hello there! 👋';
    }

    setSpeech(text);

    // Auto close bubble
    speechTimeoutRef.current = setTimeout(() => {
      setSpeech(null);
    }, 2500);
  };

  useEffect(() => {
    const paths = svgRef.current?.querySelectorAll('path, line, circle, polyline');
    if (!paths || paths.length === 0) return;

    // Set up stroke-dashoffset for SVG draw animation
    paths.forEach((path) => {
      const length = path.getTotalLength ? path.getTotalLength() : 100;
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
      });
    });

    const ctx = gsap.context(() => {
      // Draw the stickman on load
      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 2,
        stagger: 0.15,
        ease: 'power2.inOut',
        delay: 0.3,
      });

      // Walk in from off-screen right
      gsap.fromTo(`.${styles.svgWrap}`, 
        { x: window.innerWidth > 768 ? 600 : 300, opacity: 0 }, 
        { 
          x: 0, 
          opacity: 1,
          duration: 4.5, 
          ease: 'power1.out',
          delay: 0.2,
          onComplete: () => {
            setIsWalking(false);
          }
        }
      );

      // Parallax on scroll
      gsap.to(svgRef.current, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef.current);

    return () => {
      ctx.revert();
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    };
  }, []);

  // Compute pupil offsets to track mouse
  const eyeOffsetX = mousePos.x * 5;
  const eyeOffsetY = mousePos.y * 5;

  return (
    <section ref={sectionRef} className={styles.hero} id="hero">
      {/* Background ink texture */}
      <div className={styles.bgTexture} aria-hidden="true" />

      {/* Decorative background doodles */}
      <div className={styles.decorativeDoodles} aria-hidden="true">
        {/* Quote marks */}
        <span className={`${styles.dood} ${styles.doodQuote1}`}>“</span>
        <span className={`${styles.dood} ${styles.doodQuote2}`}>”</span>
        {/* Code braces */}
        <span className={`${styles.dood} ${styles.doodBrace1}`}>{"{"}</span>
        <span className={`${styles.dood} ${styles.doodBrace2}`}>{"}"}</span>
        {/* Hand-drawn SVG Arrow */}
        <svg viewBox="0 0 100 100" className={`${styles.doodSvg} ${styles.doodArrow}`}>
          <path d="M 20 80 C 40 40, 50 60, 80 20 L 60 20 M 80 20 L 80 40" fill="none" stroke="var(--ink-black)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        {/* Hand-drawn Stars */}
        <svg viewBox="0 0 100 100" className={`${styles.doodSvg} ${styles.doodStar1}`}>
          <path d="M 50 20 L 58 42 L 80 50 L 58 58 L 50 80 L 42 58 L 20 50 L 42 42 Z" fill="none" stroke="var(--ink-black)" strokeWidth="2.5" />
        </svg>
        <svg viewBox="0 0 100 100" className={`${styles.doodSvg} ${styles.doodStar2}`}>
          <path d="M 50 25 L 56 42 L 75 50 L 56 58 L 50 75 L 44 58 L 25 50 L 44 42 Z" fill="none" stroke="var(--accent-red)" strokeWidth="2.5" />
        </svg>
        {/* Scribble Crosshair */}
        <svg viewBox="0 0 100 100" className={`${styles.doodSvg} ${styles.doodCrosshair}`}>
          <circle cx="50" cy="50" r="20" fill="none" stroke="var(--ink-black)" strokeWidth="1.5" strokeDasharray="3,3" />
          <line x1="50" y1="20" x2="50" y2="80" stroke="var(--ink-black)" strokeWidth="1.5" />
          <line x1="20" y1="50" x2="80" y2="50" stroke="var(--ink-black)" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Animated stickman SVG */}
      <div className={styles.svgWrap}>
        
        {/* Dynamic Speech Bubble */}
        <AnimatePresence>
          {speech && (
            <motion.div
              className={styles.speechBubble}
              initial={{ scale: 0, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              {speech}
            </motion.div>
          )}
        </AnimatePresence>

        <svg
          ref={svgRef}
          viewBox="0 0 400 500"
          className={styles.stickmanSvg}
          aria-label="Stickman Stories animated character"
        >
          {/* Entire character group moves together to prevent limb detachment */}
          <g className={isWalking ? styles.walkingCharacter : ''}>
            {/* Head (Sketched double-contour) */}
            <path
              d="M 200 55 C 225 55, 245 75, 245 100 C 245 125, 225 145, 200 145 C 175 145, 155 125, 155 100 C 155 75, 175 55, 200 55 Z"
              fill="none"
              stroke="var(--ink-black)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 198 57 C 223 54, 247 78, 243 103 C 239 128, 222 143, 197 143 C 172 143, 157 122, 157 97 C 157 72, 173 60, 198 57"
              fill="none"
              stroke="var(--ink-black)"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.7"
            />
            
            {/* Reactive Eyes - pupils track mouse cursor */}
            <circle cx={185 + eyeOffsetX} cy={92 + eyeOffsetY} r="4.5" fill="var(--ink-black)" stroke="none" />
            <circle cx={215 + eyeOffsetX} cy={92 + eyeOffsetY} r="4.5" fill="var(--ink-black)" stroke="none" />
            
            {/* Slight smile (sketched) */}
            <path d="M188 112 Q200 122 212 112" fill="none" stroke="var(--ink-black)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M189 113 Q200 120 211 113" fill="none" stroke="var(--ink-black)" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
            
            {/* Body / Torso (Double offset sketch) */}
            <path d="M 200 145 L 202 290" stroke="var(--ink-black)" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 198 143 L 198 292" stroke="var(--ink-black)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            
            {/* Left arm — waving (Double wobbly paths) */}
            <g className={isWalking ? styles.walkingArmLeft : ''} style={{ transformOrigin: '200px 190px' }}>
              <path d="M 200 190 Q 155 215, 130 185" fill="none" stroke="var(--ink-black)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 198 192 Q 153 217, 132 187" fill="none" stroke="var(--ink-black)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            </g>
            
            {/* Right arm — holding digital stylus pen (Double wobbly paths) */}
            <g className={isWalking ? styles.walkingArmRight : ''} style={{ transformOrigin: '200px 200px' }}>
              <path d="M 200 200 Q 250 225, 275 210" fill="none" stroke="var(--ink-black)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 198 202 Q 248 227, 277 212" fill="none" stroke="var(--ink-black)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              
              {/* Digital Stylus in hand */}
              <path d="M 273 212 L 297 197" stroke="var(--ink-black)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 277 208 L 293 193" stroke="var(--ink-black)" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
              {/* Light-blue LED glow tip of stylus */}
              <line x1="295" y1="195" x2="300" y2="191" stroke="#00d2ff" strokeWidth="2.5" strokeLinecap="round" />
            </g>
            
            {/* Left leg (Double offset sketch) */}
            <g className={isWalking ? styles.walkingLegLeft : ''} style={{ transformOrigin: '200px 290px' }}>
              <path d="M 202 290 Q 167 380, 150 430" fill="none" stroke="var(--ink-black)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 199 292 Q 163 382, 148 432" fill="none" stroke="var(--ink-black)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            </g>
            
            {/* Right leg (Double offset sketch) */}
            <g className={isWalking ? styles.walkingLegRight : ''} style={{ transformOrigin: '200px 290px' }}>
              <path d="M 202 290 Q 237 380, 250 430" fill="none" stroke="var(--ink-black)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 199 292 Q 233 382, 248 432" fill="none" stroke="var(--ink-black)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            </g>
          </g>
          
          {/* Ground scribble (Remains stationary relative to screen) */}
          <path d="M100 435 Q150 428, 200 435 Q250 442, 300 435 M110 437 Q150 431, 200 437 Q250 440, 290 437" fill="none" stroke="var(--ink-faint)" strokeWidth="2" strokeLinecap="round" />

          {/* Interactive Invisible overlays for click interactions */}
          {/* Head hotspot */}
          <circle cx="200" cy="100" r="50" className={styles.hotspot} onClick={() => triggerReaction('head')} />
          {/* Tummy hotspot */}
          <rect x="180" y="150" width="40" height="140" className={styles.hotspot} onClick={() => triggerReaction('tummy')} />
          {/* Hand hotspot */}
          <circle cx="130" cy="185" r="30" className={styles.hotspot} onClick={() => triggerReaction('hand')} />
          {/* Feet hotspot */}
          <rect x="140" y="380" width="120" height="60" className={styles.hotspot} onClick={() => triggerReaction('feet')} />
        </svg>
      </div>

      {/* Off-axis headline — bottom-left, slightly rotated */}
      <div className={styles.content}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 40, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ duration: 1, delay: 2, ease: [0.16, 1, 0.3, 1] }}
        >
          Stickman<br />Stories
        </motion.h1>
        <motion.p
          className={styles.tagline}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 2.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Where ink comes alive
        </motion.p>
      </div>

      {/* Scroll prompt — sticky note */}
      <motion.div
        className={styles.scrollPrompt}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.6 }}
      >
        <motion.div
          className={styles.stickyNote}
          animate={{ y: [0, -6, 0], rotate: [-1.5, -0.5, -1.5] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        >
          ↓ scroll to begin the story
        </motion.div>
      </motion.div>
    </section>
  );
}

