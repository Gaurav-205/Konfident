/**
 * Konfident Interview 2025 — Landing Page Hero Animations & Interactions
 * Supports Dual-Track Scorecard (30 Technical + 20 HR = 50 Grand Total),
 * Resilient requestAnimationFrame score ticker, Interactive track switching,
 * and Official 5-tier grade scale matching src/rubric.js & README.
 */
(function () {
  'use strict';

  // Official Rubric Specifications (README Step 3 & 4 + src/rubric.js)
  const TRACK_DATA = {
    all: {
      caption: 'Total Evaluated Score',
      score: 46,
      max: 50,
      pct: 92,
      gradeLabel: 'Outstanding',
      gradeCls: 'g-a',
      tierCls: 'tier-outstanding',
      gradeStatus: '92% · Placement Ready',
      badgeText: '50 Marks Grand Total',
    },
    tech: {
      caption: 'Technical Interview Score',
      score: 28,
      max: 30,
      pct: 93,
      gradeLabel: 'Outstanding',
      gradeCls: 'g-a',
      tierCls: 'tier-outstanding',
      gradeStatus: '93% · Placement Ready',
      badgeText: '30 Marks Technical Round',
    },
    hr: {
      caption: 'HR Competency Score',
      score: 18,
      max: 20,
      pct: 90,
      gradeLabel: 'Outstanding',
      gradeCls: 'g-a',
      tierCls: 'tier-outstanding',
      gradeStatus: '90% · Placement Ready',
      badgeText: '20 Marks HR Round',
    },
  };

  let currentDisplayedScore = 46;
  let activeTickerRafId = null;

  // 1. Resilient Score Counter (Smooth 60/120fps requestAnimationFrame)
  function animateScoreTo(target, fromVal = null, duration = 850) {
    const scoreEl = document.getElementById('heroLiveScore');
    if (!scoreEl) return;

    if (activeTickerRafId) {
      cancelAnimationFrame(activeTickerRafId);
      activeTickerRafId = null;
    }

    const startVal = fromVal !== null ? fromVal : currentDisplayedScore;
    const diff = target - startVal;

    // Immediately set text if reduced motion is requested or start equals target
    if (diff === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      scoreEl.textContent = String(target);
      currentDisplayedScore = target;
      return;
    }

    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic: 1 - Math.pow(1 - progress, 3)
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(startVal + (diff * ease));
      scoreEl.textContent = String(val);

      if (progress < 1) {
        activeTickerRafId = requestAnimationFrame(updateCounter);
      } else {
        scoreEl.textContent = String(target);
        currentDisplayedScore = target;
        activeTickerRafId = null;
      }
    }

    activeTickerRafId = requestAnimationFrame(updateCounter);
  }

  // 2. Initial Page-Load Counter Animation (0 -> 46)
  function initScoreCounter() {
    const scoreEl = document.getElementById('heroLiveScore');
    if (!scoreEl) return;

    // In HTML, the default is already 46 so SSR/slow clients never see 0
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Begin count-up shortly after initial render
    setTimeout(() => {
      animateScoreTo(46, 0, 1100);
    }, 280);
  }

  // 3. Rubric Progress Bars Fill Animation
  function animateRubricBars(container) {
    const root = container || document;
    const bars = root.querySelectorAll('.rubric-progress-fill');
    bars.forEach((bar, index) => {
      const targetWidth = bar.getAttribute('data-width') || '100%';
      bar.style.width = '0%';
      bar.style.transition = `width 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${100 + (index * 120)}ms`;
      setTimeout(() => {
        bar.style.width = targetWidth;
      }, 50);
    });
  }

  // 4. Interactive Track Switcher (Grand Total 50M <-> Technical 30M <-> HR 20M)
  function initTrackSwitcher() {
    const navButtons = document.querySelectorAll('.track-tab-btn');
    if (!navButtons.length) return;

    const denomEl = document.getElementById('heroLiveDenom');
    const captionEl = document.getElementById('heroTotalCaption');
    const badgeEl = document.getElementById('heroTrackBadge');
    const gradeLabelEl = document.getElementById('heroGradeLabel');
    const gradeStatusEl = document.getElementById('heroGradeStatus');
    const gradePillEl = document.getElementById('heroGradePill');
    const scaleTiers = document.querySelectorAll('.hero-grade-scale-bar .scale-tier');
    const trackGroups = document.querySelectorAll('.rubric-track-group');

    function applyTrack(trackKey) {
      const data = TRACK_DATA[trackKey] || TRACK_DATA.all;

      // Update Nav Buttons
      navButtons.forEach(btn => {
        const isActive = btn.getAttribute('data-track') === trackKey;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      // Update Visibility of Groups
      trackGroups.forEach(group => {
        const groupTrack = group.getAttribute('data-track-group');
        if (trackKey === 'all') {
          group.classList.remove('is-hidden');
        } else {
          group.classList.toggle('is-hidden', groupTrack !== trackKey);
        }
      });

      // Update Header Badge & Denominator
      if (badgeEl) badgeEl.textContent = data.badgeText;
      if (captionEl) captionEl.textContent = data.caption;
      if (denomEl) denomEl.textContent = `/ ${data.max}`;

      // Update Grade Pill & Status
      if (gradeLabelEl) gradeLabelEl.textContent = data.gradeLabel;
      if (gradeStatusEl) gradeStatusEl.textContent = data.gradeStatus;

      if (gradePillEl) {
        gradePillEl.className = 'console-grade-pill ' + data.gradeCls;
      }

      // Highlight Grade Scale Tier
      scaleTiers.forEach(tier => {
        const isTierActive = tier.classList.contains(data.tierCls);
        tier.classList.toggle('active', isTierActive);
      });

      // Animate Score Counter to Track Score
      animateScoreTo(data.score);

      // Animate visible rubric bars
      setTimeout(() => {
        animateRubricBars(document.getElementById('heroRubricContainer'));
      }, 50);
    }

    navButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const trackKey = this.getAttribute('data-track');
        applyTrack(trackKey);
      });
    });
  }

  // 5. Smooth Anchor Navigation with Sticky Header Offset
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

  // 6. Subtle 3D Card Parallax on Desktop
  function initCardParallax() {
    const wrapper = document.querySelector('.hero-showcase-wrapper');
    const primaryCard = document.querySelector('.hero-card-primary');
    if (!wrapper || !primaryCard || window.innerWidth < 992) return;

    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - (rect.width / 2);
      const y = e.clientY - rect.top - (rect.height / 2);

      const tiltX = (y / (rect.height / 2)) * -3.5;
      const tiltY = (x / (rect.width / 2)) * 3.5;

      primaryCard.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px)`;
    });

    wrapper.addEventListener('mouseleave', () => {
      primaryCard.style.transform = '';
    });
  }

  // 7. Anime.js Entrance & Particle Animations (when library is present)
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
    animateRubricBars();
    initTrackSwitcher();
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
