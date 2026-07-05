import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './VideoModal.module.css';

/**
 * Video modal — YouTube embed styled as a notebook/CRT frame.
 * Renders via React Portal to escape transformed page transitions.
 */
export default function VideoModal({ isOpen, onClose, videoId, title = '', isShort = false }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — ink bleed spread */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            data-cursor="link"
          />

          {/* Centering Wrapper */}
          <div className={styles.modalWrapper}>
            {/* Modal content */}
            <motion.div
              className={`${styles.modal} ${isShort ? styles.shortModal : ''}`}
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Close button */}
              <motion.button
                className={styles.closeBtn}
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close video"
                data-cursor="link"
              >
                ✕
              </motion.button>

              {/* Notebook frame around the video */}
              <div className={styles.frame}>
                {/* Tape strips on corners */}
                <div className={`${styles.tape} ${styles.tapeTopLeft}`} />
                <div className={`${styles.tape} ${styles.tapeTopRight}`} />

                {/* YouTube iframe */}
                <div className={`${styles.videoWrap} ${isShort ? styles.shortVideoWrap : ''}`}>
                  <iframe
                    src={isShort 
                      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
                      : `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
                    }
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={styles.iframe}
                  />
                </div>
              </div>

              {/* Title scrawled below */}
              {title && (
                <motion.p
                  className={styles.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {title}
                </motion.p>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
