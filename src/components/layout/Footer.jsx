import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Footer.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Footer — "Back cover" of the notebook.
 * Dark chalkboard texture, hand-chalked links, signature animation.
 * 
 * GSAP DOMAIN: SVG path draw on scroll-into-view.
 * FRAMER MOTION DOMAIN: Stamp-press hover on social icons.
 */

/* Real SVG icons for each social platform */
const SocialIcons = {
  YouTube: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  Discord: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  ),
  Instagram: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
};

const socialLinks = [
  { name: 'YouTube', url: 'https://www.youtube.com/@StickmanStories_YT', Icon: SocialIcons.YouTube },
  { name: 'Discord', url: 'https://discord.gg/4X69Ktv336', Icon: SocialIcons.Discord },
  { name: 'Instagram', url: 'https://www.instagram.com/stickmanstories_youtube/', Icon: SocialIcons.Instagram },
  { name: 'X', url: '#', Icon: SocialIcons.X },
];

const footerLinks = [
  { label: 'Episodes', path: '/episodes' },
  { label: 'Universe', path: '/universe' },
  { label: 'About', path: '/about' },
  { label: 'Community', path: '/community' },
];

export default function Footer() {
  const signatureRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const paths = signatureRef.current?.querySelectorAll('path, line, circle');
    if (!paths || paths.length === 0) return;

    // Set up stroke-dashoffset for SVG draw animation
    paths.forEach((path) => {
      const length = path.getTotalLength ? path.getTotalLength() : 100;
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
    });

    const ctx = gsap.context(() => {
      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 1.5,
        stagger: 0.15,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
          once: true,
        },
      });
    }, footerRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className={`${styles.footer} bg-chalkboard`}>
      {/* Torn notebook page top border transition */}
      <div className={styles.tornDivider}>
        <svg viewBox="0 0 1440 24" preserveAspectRatio="none" className={styles.tornSvg}>
          <path 
            d="M0,0 L1440,0 L1440,8 C1400,16 1360,6 1320,12 C1280,18 1240,8 1200,14 C1160,20 1120,10 1080,12 C1040,14 1000,6 960,12 C920,18 880,10 840,12 C800,14 760,6 720,12 C680,18 640,10 600,12 C560,14 520,6 480,12 C440,18 400,10 360,12 C320,14 280,6 240,12 C200,18 160,10 120,12 C80,14 40,6 0,10 Z" 
            fill="var(--paper-cream)" 
          />
        </svg>
      </div>

      {/* Floating chalkboard background doodles */}
      <div className={styles.doodleBackground}>
        {/* Sketchy Arrow */}
        <svg viewBox="0 0 60 60" className={`${styles.dood} ${styles.doodArrow}`}>
          <path d="M10 50 Q30 30 50 10 M35 8 L52 8 L52 25" fill="none" stroke="var(--chalk-ghost)" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {/* Sketchy Idea Lightbulb */}
        <svg viewBox="0 0 60 60" className={`${styles.dood} ${styles.doodBulb}`}>
          <path d="M22 35 C18 30 18 20 28 15 C38 10 45 18 40 28 C37 32 37 35 34 38 M26 38 L34 38 M27 42 L33 42 M29 46 L31 46" fill="none" stroke="var(--chalk-ghost)" strokeWidth="2" strokeLinecap="round" />
          <path d="M42 12 L46 8 M50 22 L56 24 M12 22 L6 24" stroke="var(--chalk-ghost)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {/* Sketchy Sparkle */}
        <svg viewBox="0 0 60 60" className={`${styles.dood} ${styles.doodSparkle}`}>
          <path d="M30 10 L33 25 L48 30 L33 35 L30 50 L27 35 L12 30 L27 25 Z" fill="none" stroke="var(--chalk-ghost)" strokeWidth="2" />
        </svg>
      </div>

      <div className={styles.inner}>
        {/* Signature / Logo doodle */}
        <div className={styles.signature}>
          <svg
            ref={signatureRef}
            viewBox="0 0 200 80"
            className={styles.signatureSvg}
            aria-label="Stickman Stories signature"
          >
            {/* "S" flourish */}
            <path
              d="M20 60 C20 40, 40 35, 40 25 C40 15, 20 15, 20 25 C20 35, 50 40, 50 55 C50 65, 30 70, 20 60"
              fill="none"
              stroke="var(--chalk-white)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* "tories" scrawl */}
            <path
              d="M55 30 L55 55 M48 38 L62 38"
              fill="none"
              stroke="var(--chalk-white)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M68 40 C68 55 80 55 80 40 C80 25 68 25 68 40"
              fill="none"
              stroke="var(--chalk-white)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Underline flourish */}
            <path
              d="M15 68 Q100 62, 180 68"
              fill="none"
              stroke="var(--chalk-ghost)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Stickman doodle at end */}
            <circle cx="160" cy="25" r="6" fill="none" stroke="var(--chalk-white)" strokeWidth="1.5" />
            <line x1="160" y1="31" x2="160" y2="48" stroke="var(--chalk-white)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="152" y1="38" x2="168" y2="38" stroke="var(--chalk-white)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="160" y1="48" x2="154" y2="58" stroke="var(--chalk-white)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="160" y1="48" x2="166" y2="58" stroke="var(--chalk-white)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Navigation links */}
        <nav className={styles.links} aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={styles.link}
              data-cursor="link"
            >
              {link.label}
              {/* Hand-drawn chalk self-drawing underline */}
              <svg viewBox="0 0 100 10" className={styles.chalkUnderline} preserveAspectRatio="none">
                <path d="M1,5 Q50,9 99,3 M5,7 Q50,11 95,5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </Link>
          ))}
        </nav>

        {/* Social links — rubber stamp style */}
        <div className={styles.socials}>
          {socialLinks.map((social) => (
            <motion.a
              key={social.name}
              href={social.url}
              className={styles.socialIcon}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              data-cursor="link"
              whileHover={{
                scale: 1.15,
                rotate: Math.random() * 6 - 3,
                transition: { type: 'spring', stiffness: 500, damping: 15 },
              }}
              whileTap={{ scale: 0.85 }}
            >
              <span className={styles.stampIcon}><social.Icon /></span>
              <span className={styles.stampLabel}>{social.name}</span>
            </motion.a>
          ))}
        </div>

        {/* Copyright */}
        <p className={styles.copyright}>
          Drawn by hand. Built with code. © {new Date().getFullYear()} Stickman Stories.
        </p>
      </div>
    </footer>
  );
}
