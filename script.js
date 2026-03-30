/* ─────────────────────────────────────────────
   RADIUS — script.js
   ───────────────────────────────────────────── */

/* ── Video: autoplay muted, sound toggle ── */
const productVideo  = document.getElementById('productVideo');
const soundToggle   = document.getElementById('soundToggle');
const iconMuted     = document.getElementById('iconMuted');
const iconSound     = document.getElementById('iconSound');

if (soundToggle && productVideo) {
  soundToggle.addEventListener('click', () => {
    productVideo.muted = !productVideo.muted;
    iconMuted.style.display = productVideo.muted ? '' : 'none';
    iconSound.style.display = productVideo.muted ? 'none' : '';
  });
}

/* ── Navbar: add class on scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ── Mobile menu ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

/* ── Hero interactive demo ── */
const heroCount = document.getElementById('heroCount');
const removeBtn = document.getElementById('removeBtn');
const addBtn    = document.getElementById('addBtn');
const packs     = Array.from(document.querySelectorAll('.cigarette-pack'));

let currentCount = packs.length; // 10

function updateDisplay(newCount) {
  currentCount = Math.max(0, Math.min(packs.length, newCount));
  heroCount.textContent = String(currentCount).padStart(2, '0');
  heroCount.classList.remove('pop');
  void heroCount.offsetWidth; // reflow to restart animation
  heroCount.classList.add('pop');
}

function getVisiblePacks() {
  return packs.filter(p => !p.classList.contains('hidden-pack'));
}

removeBtn.addEventListener('click', () => {
  const visible = getVisiblePacks();
  if (visible.length === 0) return;

  const last = visible[visible.length - 1];
  last.classList.add('removing');
  setTimeout(() => {
    last.classList.add('hidden-pack');
    last.style.visibility = 'hidden';
    last.style.opacity = '0';
    last.classList.remove('removing');
    updateDisplay(currentCount - 1);
  }, 350);
});

addBtn.addEventListener('click', () => {
  const hidden = packs.filter(p => p.classList.contains('hidden-pack'));
  if (hidden.length === 0) return;

  const next = hidden[0];
  next.classList.remove('hidden-pack');
  next.style.visibility = '';
  next.style.opacity = '';
  next.classList.add('adding');
  setTimeout(() => next.classList.remove('adding'), 350);
  updateDisplay(currentCount + 1);
});

/* ── Scroll reveal ── */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings within same parent
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));

/* ── Contact form: simple client-side validation + success state ── */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name     = contactForm.querySelector('#name');
    const business = contactForm.querySelector('#business');
    const email    = contactForm.querySelector('#email');

    let valid = true;

    [name, business, email].forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#e02020';
        valid = false;
      }
    });

    // Basic email check
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.style.borderColor = '#e02020';
      valid = false;
    }

    if (!valid) return;

    // Swap form for success message
    contactForm.innerHTML = `
      <div class="form-success show">
        <div class="success-icon">&#10003;</div>
        <h3>Message Sent!</h3>
        <p>Thanks for reaching out, <strong>${escapeHtml(name.value)}</strong>.<br>
        We'll be in touch with you at <strong>${escapeHtml(email.value)}</strong> shortly.</p>
      </div>
    `;
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Display count pop on every re-render to keep it feeling alive ── */
heroCount.addEventListener('animationend', () => {
  heroCount.classList.remove('pop');
});
