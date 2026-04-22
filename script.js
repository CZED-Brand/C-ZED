/* =========================================
   C'ZED — script.js
   Interactive Features & Animations
   ========================================= */

'use strict';

// ─── CUSTOM CURSOR ───────────────────────────────────────────────
const updateCursor = (e) => {
  document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
  document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
};
document.addEventListener('mousemove', updateCursor);


// ─── SCROLL PROGRESS BAR ─────────────────────────────────────────
const scrollBar = document.getElementById('scrollProgress');
const updateScrollProgress = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollBar.style.width = progress + '%';
};
window.addEventListener('scroll', updateScrollProgress, { passive: true });


// ─── STICKY NAV ──────────────────────────────────────────────────
const nav = document.getElementById('nav');
const handleNav = () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
};
window.addEventListener('scroll', handleNav, { passive: true });


// ─── MOBILE MENU ─────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  hamburger.classList.toggle('active', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
});

window.closeMenu = () => {
  menuOpen = false;
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('active');
  document.body.style.overflow = '';
};


// ─── SMOOTH SCROLL HELPER ────────────────────────────────────────
window.scrollToSection = (selector) => {
  const el = document.querySelector(selector);
  if (el) {
    const offset = 70;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};


// ─── SCROLL REVEAL (IntersectionObserver) ────────────────────────
const fadeEls = document.querySelectorAll('.fade-in');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

// Stagger children in groups
let currentGroup = null;
let groupIndex = 0;

fadeEls.forEach((el) => {
  const parent = el.parentElement;
  if (parent !== currentGroup) {
    currentGroup = parent;
    groupIndex = 0;
  } else {
    groupIndex++;
  }
  el.dataset.delay = groupIndex * 120;
  revealObserver.observe(el);
});


// ─── DROP UNLOCK ANIMATION ───────────────────────────────────────
const unlockFill = document.getElementById('unlockFill');
const unlockLabel = document.getElementById('unlockLabel');
const dropSection = document.querySelector('.drop');

const dropObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Trigger unlock sequence
      setTimeout(() => {
        unlockFill.style.width = '100%';
      }, 400);

      const messages = [
        'Unlocking collection...',
        'Verifying access...',
        'Collection unlocked.'
      ];

      let step = 0;
      const cycle = setInterval(() => {
        step++;
        if (step < messages.length) {
          unlockLabel.textContent = messages[step];
        } else {
          clearInterval(cycle);
          unlockLabel.textContent = '✓ Drop 001 is live';
          unlockLabel.style.color = 'rgba(200, 169, 122, 0.8)';
        }
      }, 700);

      dropObserver.unobserve(dropSection);
    }
  });
}, { threshold: 0.2 });

if (dropSection) dropObserver.observe(dropSection);


// ─── LIFESTYLE FLOW ANIMATION ────────────────────────────────────
const flowDots = document.querySelectorAll('.flow-dot');
let flowIndex = 0;

const animateFlow = () => {
  flowDots.forEach(d => d.classList.remove('active'));
  flowDots[flowIndex].classList.add('active');
  flowIndex = (flowIndex + 1) % flowDots.length;
};

let flowInterval = null;

const flowObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      flowInterval = setInterval(animateFlow, 1200);
    } else {
      clearInterval(flowInterval);
    }
  });
}, { threshold: 0.5 });

const lifestyleSection = document.querySelector('.lifestyle');
if (lifestyleSection) flowObserver.observe(lifestyleSection);


// ─── SEIZE YOUR MOMENT — MOTIVATIONAL GENERATOR ──────────────────
const moments = [
  "You are not who you were last year. You are becoming something greater.",
  "Every outfit you wear is a declaration. Dress like you've already arrived.",
  "The version of you that succeeds is already within you. Let them through.",
  "Momentum is built in silence, before the world sees it.",
  "Structured on the outside, free on the inside — that's the C'ZED way.",
  "You don't wait for your moment. You seize it — every single day.",
  "Growth isn't loud. It's the quiet confidence of knowing your direction.",
  "Your identity is not fixed. It is forged — in movement, in choice, in texture.",
  "The world rewards those who show up as themselves, fully and without apology.",
  "You are not becoming someone else. You are becoming more of yourself.",
  "Every step forward, however small, is a seize. Do not discount it.",
  "Corduroy doesn't crumble. Neither do you.",
  "Nairobi raised you. The world awaits your arrival.",
  "Ambition wears corduroy. It always has.",
  "Be the person who walks in and makes the room feel it.",
  "This is your moment. It's not coming — it's here.",
  "Build the version of yourself you'd be proud to wear.",
  "The texture of your journey matters as much as the destination.",
];

let lastIndex = -1;
let seizeCount = parseInt(localStorage.getItem('czed_seize_count') || '0', 10);
const seizeCountEl = document.getElementById('seizeCount');
const seizeMessageEl = document.getElementById('seizeMessage');
const seizeOutput = document.getElementById('seizeOutput');

