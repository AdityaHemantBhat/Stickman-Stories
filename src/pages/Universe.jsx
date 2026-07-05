import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useYouTubeData } from '../hooks/useYouTubeData';
import VideoModal from '../components/ui/VideoModal';
import styles from './Universe.module.css';

// 5 real recurring elements/characters from the Stickman Stories YouTube channel
const characterNodes = [
  {
    id: 'hero',
    name: 'Relatable Protagonist',
    role: 'Primary Character',
    bio: 'The default stickman trying to navigate life-altering button choices, strict mothers, heatwaves, and missing cookies.',
    vibe: 'Stressed but optimistic',
    stats: { humor: 90, stress: 95, luck: 25, choices: 80 },
    position: { x: 0, y: 0.1 },
    connections: ['parents', 'grandma', 'friend', 'intruder']
  },
  {
    id: 'parents',
    name: 'Mom & Dad',
    role: 'Authority Figures',
    bio: 'The rules makers who always compare you to your overachieving friend and hate the 8 specific things you do.',
    vibe: 'Strict, vocal, loving',
    stats: { rules: 100, pressure: 95, patience: 15, volume: 90 },
    position: { x: -1.6, y: -0.9 },
    connections: ['hero', 'friend']
  },
  {
    id: 'grandma',
    name: 'Sweet Grandma',
    role: 'The Ultimate Feeder',
    bio: 'The source of endless love and cookie jars. Will absolutely not allow you to leave her house hungry.',
    vibe: 'Infinite warmth & sugar',
    stats: { cooking: 100, love: 100, rules: 10, hearing: 30 },
    position: { x: 1.6, y: -0.9 },
    connections: ['hero']
  },
  {
    id: 'friend',
    name: 'The Perfect Friend',
    role: 'Family Rival',
    bio: 'The legendary child your parents compare you to. Sleeps 8 hours, gets A+, and never complains.',
    vibe: 'Annoyingly flawless',
    stats: { grades: 100, respect: 98, faults: 0, sleep: 90 },
    position: { x: -1.6, y: 1.0 },
    connections: ['hero', 'parents']
  },
  {
    id: 'intruder',
    name: 'The Mystery Thief',
    role: 'Chaos Agent',
    bio: 'The silent burglar who steals cookie jars and proposes choice buttons, offering $1,000,000 at a catch.',
    vibe: 'Suspicious & quiet',
    stats: { stealth: 95, chaos: 100, warning_ignores: 90, cash: 85 },
    position: { x: 1.6, y: 1.0 },
    connections: ['hero']
  }
];

const getCoords = (pos) => {
  return {
    x: pos.x * 120,
    y: pos.y * 95
  };
};

