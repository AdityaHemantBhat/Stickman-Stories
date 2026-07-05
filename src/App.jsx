import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';
import PageTransition from './components/layout/PageTransition';
import CustomCursor from './components/ui/CustomCursor';
import Ribbons from './components/ui/Ribbons';

import Home from './pages/Home';
import Episodes from './pages/Episodes';
import Universe from './pages/Universe';
import About from './pages/About';
import Community from './pages/Community';

import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';

gsap.registerPlugin(ScrollTrigger);

/**
 * App Shell
 * 
 * Architecture:
 * - Lenis handles smooth scrolling at the app level
 * - AnimatePresence wraps Routes for page transitions (Framer Motion domain)
 * - GSAP ScrollTrigger synced with Lenis scroll position
 * - CustomCursor rendered as persistent overlay
 * - Nav/Footer persist across route changes
 */
export default function App() {
  const location = useLocation();

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ease-out-expo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Store on window for child component access if needed
    window.__lenis = lenis;

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      delete window.__lenis;
    };
  }, []);

  // Refresh ScrollTriggers on route change
  useEffect(() => {
    // Small delay to let page transition complete before recalculating
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 800);

    // Scroll to top on route change
    window.scrollTo(0, 0);
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    }

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      {/* Skip to content — accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* WebGL Ribbon Doodle Pen Trail */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9997 }}>
        <Ribbons
          baseThickness={24}
          colors={["#000000"]}
          speedMultiplier={0.7}
          maxAge={600}
          enableFade={true}
          enableShaderEffect={true}
        />
      </div>

      {/* Custom cursor — persistent, above everything */}
      <CustomCursor />

      {/* Navigation — persistent across routes */}
      <Nav />

      {/* Main content with page transitions */}
      <main id="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
            <Route
              path="/episodes"
              element={
                <PageTransition>
                  <Episodes />
                </PageTransition>
              }
            />
            <Route
              path="/universe"
              element={
                <PageTransition>
                  <Universe />
                </PageTransition>
              }
            />
            <Route
              path="/about"
              element={
                <PageTransition>
                  <About />
                </PageTransition>
              }
            />
            <Route
              path="/community"
              element={
                <PageTransition>
                  <Community />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer — persistent across routes */}
      <Footer />
    </>
  );
}
