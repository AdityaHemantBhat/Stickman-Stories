import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import characters from '../../data/characters.json';
import styles from './UniverseTeaser.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Chapter 2 — The Universe Teaser
 * Horizontal scroll driven by vertical scroll.
 */
export default function UniverseTeaser() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    // Disable horizontal hijack on mobile
    if (window.innerWidth <= 768) return;

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
              end: 'bottom bottom',
              scrub: 1,
              invalidateOnRefresh: true,
            }
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} id="universe">
      <div className={styles.stickyContainer}>
        {/* Title */}
        <div className={styles.titleWrap}>
          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            The Stickman Universe
          </motion.h2>
          <motion.div
            className={styles.titleUnderline}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
          />
        </div>

        {/* Horizontal Track */}
        <div ref={trackRef} className={styles.track}>
          {characters.map((char, i) => (
            <div key={char.id} className={styles.characterWrapper}>
              <motion.div
                className={styles.characterContainer}
                whileHover="hover"
              >
                {/* Hand-labeled name tag */}
                <div className={styles.nameTag}>
                  <span className={styles.tape} />
                  {char.name}
                </div>

                {/* Character SVG representation */}
                <svg viewBox="0 0 100 200" className={styles.charSvg}>
                  {char.id === 'stick-01' && ( // Wanderer
                    <>
                      {/* Head - overlapping sketchy loops */}
                      <path d="M48,32 C58,31 66,38 66,48 C66,58 58,66 48,65 C38,64 30,56 31,46 C32,36 40,32 48,32 M46,30 C58,29 68,37 68,49 C68,61 58,69 46,68 C34,67 28,58 29,46 C30,34 38,30 46,30" fill="none" stroke="var(--ink-black)" strokeWidth="2.5" />
                      {/* Body - double-line sketch */}
                      <path d="M50,65 Q48,100 51,135 M49,66 Q52,100 49,134" fill="none" stroke="var(--ink-black)" strokeWidth="2.5" />
                      {/* Arms - interactive wave polyline but rendered sketchy */}
                      <motion.path 
                        d="M20,95 Q50,85 80,95 M22,97 Q50,87 78,97" 
                        fill="none" 
                        stroke="var(--ink-black)" 
                        strokeWidth="2.5" 
                        strokeLinecap="round"
                        variants={{
                          hover: { d: "M20,70 Q50,85 80,70 M22,72 Q50,87 78,72", transition: { duration: 0.3 } }
                        }}
                      />
                      {/* Legs - double-line sketch */}
                      <path d="M51,135 Q40,160 34,190 M49,134 Q39,161 36,189" fill="none" stroke="var(--ink-black)" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M51,135 Q60,160 66,190 M52,134 Q61,159 64,189" fill="none" stroke="var(--ink-black)" strokeWidth="2.5" strokeLinecap="round" />
                      {/* Bindle stick */}
                      <path d="M28,103 L76,71 M27,105 L77,73" fill="none" stroke="var(--ink-black)" strokeWidth="2" />
                      {/* Bindle bag (red) */}
                      <path d="M21,105 C17,113 23,121 31,118 C37,115 39,106 33,101 C28,97 23,99 21,105 M23,107 Q29,112 33,105" fill="var(--accent-red)" stroke="var(--ink-black)" strokeWidth="1.5" />
                    </>
                  )}
                  {char.id === 'stick-02' && ( // Scribble
                    <>
                      {/* Multiple tangled loops for chaotic scribble feeling */}
                      <path 
                        d="M35 50 C38 22, 62 22, 65 50 C68 78, 32 78, 35 100 C38 122, 62 122, 65 100 C68 78, 38 50, 42 75 C45 100, 58 65, 45 85 Q75 140 50 160 C30 140, 28 110, 35 90 C42 70, 58 50, 50 50 Z" 
                        fill="none" 
                        stroke="var(--ink-black)" 
                        strokeWidth="3.5" 
                        strokeLinecap="round" 
                      />
                      {/* Extra overlapping scratch outlines */}
                      <path 
                        d="M37 48 C40 25, 60 25, 63 48 C66 75, 34 75, 37 98 C40 120, 60 120, 63 98 C66 75, 42 52, 48 73 C50 95, 52 75, 48 83" 
                        fill="none" 
                        stroke="var(--ink-black)" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        opacity="0.7"
                      />
                      {/* Red glowing chaotic eyes */}
                      <path d="M38 65 Q42 63, 46 70 M36 67 Q42 65, 44 72" stroke="var(--accent-red)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <path d="M62 65 Q58 63, 54 70 M64 67 Q58 65, 56 72" stroke="var(--accent-red)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    </>
                  )}
                  {char.id === 'stick-03' && ( // Dot
                    <g transform="translate(0, 30)">
                      {/* Hand-drawn blob */}
                      <path d="M50,40 C68,39 81,51 80,70 C79,88 67,101 50,100 C32,99 19,86 20,68 C21,50 32,41 50,40 Z" fill="var(--ink-black)" stroke="var(--ink-black)" strokeWidth="1.5" />
                      {/* Inner shadow/hatching lines for hand-drawn sketch feel */}
                      <path d="M28,68 Q35,85 50,90 M35,78 Q45,88 58,88" fill="none" stroke="white" strokeWidth="1" opacity="0.4" />
                      {/* Eyes (hand-drawn white blobs instead of circles) */}
                      <path d="M37,58 C41,57 43,60 43,63 C43,66 40,68 37,67 C34,66 33,63 34,60 C35,57 37,58 37,58 Z" fill="white" />
                      <path d="M58,58 C62,57 64,60 64,63 C64,66 61,68 58,67 C55,66 54,63 55,60 C56,57 58,58 58,58 Z" fill="white" />
                      {/* White smile/underline */}
                      <motion.path 
                        d="M 33 110 Q 50 122 67 110" 
                        fill="none" 
                        stroke="white" 
                        strokeWidth="2.5" 
                        strokeLinecap="round"
                      />
                    </g>
                  )}
                  {char.id === 'stick-04' && ( // Eraser
                    <g transform="rotate(-12 50 100)">
                      {/* Main body: sketchy, non-parallel double strokes */}
                      {/* Front face outline */}
                      <path d="M20,60 L78,61 M22,63 L76,64" fill="none" stroke="var(--ink-black)" strokeWidth="3" />
                      <path d="M78,61 L81,139 M76,63 L79,137" fill="none" stroke="var(--ink-black)" strokeWidth="3" />
                      <path d="M22,141 L80,139 M20,139 L78,137" fill="none" stroke="var(--ink-black)" strokeWidth="3" />
                      <path d="M20,60 L22,141 M18,62 L20,139" fill="none" stroke="var(--ink-black)" strokeWidth="3" />
                      
                      {/* Sleeve wrapper divider (dashed, double stroke) */}
                      <path d="M21,100 L79,101 M20,103 L80,104" stroke="var(--ink-black)" strokeWidth="2" strokeDasharray="5,4" />
                      
                      {/* Sketched brand/logo curve */}
                      <motion.path 
                        d="M 32 82 C 42 77, 58 77, 68 82 M 34 84 C 42 80, 58 80, 66 84" 
                        fill="none" 
                        stroke="var(--ink-black)" 
                        strokeWidth="2" 
                      />
                    </g>
                  )}
                  {char.id === 'stick-05' && ( // Ink
                    <>
                      {/* Head - hand-drawn sketchy circle loops */}
                      <path d="M48,29 C59,28 67,36 67,46 C67,56 59,64 48,63 C37,62 29,54 30,44 C31,34 39,29 48,29 M46,27 C58,26 69,35 69,47 C69,59 58,67 46,66 C34,65 27,56 28,44 C29,32 37,27 46,27" fill="none" stroke="var(--ink-black)" strokeWidth="2.5" />
                      
                      {/* Body - sketchy vertical lines */}
                      <path d="M50,61 Q52,95 50,130 M49,63 Q50,96 48,129" fill="none" stroke="var(--ink-black)" strokeWidth="2.5" />
                      
                      {/* Waving arms - sketchy polyline curve */}
                      <path d="M20,90 Q50,75 80,90 M22,92 Q50,77 78,92" fill="none" stroke="var(--ink-black)" strokeWidth="2.5" strokeLinecap="round" />
                      
                      {/* Dripping gown/bottom puddle (signature silhouette, no legs) */}
                      <path d="M40,130 C28,160 32,183 50,185 C68,183 72,160 60,130 Z" fill="var(--ink-black)" stroke="var(--ink-black)" strokeWidth="1" />
                      <path d="M42,129 C32,158 35,181 50,183 C65,181 68,158 58,129" fill="none" stroke="var(--ink-black)" strokeWidth="2.5" />
                      
                      {/* Floating/dripping paint droplets */}
                      <circle cx="34" cy="115" r="4.5" fill="var(--ink-black)" />
                      <circle cx="66" cy="100" r="5.5" fill="var(--ink-black)" />
                    </>
                  )}
                  {char.id === 'stick-06' && ( // Sketch
                    <>
                      {/* Dashed blue guidelines showing she is half-drawn */}
                      <path d="M48,32 C58,31 66,38 66,48 C66,58 58,66 48,65 C38,64 30,56 31,46 Z" fill="none" stroke="rgba(58, 110, 165, 0.4)" strokeWidth="1" strokeDasharray="3,3" />
                      {/* Hand-drawn half head (incomplete circle) */}
                      <path d="M46,30 C58,29 68,37 68,49 C68,61 58,69 46,68" fill="none" stroke="var(--ink-black)" strokeWidth="2.5" strokeDasharray="8,4" />
                      {/* Body */}
                      <path d="M50,68 Q49,100 50,135" fill="none" stroke="var(--ink-black)" strokeWidth="2.5" />
                      {/* Left arm only */}
                      <path d="M20,95 Q35,88 50,85 M22,97 Q35,90 49,87" fill="none" stroke="var(--ink-black)" strokeWidth="2.5" strokeLinecap="round" />
                      {/* Right leg only */}
                      <path d="M50,135 Q65,160 80,190 M49,137 Q63,161 77,189" fill="none" stroke="var(--ink-black)" strokeWidth="2.5" strokeLinecap="round" />
                      {/* Sketch grid guide lines */}
                      <path d="M10,135 L90,135" stroke="rgba(58, 110, 165, 0.3)" strokeWidth="1" />
                      <path d="M50,20 L50,190" stroke="rgba(58, 110, 165, 0.3)" strokeWidth="1" />
                    </>
                  )}
                </svg>
              </motion.div>
            </div>
          ))}

          {/* Explore Universe CTA */}
          <div className={styles.exploreWrapper}>
            <a href="/universe" className={styles.exploreLink} data-cursor="link">
              <span className={styles.exploreText}>Explore the<br/>Universe</span>
              <svg viewBox="0 0 60 20" className={styles.doodleArrow}>
                <path d="M0 10 Q30 20 55 10 M45 2 L58 10 L48 18" fill="none" stroke="var(--accent-red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
