/**
 * Konfident Interview 2025 — Landing Page Hero Animations & Interactions
 * Resilient animation orchestrations with native requestAnimationFrame score ticker
 */
(function () {
  'use strict';

  // 1. Bulletproof 60/120fps Score Counter (0 -> 28)
  function initScoreCounter() {
    const scoreEl = document.getElementById('heroLiveScore');
    if (!scoreEl) return;

    const target = 28;
    const duration = 1200;
    const startDelay = 350;

    // Reset to 0 briefly so the user sees the fluid count-up
    scoreEl.textContent = '0';

    setTimeout(() => {
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutCubic: 1 - pow(1 - progress, 3)
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(ease * target);
        scoreEl.textContent = String(current);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          scoreEl.textContent = String(target);
        }
      }

      requestAnimationFrame(updateCounter);
    }, startDelay);
  }

  // 2. Rubric Progress Bars Fill Animation
  function initRubricBars() {
    const bars = document.querySelectorAll('.rubric-progress-fill');
    bars.forEach((bar, index) => {
      const targetWidth = bar.getAttribute('data-width') || '100%';
      // Reset width to 0% initially for animation
      bar.style.width = '0%';
      bar.style.transition = `width 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${300 + (index * 160)}ms`;
      setTimeout(() => {
        bar.style.width = targetWidth;
      }, 60);
    });
  }

  // 3. Smooth Anchor Navigation with Sticky Header Offset
  function initSmoothNav() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const header = document.querySelector('.landing-header');
    const headerOffset = header ? header.offsetHeight + 16 : 80;

    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // 4. Subtle 3D Card Parallax on Desktop
  function initCardParallax() {
    const wrapper = document.querySelector('.hero-showcase-wrapper');
    const primaryCard = document.querySelector('.hero-card-primary');
    if (!wrapper || !primaryCard || window.innerWidth < 992) return;

    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - (rect.width / 2);
      const y = e.clientY - rect.top - (rect.height / 2);

      const tiltX = (y / (rect.height / 2)) * -4;
      const tiltY = (x / (rect.width / 2)) * 4;

      primaryCard.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px)`;
    });

    wrapper.addEventListener('mouseleave', () => {
      primaryCard.style.transform = '';
    });
  }

  // 5. Anime.js Entrance & Particle Animations (when library is present)
  function initAnimeEnhancements() {
    if (typeof anime === 'undefined') return;

    try {
      const runAnime = (params) => {
        if (typeof anime === 'function') {
          return anime(params);
        } else if (anime && typeof anime.animate === 'function') {
          const targets = params.targets;
          const opts = { ...params };
          delete opts.targets;
          return anime.animate(targets, opts);
        }
      };

      // Entrance staggered typography
      runAnime({
        targets: '.hero-animate-in',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: (el, i) => 80 * i,
        duration: 700,
        easing: 'easeOutCubic',
      });

      // Ambient background particles
      const bgDots = document.querySelectorAll('.ambient-particle');
      if (bgDots.length > 0) {
        runAnime({
          targets: bgDots,
          translateY: () => (Math.random() * 24) - 12,
          translateX: () => (Math.random() * 16) - 8,
          scale: () => 0.85 + Math.random() * 0.3,
          opacity: () => 0.25 + Math.random() * 0.35,
          duration: () => 3500 + Math.random() * 2500,
          direction: 'alternate',
          loop: true,
          easing: 'easeInOutSine',
        });
      }
    } catch (err) {
      console.debug('[Anime Enhancement Note]', err);
    }
  }

  // Master Initialization
  function init() {
    initScoreCounter();
    initRubricBars();
    initSmoothNav();
    initCardParallax();
    initAnimeEnhancements();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
