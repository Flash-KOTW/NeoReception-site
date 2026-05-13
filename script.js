/* ===== NAV STUCK ===== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('stuck', window.scrollY > 24);
}, { passive: true });

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');
const navActs   = document.getElementById('nav-actions');
hamburger.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(open));
  if (navActs) navActs.classList.toggle('open', open);
});
navMenu.querySelectorAll('.nav-a').forEach(a => {
  a.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    if (navActs) navActs.classList.remove('open');
  });
});

/* ===== MOBILE NAV CSS (injected) ===== */
const mobileStyle = document.createElement('style');
mobileStyle.textContent = `
@media (max-width: 768px) {
  .nav-links.open, #nav-actions.open {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 70px; left: 0; right: 0;
    background: rgba(3,1,28,0.97);
    backdrop-filter: blur(20px);
    padding: 20px;
    gap: 4px;
    border-bottom: 1px solid rgba(107,96,255,0.15);
    z-index: 99;
  }
  #nav-actions.open {
    top: auto;
    bottom: 0;
    border-top: 1px solid rgba(107,96,255,0.15);
    border-bottom: none;
    padding: 16px 20px;
    flex-direction: row;
  }
  #nav-actions.open .btn-primary { flex: 1; justify-content: center; }
}`;
document.head.appendChild(mobileStyle);

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.reveal');
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
}, { threshold: 0.1 });
revealEls.forEach(el => ro.observe(el));

/* ===== DASHBOARD COUNTER ANIMATION ===== */
function animCount(el, target, duration = 1600) {
  const start = performance.now();
  const step = now => {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const dmVals = document.querySelectorAll('.dm-val[data-target]');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animCount(e.target, parseInt(e.target.dataset.target));
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
dmVals.forEach(el => counterObs.observe(el));

/* ===== PRICING TOGGLE ===== */
const bbMonthly = document.getElementById('bb-monthly');
const bbAnnual  = document.getElementById('bb-annual');
const planAmts  = document.querySelectorAll('.plan-amt[data-monthly]');

function setPricing(mode) {
  bbMonthly.classList.toggle('active', mode === 'monthly');
  bbAnnual.classList.toggle('active',  mode === 'annual');
  bbMonthly.setAttribute('aria-pressed', String(mode === 'monthly'));
  bbAnnual.setAttribute('aria-pressed',  String(mode === 'annual'));
  planAmts.forEach(el => {
    const from = parseInt(el.textContent.replace(/\D/g,''));
    const to   = parseInt(el.dataset[mode]);
    if (!to || isNaN(from)) return;
    const start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / 280, 1);
      el.textContent = Math.round(from + (to - from) * p);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}
setPricing('monthly');
bbMonthly.addEventListener('click', () => setPricing('monthly'));
bbAnnual.addEventListener('click',  () => setPricing('annual'));

/* ===== SMOOTH ANCHOR SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

/* ===== FAQ SMOOTH ACCORDION ===== */
document.querySelectorAll('.faq-card').forEach(details => {
  const summary = details.querySelector('summary');
  const body    = details.querySelector('.faq-body');
  body.style.overflow = 'hidden';

  summary.addEventListener('click', e => {
    e.preventDefault();
    if (details.open) {
      const h = body.scrollHeight;
      body.style.height = h + 'px';
      requestAnimationFrame(() => {
        body.style.transition = 'height 300ms cubic-bezier(0.16,1,0.3,1), opacity 280ms ease';
        body.style.height  = '0';
        body.style.opacity = '0';
      });
      body.addEventListener('transitionend', () => {
        details.open = false;
        body.style.height = body.style.opacity = body.style.transition = '';
      }, { once: true });
    } else {
      details.open = true;
      body.style.height  = '0';
      body.style.opacity = '0';
      requestAnimationFrame(() => {
        body.style.transition = 'height 320ms cubic-bezier(0.16,1,0.3,1), opacity 300ms ease';
        body.style.height  = body.scrollHeight + 'px';
        body.style.opacity = '1';
      });
      body.addEventListener('transitionend', () => {
        body.style.height = body.style.transition = '';
      }, { once: true });
    }
  });
});

/* ===== FORM SUBMIT ===== */
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = '✓ Demo Request Received!';
      btn.style.background = 'linear-gradient(135deg,#22C55E,#16A34A)';
    }, 1200);
  });
}