export default function Universe() {
  const [selectedId, setSelectedId] = useState('hero');
  const [rippleCoords, setRippleCoords] = useState(null);
  const [rippleKey, setRippleKey] = useState(0);
  const [modalVideo, setModalVideo] = useState(null);
  const [hoveredKeyframe, setHoveredKeyframe] = useState(null);
  const [activeTool, setActiveTool] = useState('cursor');

  // Load live YouTube Shorts from API
  const { episodes, loading } = useYouTubeData({ maxResults: 50 });

  const selectedNode = characterNodes.find(n => n.id === selectedId) || characterNodes[0];

  // Group videos for the timeline tracks
  const track1Vids = episodes.filter(ep => ep.tags.includes('Relatable')).slice(0, 14);
  const track2Vids = episodes.filter(ep => ep.tags.includes('Choices')).slice(0, 14);
  const track3Vids = episodes.filter(ep => ep.tags.includes('Lessons') || ep.tags.includes('Chaos')).slice(0, 14);

  const handleNodeClick = (id, x, y) => {
    setSelectedId(id);
    setRippleCoords({ x, y });
    setRippleKey(prev => prev + 1);
  };

  // Build symmetrical connection lines between character nodes
  const connections = [];
  const seenPairs = new Set();

  characterNodes.forEach(node => {
    const from = getCoords(node.position);
    node.connections.forEach(targetId => {
      const target = characterNodes.find(n => n.id === targetId);
      if (target) {
        const pairKey = [node.id, targetId].sort().join('-');
        if (!seenPairs.has(pairKey)) {
          seenPairs.add(pairKey);
          const to = getCoords(target.position);
          connections.push({
            id: pairKey,
            x1: from.x,
            y1: from.y,
            x2: to.x,
            y2: to.y
          });
        }
      }
    });
  });

  // Vector sketches for properties panel
  const renderMiniProfileDoodle = (id) => {
    switch (id) {
      case 'hero':
        return (
          <svg viewBox="0 0 100 100" className={styles.miniProfileDoodle}>
            {/* Head - overlapping loops */}
            <path d="M48,20 C56,19 62,24 62,31 C62,38 56,43 48,42 C40,41 35,36 36,29 C37,22 42,19 48,20 M46,18 C56,17 64,23 64,31 C64,39 56,45 46,44" fill="none" stroke="currentColor" strokeWidth="2.5" />
            {/* Body */}
            <path d="M50,42 Q48,60 51,75 M49,43 Q52,60 49,74" fill="none" stroke="currentColor" strokeWidth="2.5" />
            {/* Arms */}
            <path d="M25,52 Q50,48 75,52 M27,54 Q50,50 73,54" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Legs */}
            <path d="M51,75 Q40,88 34,96 M49,74 Q39,89 36,95" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M51,75 Q60,88 66,96 M52,74 Q61,87 64,95" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
      case 'parents':
        return (
          <svg viewBox="0 0 100 100" className={styles.miniProfileDoodle}>
            {/* Mom head */}
            <path d="M38,22 C44,21 48,25 48,30 C48,35 44,39 38,38 C32,37 28,33 29,28 Z M36,20 C44,19 50,24 50,30" fill="none" stroke="currentColor" strokeWidth="2.5" />
            {/* Mom body */}
            <path d="M38,38 L38,68 M36,39 L36,67" fill="none" stroke="currentColor" strokeWidth="2.5" />
            {/* Angry veins (accent red) */}
            <path d="M68,18 Q74,23 80,20 M70,22 Q75,25 78,24" stroke="var(--accent-red)" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Shared arm/leg sketches */}
            <path d="M22,48 Q38,45 52,48" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M38,68 Q30,82 25,92 M38,68 Q46,82 50,92" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        );
      case 'grandma':
        return (
          <svg viewBox="0 0 100 100" className={styles.miniProfileDoodle}>
            {/* Head */}
            <path d="M48,20 C56,19 62,24 62,31 C62,38 56,43 48,42 C40,41 35,36 36,29 Z M46,18 C56,17 64,23 64,31" fill="none" stroke="currentColor" strokeWidth="2.5" />
            {/* Dress/Body - triangle */}
            <path d="M50,42 C42,48 38,58 38,72 L62,72 C62,58 58,48 50,42 Z M48,44 C42,50 40,58 40,70 L60,70 C60,58 58,50 50,44 Z" stroke="currentColor" strokeWidth="2.5" fill="none" />
            {/* Spectacles (double hand-drawn circles) */}
            <path d="M42,28 A3,3 0 1,0 48,28 A3,3 0 1,0 42,28 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M52,28 A3,3 0 1,0 58,28 A3,3 0 1,0 52,28 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M48,28 L52,28" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        );
      case 'friend':
        return (
          <svg viewBox="0 0 100 100" className={styles.miniProfileDoodle}>
            {/* Head */}
            <path d="M48,22 C56,21 62,26 62,33 C62,40 56,45 48,44 C40,43 35,38 36,31 Z M46,20 C56,19 64,25 64,33" fill="none" stroke="currentColor" strokeWidth="2.5" />
            {/* Body */}
            <path d="M50,44 L50,75 M49,46 L49,74" stroke="currentColor" strokeWidth="2.5" />
            {/* Halo ring - sketchy double ellipses */}
            <path d="M36,12 Q50,7 64,12 Q64,17 50,17 Q36,17 36,12 M38,10 Q50,6 62,10" fill="none" stroke="var(--accent-red)" strokeWidth="1.5" />
          </svg>
        );
      case 'intruder':
        return (
          <svg viewBox="0 0 100 100" className={styles.miniProfileDoodle}>
            {/* Head */}
            <path d="M48,20 C56,19 62,24 62,31 C62,38 56,43 48,42 C40,41 35,36 36,29 Z M46,18 C56,17 64,23 64,31" fill="none" stroke="currentColor" strokeWidth="2.5" />
            {/* Bandit mask face - sketchy blob */}
            <path d="M35,24 C45,22 55,22 65,24 C65,28 55,30 35,30 Z" fill="var(--ink-black)" />
            {/* Body */}
            <path d="M50,42 L50,75" stroke="currentColor" strokeWidth="2.5" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.universe} data-page="universe">
      {/* Rulers backdrop on the outer screen */}
      <div className={styles.rulersBackground} />

      <header className={styles.header}>
        <h1 className={styles.title}>doodle studio animator</h1>
        <p className={styles.subtitle}>
          Select character nodes on the stage canvas, adjust variables in the Inspector, or scrub keyframes in the timeline to play matching Shorts.
        </p>
      </header>

      {/* Symmetrical Studio Workspace Wrapper */}
      <div className={styles.studioWorkspace}>
        
        {/* Left Toolbar (Pencil, Brush, Eraser shortcuts) */}
        <div className={styles.toolbarSide}>
          {['cursor', 'pencil', 'brush', 'eraser', 'bucket'].map((tool) => (
            <button
              key={tool}
              onClick={() => setActiveTool(tool)}
              className={`${styles.toolBtn} ${activeTool === tool ? styles.activeTool : ''}`}
              title={`${tool.toUpperCase()} Tool`}
              aria-label={`${tool} tool`}
            >
              {tool === 'cursor' && '⬈'}
              {tool === 'pencil' && '✎'}
              {tool === 'brush' && '🖌'}
              {tool === 'eraser' && '▰'}
              {tool === 'bucket' && '🪣'}
            </button>
          ))}
        </div>

        {/* Center Stage: Interactive Drawing Board */}
        <div className={styles.stageBoard}>
          {/* Horizontal and Vertical Stage Rulers */}
          <div className={styles.horizontalRuler}>
            <span>0</span><span>200</span><span>400</span><span>600</span><span>800</span><span>1000</span>
          </div>
          <div className={styles.verticalRuler}>
            <span>0</span><span>150</span><span>300</span><span>450</span>
          </div>

          <div className={styles.canvasContainer}>
            <svg viewBox="-400 -220 800 440" className={styles.canvas}>
              <defs>
                <pattern id="dotgrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1.2" fill="rgba(0,0,0,0.12)" />
                </pattern>
              </defs>
              <rect x="-500" y="-300" width="1000" height="600" fill="url(#dotgrid)" />

              {/* Connections */}
              {connections.map((conn) => {
                const midX = (conn.x1 + conn.x2) / 2;
                const midY = (conn.y1 + conn.y2) / 2;
                const dx = conn.x2 - conn.x1;
                const dy = conn.y2 - conn.y1;
                const len = Math.sqrt(dx * dx + dy * dy);
                const ox = (-dy / len) * 12;
                const oy = (dx / len) * 12;

                return (
                  <path
                    key={conn.id}
                    d={`M ${conn.x1} ${conn.y1} Q ${midX + ox} ${midY + oy} ${conn.x2} ${conn.y2}`}
                    fill="none"
                    className={styles.relationLine}
                  />
                );
              })}

              {/* Ripple Effect */}
              {rippleCoords && (
                <motion.circle
                  key={rippleKey}
                  cx={rippleCoords.x}
                  cy={rippleCoords.y}
                  r={30}
                  fill="none"
                  stroke="var(--accent-red)"
                  strokeWidth="2"
                  initial={{ r: 25, opacity: 0.8 }}
                  animate={{ r: 80, opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              )}

              {/* Character Nodes */}
              {characterNodes.map((node) => {
                const coords = getCoords(node.position);
                const isSelected = node.id === selectedId;

                return (
                  <g key={node.id} transform={`translate(${coords.x}, ${coords.y})`} className={styles.nodeGroup}>
                    <g className={styles.floatGroup}>
                      <circle
                        cx="0"
                        cy="0"
                        r="38"
                        fill="none"
                        className={`${styles.nodeRing} ${isSelected ? styles.activeRing : ''}`}
                      />
                      <foreignObject x="-26" y="-26" width="52" height="52">
                        <button
                          onClick={() => handleNodeClick(node.id, coords.x, coords.y)}
                          className={`${styles.nodeButton} ${isSelected ? styles.selectedNode : ''}`}
                        >
                          {renderMiniProfileDoodle(node.id)}
                        </button>
                      </foreignObject>
                      <text
                        x="0"
                        y="46"
                        textAnchor="middle"
                        className={`${styles.nodeLabel} ${isSelected ? styles.selectedLabel : ''}`}
                      >
                        {node.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Side: Properties Inspector Panel */}
        <div className={styles.inspectorSide}>
          <div className={styles.inspectorHeader}>
            <h3>Properties Inspector</h3>
            <span className={styles.fpsBadge}>24.0 FPS</span>
          </div>

          <div className={styles.inspectorContent}>
            {/* Stage Info */}
            <div className={styles.stageSpecs}>
              <div className={styles.specBox}>
                <label>Width</label>
                <span>1920 px</span>
              </div>
              <div className={styles.specBox}>
                <label>Height</label>
                <span>1080 px</span>
              </div>
            </div>

            {/* Profile Detail */}
            <div className={styles.profileSection}>
              <div className={styles.profileHeader}>
                <div className={styles.profileDoodleFrame}>
                  {renderMiniProfileDoodle(selectedNode.id)}
                </div>
                <div className={styles.profileMeta}>
                  <h4>{selectedNode.name}</h4>
                  <span className={styles.roleTag}>{selectedNode.role}</span>
                </div>
              </div>

              <p className={styles.bioText}>{selectedNode.bio}</p>
            </div>

            {/* Variables / Attributes */}
            <div className={styles.variablesSection}>
              <h4>Layer Attributes</h4>
              {Object.entries(selectedNode.stats).map(([attr, val]) => (
                <div key={attr} className={styles.sliderRow}>
                  <span className={styles.attrLabel}>{attr}</span>
                  <div className={styles.sliderBar}>
                    <motion.div 
                      className={styles.sliderFill} 
                      initial={{ width: 0 }}
                      animate={{ width: `${val}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <span className={styles.attrValue}>{val}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Panel: Symmetrical Timeline Panel */}
      <div className={styles.timelinePanel}>
        <div className={styles.timelineHeader}>
          <span className={styles.timelineTitle}>Timeline Layers</span>
          <div className={styles.timelineControls}>
            <span>PLAYHEAD: 0:12</span>
            <span>STAGE SYNCED</span>
          </div>
        </div>

        <div className={styles.timelineBody}>
          {/* Layer Headers Side */}
          <div className={styles.timelineLayerHeaders}>
            <div className={styles.layerHeaderRow}>👁 Relatable Track</div>
            <div className={styles.layerHeaderRow}>👁 Choice Decisions</div>
            <div className={styles.layerHeaderRow}>👁 Lessons & Chaos</div>
          </div>

          {/* Keyframes Track Grid */}
          <div className={styles.timelineTracks}>
            
            {/* Track 1: Relatable */}
            <div className={styles.trackRow}>
              {loading ? (
                <span className={styles.syncText}>Loading clips...</span>
              ) : track1Vids.length === 0 ? (
                <span className={styles.syncText}>No keyframes synced</span>
              ) : (
                track1Vids.map((vid, idx) => (
                  <button
                    key={vid.id}
                    className={styles.keyframeDot}
                    onMouseEnter={() => setHoveredKeyframe(vid)}
                    onMouseLeave={() => setHoveredKeyframe(null)}
                    onClick={() => setModalVideo(vid)}
                    style={{ left: `${idx * 28 + 15}px` }}
                    aria-label={`Play Short: ${vid.title}`}
                  />
                ))
              )}
            </div>

            {/* Track 2: Choices */}
            <div className={styles.trackRow}>
              {loading ? (
                <span className={styles.syncText}>Loading clips...</span>
              ) : track2Vids.length === 0 ? (
                <span className={styles.syncText}>No keyframes synced</span>
              ) : (
                track2Vids.map((vid, idx) => (
                  <button
                    key={vid.id}
                    className={`${styles.keyframeDot} ${styles.choiceFrame}`}
                    onMouseEnter={() => setHoveredKeyframe(vid)}
                    onMouseLeave={() => setHoveredKeyframe(null)}
                    onClick={() => setModalVideo(vid)}
                    style={{ left: `${idx * 28 + 15}px` }}
                    aria-label={`Play Short: ${vid.title}`}
                  />
                ))
              )}
            </div>

            {/* Track 3: Lessons */}
            <div className={styles.trackRow}>
              {loading ? (
                <span className={styles.syncText}>Loading clips...</span>
              ) : track3Vids.length === 0 ? (
                <span className={styles.syncText}>No keyframes synced</span>
              ) : (
                track3Vids.map((vid, idx) => (
                  <button
                    key={vid.id}
                    className={`${styles.keyframeDot} ${styles.chaosFrame}`}
                    onMouseEnter={() => setHoveredKeyframe(vid)}
                    onMouseLeave={() => setHoveredKeyframe(null)}
                    onClick={() => setModalVideo(vid)}
                    style={{ left: `${idx * 28 + 15}px` }}
                    aria-label={`Play Short: ${vid.title}`}
                  />
                ))
              )}
            </div>

          </div>
        </div>

        {/* Hovered keyframe metadata tooltip overlay */}
        <AnimatePresence>
          {hoveredKeyframe && (
            <motion.div
              className={styles.keyframeTooltip}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles.tooltipThumbWrap}>
                <img src={hoveredKeyframe.thumbnailUrl} alt="" />
              </div>
              <div className={styles.tooltipText}>
                <h5>{hoveredKeyframe.title.split('#')[0]}</h5>
                <span>Category: {hoveredKeyframe.tags[0] || 'Relatable'}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <VideoModal
        isOpen={!!modalVideo}
        onClose={() => setModalVideo(null)}
        videoId={modalVideo?.videoId || ''}
        title={modalVideo?.title || ''}
        isShort={true}
      />
    </div>
  );
}