if (seizeCountEl) seizeCountEl.textContent = seizeCount;

window.revealMoment = () => {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * moments.length);
  } while (randomIndex === lastIndex);
  lastIndex = randomIndex;

  // Animate out
  seizeMessageEl.style.opacity = '0';
  seizeMessageEl.style.transform = 'translateY(10px)';

  setTimeout(() => {
    seizeMessageEl.textContent = moments[randomIndex];
    seizeMessageEl.style.opacity = '1';
    seizeMessageEl.style.transform = 'translateY(0)';
    seizeMessageEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  }, 250);

  // Pulse the output box
  seizeOutput.classList.remove('active');
  void seizeOutput.offsetWidth; // reflow
  seizeOutput.classList.add('active');

  // Increment counter
  seizeCount++;
  localStorage.setItem('czed_seize_count', seizeCount);
  seizeCountEl.textContent = seizeCount;

  // Button ripple
  const btn = document.getElementById('seizeBtn');
  btn.classList.add('clicked');
  setTimeout(() => btn.classList.remove('clicked'), 400);
};


// ─── PRODUCT CARD TILT EFFECT ─────────────────────────────────────
const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    card.style.transform = `translateY(-8px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'border-color 0.3s, box-shadow 0.3s';
  });
});


// ─── BUTTON CLICK ANIMATIONS ─────────────────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    // Ripple effect
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      transform: translate(-50%, -50%) scale(0);
      animation: rippleAnim 0.6s ease-out forwards;
      left: ${e.clientX - rect.left}px;
      top: ${e.clientY - rect.top}px;
      pointer-events: none;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Inject ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleAnim {
    to { transform: translate(-50%, -50%) scale(1); opacity: 0; }
  }
  #seizeBtn.clicked {
    transform: scale(0.97);
  }
`;
document.head.appendChild(rippleStyle);


// ─── HERO PARALLAX ───────────────────────────────────────────────
const heroContent = document.querySelector('.hero__content');
const heroTexture = document.querySelector('.hero__texture');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (heroContent && scrollY < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
    heroTexture.style.transform = `translateY(${scrollY * 0.1}px)`;
  }
}, { passive: true });


// ─── LIFESTYLE CARD ACTIVE STATE ─────────────────────────────────
const lifestyleCards = document.querySelectorAll('.lifestyle-card');
lifestyleCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    lifestyleCards.forEach(c => c.style.opacity = c === card ? '1' : '0.6');
  });
  card.addEventListener('mouseleave', () => {
    lifestyleCards.forEach(c => c.style.opacity = '1');
  });
});


// ─── ABOUT FABRIC ANIMATION RANDOMIZER ───────────────────────────
const fabricLines = document.querySelectorAll('.fabric-line');
setInterval(() => {
  const randomLine = fabricLines[Math.floor(Math.random() * fabricLines.length)];
  randomLine.style.background = `linear-gradient(to bottom, #E8D5B4, #8B6914)`;
  setTimeout(() => {
    randomLine.style.background = '';
  }, 600);
}, 1800);


// ─── MARQUEE PAUSE ON HOVER ───────────────────────────────────────
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  const marqueeStrip = marqueeTrack.parentElement;
  marqueeStrip.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeStrip.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}


// ─── ACTIVE NAV LINK ON SCROLL ───────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

const activeLinkObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => activeLinkObserver.observe(section));

// Add active link style
const activeLinkCSS = document.createElement('style');
activeLinkCSS.textContent = `
  .nav__links a.active {
    color: var(--tan) !important;
  }
  .nav__links a.active::after {
    width: 100% !important;
  }
`;
document.head.appendChild(activeLinkCSS);


// ─── SEIZE SECTION: CORDUROY BG ANIMATION ────────────────────────
const seizeSection = document.querySelector('.seize');
if (seizeSection) {
  seizeSection.addEventListener('mousemove', (e) => {
    const rect = seizeSection.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    seizeSection.style.backgroundPosition = `${x}% ${y}%`;
  });
}


// ─── PAGE LOAD ANIMATION ─────────────────────────────────────────
window.addEventListener('load', () => {
  document.body.classList.add('loaded');

  // Trigger initial hero animations already handled by CSS
  // Animate nav in
  nav.style.opacity = '0';
  nav.style.transform = 'translateY(-20px)';
  requestAnimationFrame(() => {
    nav.style.transition = 'opacity 0.6s ease 0.8s, transform 0.6s ease 0.8s';
    nav.style.opacity = '1';
    nav.style.transform = 'translateY(0)';
  });
});


// ─── KEYBOARD ACCESSIBILITY ──────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOpen) {
    closeMenu();
  }
  if (e.key === 'Enter' && document.activeElement === document.getElementById('seizeBtn')) {
    revealMoment();
  }
});


// ─── PREFERS REDUCED MOTION ──────────────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
  const noMotionStyle = document.createElement('style');
  noMotionStyle.textContent = `
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  `;
  document.head.appendChild(noMotionStyle);
}
