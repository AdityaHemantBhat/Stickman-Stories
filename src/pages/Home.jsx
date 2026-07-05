import { motion } from 'framer-motion';
import HeroColdOpen from '../components/hero/HeroColdOpen';
import LatestEpisodes from '../components/hero/LatestEpisodes';
import UniverseTeaser from '../components/hero/UniverseTeaser';
import BehindTheInk from '../components/hero/BehindTheInk';
import StatsNotebook from '../components/hero/StatsNotebook';
import DoodleCanvas from '../components/hero/DoodleCanvas';
import CommunityCTA from '../components/hero/CommunityCTA';
import styles from './Home.module.css';

/**
 * Home page — single continuous scroll-driven experience.
 * Structured as "chapters" of a notebook.
 */
export default function Home() {
  return (
    <div className={styles.home} data-page="home">
      {/* Chapter 0: Cold Open / Hero */}
      <HeroColdOpen />

      {/* Chapter 1: Latest Episodes (Horizontal Scroll) */}
      <LatestEpisodes />

      {/* Chapter 2: The Universe Teaser */}
      <UniverseTeaser />

      {/* Chapter 3: Behind the Ink */}
      <BehindTheInk />

      {/* Chapter 4: Numbers That Matter */}
      <StatsNotebook />

      {/* Chapter 5: Draw Your Own Doodle */}
      <DoodleCanvas />

      {/* Chapter 6: Join the Story */}
      <CommunityCTA />
    </div>
  );
}
