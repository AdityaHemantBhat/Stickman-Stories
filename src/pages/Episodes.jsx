import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useYouTubeData, formatViewCount } from '../hooks/useYouTubeData';
import VideoModal from '../components/ui/VideoModal';
import styles from './Episodes.module.css';

const rotations = [-1.5, 0.8, -0.5, 1.2, -1, 0.5];
const clipPaths = [
  'polygon(1% 1%, 98% 3%, 99% 97%, 2% 99%)',
  'polygon(2% 2%, 99% 1%, 97% 98%, 1% 97%)',
  'polygon(3% 1%, 97% 2%, 98% 99%, 1% 98%)',
];

export default function Episodes() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVideo, setModalVideo] = useState(null);

  // Load up to 50 items (all channel content)
  const { episodes, loading, error, isLive } = useYouTubeData({ maxResults: 50 });

  // Get dynamic categories present in the loaded list
  const categories = ['All', ...new Set(episodes.map(ep => ep.series).filter(Boolean))];

  // Filtering logic
  const filteredEpisodes = episodes.filter((ep) => {
    const matchesCategory = selectedCategory === 'All' || ep.series === selectedCategory;
    const matchesSearch =
      ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.episodes} data-page="episodes">
      {/* Background paper lines */}
      <div className={styles.paperLines} />

      <header className={styles.header}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 20, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: -1.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Torn Pages
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Grab a seat and scrub through the raw sketches, debates, and funny moments of the Stickman stories.
        </motion.p>
      </header>

      {/* Filter and Search Section */}
      <div className={styles.controls}>
        {/* Torn Bookmarks Filter */}
        <div className={styles.filterBar}>
          {categories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`${styles.filterTab} ${selectedCategory === cat ? styles.activeTab : ''}`}
              style={{ rotate: `${rotations[i % rotations.length] * 0.8}deg` }}
              data-cursor="link"
            >
              {cat}
              {selectedCategory === cat && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className={styles.activeTabInkLine}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Index Card Lined Search Bar */}
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search by doodle title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <div className={styles.searchLine} />
        </div>
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div className={styles.loadingGrid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.skeletonPanel}>
              <div className={styles.skeletonThumb} />
              <div className={styles.skeletonText} />
              <div className={styles.skeletonSubText} />
            </div>
          ))}
        </div>
      ) : error && episodes.length === 0 ? (
        <div className={styles.errorBox}>
          <p className={styles.errorText}>Failed to fetch doodles: {error}</p>
        </div>
      ) : filteredEpisodes.length === 0 ? (
        <div className={styles.emptyBox}>
          <span className={styles.emptyIcon}>✎</span>
          <p className={styles.emptyText}>No doodles matched your search. Try sketching another query!</p>
        </div>
      ) : (
        <motion.div layout className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {filteredEpisodes.map((ep, i) => (
              <motion.div
                layout
                key={ep.id}
                className={styles.panel}
                style={{ rotate: `${rotations[i % rotations.length]}deg` }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.03, rotate: '0deg', zIndex: 10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                {/* Tape strip decoration */}
                <div
                  className={styles.tapeStrip}
                  style={{ transform: `rotate(${-rotations[i % rotations.length] * 0.6}deg)` }}
                />

                {/* Portrait Thumbnail */}
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

                {/* Hand-labeled details */}
                <div className={styles.info}>
                  <div className={styles.infoMeta}>
                    <span className={styles.epNumber}>{isLive ? 'SHORT' : ep.id}</span>
                    <span className={styles.epViews}>{formatViewCount(ep.viewCount)} views</span>
                  </div>
                  <h3 className={styles.epTitle}>{ep.title.replace(/😂|❤️|😳|🤔|😂|💸/g, '').split('#')[0].trim()}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Video Modal popup */}
      <VideoModal
        isOpen={!!modalVideo}
        onClose={() => setModalVideo(null)}
        videoId={modalVideo?.videoId || ''}
        title={modalVideo?.title || ''}
        isShort={true} // Since the channel only uploads vertical Shorts!
      />
    </div>
  );
}
