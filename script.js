/* ============================================================
   script.js — Sakshyam Dhital's Portfolio
   Handles:
     1. Particle canvas background
     2. Sticky / scroll-aware navbar
     3. Mobile hamburger menu
     4. Typing text animation
     5. Scroll-reveal animations
     6. Skill-bar animations (triggered by IntersectionObserver)
     7. Active nav-link highlight
     8. Back-to-top button
     9. Contact form handler
   ============================================================ */

/* ============================================================
   1. PARTICLE CANVAS BACKGROUND
   Draws lots of tiny dots that float around and connect when
   close enough — creates a "star-field / network" effect.
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');

  // Resize canvas to fill the window
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Each particle has a position, velocity, size, and opacity
  const PARTICLE_COUNT = 80;
  const MAX_DIST       = 130;   // max distance to draw a connection line
  const particles      = [];

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x     = Math.random() * canvas.width;
      this.y     = Math.random() * canvas.height;
      this.vx    = (Math.random() - 0.5) * 0.5; // slow drift
      this.vy    = (Math.random() - 0.5) * 0.5;
      this.size  = Math.random() * 2 + 0.8;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      // Wrap around edges instead of bouncing
      if (this.x < 0)              this.x = canvas.width;
      if (this.x > canvas.width)   this.x = 0;
      if (this.y < 0)              this.y = canvas.height;
      if (this.y > canvas.height)  this.y = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 198, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  // Create all particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update & draw each particle
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw connection lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DIST) {
          // Line fades out as distance increases
          const opacity = (1 - dist / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 198, 255, ${opacity})`;
          ctx.lineWidth   = 0.7;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
})();


/* ============================================================
   2. STICKY / SCROLL-AWARE NAVBAR
   Adds a 'scrolled' class once the user scrolls past 50px,
   which triggers the glass-background style in CSS.
   ============================================================ */
const navbar  = document.getElementById('navbar');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Toggle glass background on navbar
  navbar.classList.toggle('scrolled', scrollY > 50);

  // Show / hide back-to-top button
  backTop.classList.toggle('show', scrollY > 400);

  // Highlight the nav link for the visible section
  highlightActiveNav();
});


/* ============================================================
   3. MOBILE HAMBURGER MENU
   Toggles the .open class on the nav list and hamburger icon
   so the slide-in menu works on small screens.
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close the mobile menu when any link is tapped
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});


/* ============================================================
   4. TYPING TEXT ANIMATION
   Cycles through an array of strings, types them letter by
   letter, then erases them — creating a typewriter effect.
   ============================================================ */
(function initTyping() {
  const el      = document.getElementById('typingText');
  const phrases = [
    'Beginner C++ Programmer',
    'Tech Enthusiast',
    'Web Developer (learning!)',
    'Problem Solver',
    'Future Software Engineer'
  ];
  let phraseIndex = 0;  // which phrase we're on
  let charIndex   = 0;  // which character we're on
  let isDeleting  = false;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      // Remove one character
      el.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Add one character
      el.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    // Decide what to do next
    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Finished typing — pause then start deleting
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting — move to next phrase
      isDeleting   = false;
      phraseIndex  = (phraseIndex + 1) % phrases.length;
      delay        = 400;
    }

    setTimeout(type, delay);
  }

  // Start after a short initial delay
  setTimeout(type, 800);
})();


/* ============================================================
   5. SCROLL-REVEAL ANIMATIONS
   Uses IntersectionObserver to add .visible to elements with
   the .reveal class when they enter the viewport.
   ============================================================ */
(function initReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // only animate once
        }
      });
    },
    { threshold: 0.12 }  // trigger when 12% of element is visible
  );

  revealElements.forEach(el => observer.observe(el));
})();


/* ============================================================
   6. SKILL BAR ANIMATIONS
   Sets the width of each .skill-bar once the skills section
   scrolls into view (uses the data-width attribute).
   ============================================================ */
(function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar');
  let animated    = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          // Small stagger: each bar starts slightly after the previous
          skillBars.forEach((bar, i) => {
            setTimeout(() => {
              const targetWidth = bar.getAttribute('data-width');
              bar.style.width   = targetWidth + '%';
            }, i * 150);
          });
        }
      });
    },
    { threshold: 0.2 }
  );

  // Observe the skills section
  const skillsSection = document.getElementById('skills');
  if (skillsSection) observer.observe(skillsSection);
})();


/* ============================================================
   7. ACTIVE NAV-LINK HIGHLIGHT
   Updates which nav link has the .active class based on
   which section is currently in view while scrolling.
   ============================================================ */
function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');
  let currentSection = '';

  sections.forEach(section => {
    // If we've scrolled past the top of this section
    if (window.scrollY >= section.offsetTop - 120) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinkEls.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    }
  });
}


/* ============================================================
   8. BACK-TO-TOP BUTTON
   Smoothly scrolls to the top of the page when clicked.
   ============================================================ */
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ============================================================
   9. CONTACT FORM HANDLER
   Validates inputs and shows a success message.
   (This is a front-end only demo — no server involved.)
   ============================================================ */
function handleFormSubmit() {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject') ? document.getElementById('subject').value.trim() : 'No subject';
  const message = document.getElementById('message').value.trim();
  const status  = document.getElementById('formStatus');
  const sendBtn = document.getElementById('sendBtn');

  // Basic validation
  if (!name || !email || !message) {
    status.textContent = '⚠️ Please fill in all fields before sending.';
    status.style.color = '#ff6b6b';
    return;
  }

  // Simple email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    status.textContent = '⚠️ Please enter a valid email address.';
    status.style.color = '#ff6b6b';
    return;
  }

  // Simulate sending (in a real project you'd call a server/API here)
  sendBtn.disabled      = true;
  sendBtn.textContent   = '⏳ Sending...';

  setTimeout(() => {
    // Clear the form
    document.getElementById('name').value    = '';
    document.getElementById('email').value   = '';
    if (document.getElementById('subject')) document.getElementById('subject').value = '';
    document.getElementById('message').value = '';

    status.textContent  = '✅ Message sent! I\'ll get back to you soon 🚀';
    status.style.color  = '#27c93f';
    sendBtn.disabled    = false;
    sendBtn.innerHTML   = '<i class="fa-solid fa-paper-plane"></i> Send Message';

    // Clear success message after 5 seconds
    setTimeout(() => { status.textContent = ''; }, 5000);
  }, 1500);
}


/* ============================================================
   10. REVEAL SKILL CARDS & PROJECT CARDS ON SCROLL
   Adds a small staggered entrance for cards when their
   parent section becomes visible.
   ============================================================ */
(function staggerCards() {
  const cardGroups = [
    { parent: '.skills-grid',   cards: '.skill-card' },
    { parent: '.projects-grid', cards: '.project-card' }
  ];

  cardGroups.forEach(({ parent, cards }) => {
    const parentEl = document.querySelector(parent);
    if (!parentEl) return;

    const cardEls = parentEl.querySelectorAll(cards);

    // Set initial hidden state via inline style
    cardEls.forEach((card, i) => {
      card.style.opacity   = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            cardEls.forEach(card => {
              card.style.opacity   = '1';
              card.style.transform = 'translateY(0)';
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(parentEl);
  });
})();
