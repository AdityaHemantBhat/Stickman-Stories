// Web Audio API Synthesizer for Stickman Stories
let audioCtx = null;
let enabled = false;
let scratchOsc = null;
let scratchFilter = null;
let scratchGain = null;
let isScribbling = false;

// Audio Context Lazy Initialization (must be user-triggered)
function init() {
  if (audioCtx) return;
  if (typeof window === 'undefined') return;
  
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  
  audioCtx = new AudioContextClass();
}

export const audioManager = {
  toggle: () => {
    init();
    if (!audioCtx) return false;
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    enabled = !enabled;
    return enabled;
  },
  
  isEnabled: () => enabled,

  // Synthesize short pencil tap/click (triangle wave frequency decay + tiny noise burst)
  playTap: () => {
    if (!enabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') return;
      
      const time = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, time);
      osc.frequency.exponentialRampToValueAtTime(150, time + 0.04);
      
      gain.gain.setValueAtTime(0.08, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(time);
      osc.stop(time + 0.05);

      // Add a tiny bit of filtered noise for sketch texture
      createNoiseBurst(0.015, 0.03, 2000);
    } catch (e) {
      console.warn('[audioManager] Tap sound failed:', e);
    }
  },

  // Synthesize paper tear / slide transition (swept bandpass filter noise)
  playTear: () => {
    if (!enabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') return;
      
      const time = audioCtx.currentTime;
      const duration = 0.35;
      
      const bufferSize = audioCtx.sampleRate * duration;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      
      // Generate noise with fade-out
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = buffer;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(500, time);
      filter.frequency.exponentialRampToValueAtTime(2200, time + duration);
      filter.Q.setValueAtTime(2.5, time);
      
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.12, time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      
      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      
      noiseSource.start(time);
      noiseSource.stop(time + duration + 0.05);
    } catch (e) {
      console.warn('[audioManager] Tear sound failed:', e);
    }
  },

  // Start continuous loop for drawing pencil scratching
  startScribble: () => {
    if (!enabled || !audioCtx || isScribbling) return;
    try {
      if (audioCtx.state === 'suspended') return;
      isScribbling = true;

      const time = audioCtx.currentTime;
      
      // Continuous noise loop buffer
      const bufferSize = audioCtx.sampleRate * 2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      scratchOsc = audioCtx.createBufferSource();
      scratchOsc.buffer = buffer;
      scratchOsc.loop = true;
      
      scratchFilter = audioCtx.createBiquadFilter();
      scratchFilter.type = 'bandpass';
      scratchFilter.frequency.setValueAtTime(1400, time);
      scratchFilter.Q.setValueAtTime(3.5, time);
      
      scratchGain = audioCtx.createGain();
      scratchGain.gain.setValueAtTime(0.001, time);
      
      scratchOsc.connect(scratchFilter);
      scratchFilter.connect(scratchGain);
      scratchGain.connect(audioCtx.destination);
      
      scratchOsc.start(time);
    } catch (e) {
      console.warn('[audioManager] Scribble start failed:', e);
    }
  },

  // Update speed-based volume/pitch for drawing
  updateScribble: (speed) => {
    if (!enabled || !audioCtx || !isScribbling || !scratchGain) return;
    try {
      const time = audioCtx.currentTime;
      // Map velocity to gain volume and filter frequency
      const targetVolume = Math.min(speed * 0.015, 0.2);
      const targetFreq = 1000 + Math.min(speed * 3, 1400); // ranges between 1000Hz and 2400Hz
      
      scratchGain.gain.setTargetAtTime(targetVolume, time, 0.03);
      scratchFilter.frequency.setTargetAtTime(targetFreq, time, 0.03);
    } catch (e) {}
  },

  // Stop drawing scribble
  stopScribble: () => {
    if (!isScribbling) return;
    isScribbling = false;
    
    if (!scratchGain || !audioCtx) return;
    try {
      const time = audioCtx.currentTime;
      scratchGain.gain.setValueAtTime(scratchGain.gain.value, time);
      scratchGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
      
      const sourceToStop = scratchOsc;
      setTimeout(() => {
        try {
          sourceToStop.stop();
        } catch (e) {}
      }, 70);
      
      scratchOsc = null;
      scratchFilter = null;
      scratchGain = null;
    } catch (e) {}
  }
};

// Helper for quick noise bursts (simulates textured taps)
function createNoiseBurst(volume, duration, highpassFreq) {
  if (!audioCtx) return;
  try {
    const bufferSize = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(highpassFreq, audioCtx.currentTime);
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    
    source.start();
    source.stop(audioCtx.currentTime + duration + 0.02);
  } catch (e) {}
}
