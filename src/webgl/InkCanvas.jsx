import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { usePerformanceTier, getParticleCount, getMaxDPR } from '../hooks/usePerformanceTier';

/**
 * Reusable WebGL ink particle canvas.
 * Used in Hero, Universe background, and Community CTA sections.
 *
 * Props:
 *   theme: 'paper' | 'chalkboard' — determines bg and stroke colors
 *   interactive: boolean — enables mouse reactivity
 *   className: string — CSS class for the container
 */

// ─── Vertex Shader ───
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseInfluence;

  attribute float aRandom;
  attribute float aSize;
  attribute vec3 aBasePosition;

  varying float vAlpha;
  varying float vRandom;

  // Simplex-ish noise for organic movement
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 perm(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float noise(vec3 p) {
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);
    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);
    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);
    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));
    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
    return o4.y * d.y + o4.x * (1.0 - d.y);
  }

  void main() {
    vec3 pos = aBasePosition;

    // Curl-noise-like displacement
    float t = uTime * 0.3;
    float nx = noise(pos * 1.5 + t);
    float ny = noise(pos * 1.5 + t + 100.0);
    float nz = noise(pos * 1.5 + t + 200.0);

    pos.x += (nx - 0.5) * 0.6 * aRandom;
    pos.y += (ny - 0.5) * 0.6 * aRandom;
    pos.z += (nz - 0.5) * 0.3 * aRandom;

    // Mouse repulsion / attraction
    if (uMouseInfluence > 0.01) {
      vec2 toMouse = uMouse - pos.xy;
      float dist = length(toMouse);
      float influence = smoothstep(1.5, 0.0, dist) * uMouseInfluence;
      pos.xy -= normalize(toMouse + 0.001) * influence * 0.4;
    }

    vAlpha = 0.3 + aRandom * 0.7;
    vRandom = aRandom;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// ─── Fragment Shader ───
const fragmentShader = `
  uniform vec3 uColor;
  varying float vAlpha;
  varying float vRandom;

  void main() {
    // Soft circle with anti-aliased edge (ink dot)
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);

    // Slightly irregular edge for hand-drawn feel
    float edge = 0.5 - vRandom * 0.05;
    float alpha = 1.0 - smoothstep(edge - 0.15, edge, dist);

    if (alpha < 0.01) discard;

    gl_FragColor = vec4(uColor, alpha * vAlpha);
  }
`;

function InkParticles({ theme, interactive, count }) {
  const meshRef = useRef();
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const dampedMouseRef = useRef(new THREE.Vector2(0, 0));
  const { viewport, gl } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uMouseInfluence: { value: interactive ? 1.0 : 0.0 },
    uColor: {
      value: theme === 'chalkboard'
        ? new THREE.Color(0.96, 0.96, 0.94) // chalk-white
        : new THREE.Color(0.04, 0.04, 0.04) // ink-black
    },
  }), [theme, interactive]);

  // Generate particle attributes
  const { positions, randoms, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread across viewport area
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;

      randoms[i] = Math.random();
      sizes[i] = Math.random() * 3 + 1;
    }

    return { positions, randoms, sizes };
  }, [count]);

  // Mouse tracking relative to the canvas element bounds
  useEffect(() => {
    if (!interactive) return;

    const onMouseMove = (e) => {
      const canvas = gl.domElement;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current.x = (x / rect.width) * 2 - 1;
      mouseRef.current.y = -(y / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [interactive, gl]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    uniforms.uTime.value = state.clock.elapsedTime;

    // Damp/lerp mouse position for smooth following
    dampedMouseRef.current.x += (mouseRef.current.x * viewport.width * 0.5 - dampedMouseRef.current.x) * 0.05;
    dampedMouseRef.current.y += (mouseRef.current.y * viewport.height * 0.5 - dampedMouseRef.current.y) * 0.05;
    uniforms.uMouse.value.copy(dampedMouseRef.current);
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aBasePosition"
          count={count}
          array={positions.slice()}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={count}
          array={randoms}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

export default function InkCanvas({ theme = 'paper', interactive = true, className = '' }) {
  const reducedMotion = useReducedMotion();
  const tier = usePerformanceTier();
  const count = getParticleCount(tier);
  const dpr = getMaxDPR(tier);

  // Reduced motion: show a simple gradient instead
  if (reducedMotion) {
    return (
      <div
        className={className}
        style={{
          background: theme === 'chalkboard'
            ? 'var(--chalkboard)'
            : 'var(--paper-cream)',
          width: '100%',
          height: '100%',
        }}
      />
    );
  }

  return (
    <Canvas
      className={className}
      dpr={Math.min(window.devicePixelRatio, dpr)}
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
    >
      <InkParticles theme={theme} interactive={interactive} count={count} />
    </Canvas>
  );
}
