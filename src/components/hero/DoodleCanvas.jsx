import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { audioManager } from '../../utils/audio';
import styles from './DoodleCanvas.module.css';

export default function DoodleCanvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [stickmanText, setStickmanText] = useState('Draw something! ✎');
  const [isErasing, setIsErasing] = useState(false);

  // Idle timer to check if user has stopped drawing
  const idleTimer = useRef(null);
  const lastCoords = useRef(null);

  // Setup drawing context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1a1a1a'; // var(--ink-black)
    ctx.lineWidth = 3;

    // Handle high-DPI screens
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Restore stroke properties after resize
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 3;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Handle drawing mouse/touch events
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || isErasing) return;

    const ctx = canvas.getContext('2d');
    const coords = getEventCoords(e, canvas);

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    setHasDrawn(true);
    lastCoords.current = coords;
    
    // Play drawing sound
    audioManager.startScribble();
    
    // React stickman
    setStickmanText('Ooh, nice line! 😳');
    clearTimeout(idleTimer.current);
  };

  const draw = (e) => {
    if (!isDrawing || isErasing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const coords = getEventCoords(e, canvas);

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    // Calculate drawing speed (velocity)
    const prev = lastCoords.current || coords;
    const dx = coords.x - prev.x;
    const dy = coords.y - prev.y;
    const speed = Math.sqrt(dx * dx + dy * dy);
    
    audioManager.updateScribble(speed);
    lastCoords.current = coords;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastCoords.current = null;
    
    // Stop scribble sound
    audioManager.stopScribble();
    
    // Set a timeout to say something idle
    idleTimer.current = setTimeout(() => {
      setStickmanText('Draw me a friend! ☺');
    }, 4000);
  };

  const getEventCoords = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    // Support mouse & touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  // Erase wipe animation using GSAP
  const handleErase = () => {
    if (isErasing || !hasDrawn) return;
    setIsErasing(true);
    setStickmanText('OH NO! THE ERASER! 😱');
    
    // Play tearing sound on sweep
    audioManager.playTear();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;

    // Create an eraser sweep element and animate it across the canvas box
    const sweep = document.createElement('div');
    sweep.className = styles.eraserWipe;
    sweep.innerHTML = `
      <div class="${styles.eraserDrawing}">
        <span class="${styles.eraserDrawingText}">ERASER</span>
      </div>
    `;
    container.appendChild(sweep);

    // Animate the sweep across
    gsap.fromTo(sweep, 
      { left: '-130px' },
      {
        left: '100%',
        duration: 1.6,
        ease: 'power1.inOut',
        onUpdate: function() {
          // Progressively clear the canvas columns as the eraser moves
          const currentX = parseFloat(gsap.getProperty(sweep, 'left'));
          const canvasW = canvas.width;
          if (currentX > 0 && currentX < canvasW) {
            ctx.clearRect(0, 0, currentX, canvas.height);
          }
        },
        onComplete: () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          sweep.remove();
          setIsErasing(false);
          setHasDrawn(false);
          setStickmanText('Phew, that was close! 😮‍💨');
        }
      }
    );
  };

  return (
    <section className={styles.section} id="doodle-scratchpad">
      <div className={styles.notebookLines} />

      <header className={styles.header}>
        <h2 className={styles.title}>Sketching Pad</h2>
        <p className={styles.subtitle}>Click & drag to draw on the notebook. Create your own lines!</p>
      </header>

      {/* The drawing page */}
      <div ref={containerRef} className={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {/* Dynamic speech bubble */}
        <AnimatePresence>
          {stickmanText && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={styles.speechBubble}
            >
              {stickmanText}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Stickman cheering you on */}
        <div className={styles.stickmanGuy}>
          <svg viewBox="0 0 100 200" width="100%" height="100%">
            <circle cx="50" cy="40" r="15" fill="none" stroke="var(--ink-black)" strokeWidth="3" />
            <line x1="50" y1="55" x2="50" y2="120" stroke="var(--ink-black)" strokeWidth="3" />
            
            {/* Arms react based on state */}
            {isErasing ? (
              // Screaming arms
              <polyline points="20,25 50,75 80,25" fill="none" stroke="var(--ink-black)" strokeWidth="3" strokeLinecap="round" />
            ) : isDrawing ? (
              // Cheering arms
              <polyline points="20,45 50,70 80,45" fill="none" stroke="var(--ink-black)" strokeWidth="3" strokeLinecap="round" />
            ) : (
              // Normal hands-on-hips arms
              <>
                <polyline points="20,90 35,75 50,75" fill="none" stroke="var(--ink-black)" strokeWidth="3" strokeLinecap="round" />
                <polyline points="80,90 65,75 50,75" fill="none" stroke="var(--ink-black)" strokeWidth="3" strokeLinecap="round" />
              </>
            )}

            {/* Legs */}
            <polyline points="20,180 50,120 80,180" fill="none" stroke="var(--ink-black)" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Toolbar controls */}
      <div className={styles.toolbar}>
        <button
          onClick={handleErase}
          className={`${styles.toolBtn} ${styles.clearBtn}`}
          disabled={isErasing || !hasDrawn}
          data-cursor="link"
        >
          Erase Page
        </button>
      </div>
    </section>
  );
}
