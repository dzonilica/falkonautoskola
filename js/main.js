/* ============================================
   FALKON AUTO ŠKOLA — SHARED JS
   ============================================ */

// ===== Mobile Menu =====
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mmClose = document.getElementById('mmClose');

function openMenu() {
  if (mobileMenu) {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
function closeMenu() {
  if (mobileMenu) {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
}

if (burger) burger.addEventListener('click', openMenu);
if (mmClose) mmClose.addEventListener('click', closeMenu);

// Close on link click
document.querySelectorAll('.mm-links a').forEach(a => {
  a.addEventListener('click', () => {
    // Small delay to allow tap feedback
    setTimeout(closeMenu, 100);
  });
});

// Close on ESC key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

// ===== Pricing tabs =====
function showCat(c) {
  document.querySelectorAll('.pricing-group').forEach(g => g.classList.remove('active'));
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  const grp = document.getElementById('grp-' + c);
  if (grp) grp.classList.add('active');
  const tabs = document.querySelectorAll('.cat-tab');
  const map = { b: 0, a1: 1, a2: 2, a: 3 };
  if (tabs[map[c]]) tabs[map[c]].classList.add('active');
}

// Allow URL hash to set initial tab on cenovnik page
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '');
  if (['b', 'a1', 'a2', 'a'].includes(hash)) {
    showCat(hash);
  }
});

// ===== FAQ =====
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ===== Reveal on scroll =====
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// ===== Form submit (mailto fallback) =====
function submitForm(e) {
  e.preventDefault();
  const ime = document.getElementById('ime').value.trim();
  const tel = document.getElementById('tel').value.trim();
  const email = document.getElementById('email').value.trim();
  const kat = document.getElementById('kategorija').value;
  const poruka = (document.getElementById('poruka') && document.getElementById('poruka').value.trim()) || '';

  const subject = `Upit za vozačku obuku — ${kat || 'opšti'}`;
  const body = `Ime: ${ime}\nTelefon: ${tel}\nEmail: ${email || '—'}\nKategorija: ${kat}\n\nPoruka:\n${poruka || '—'}`;
  window.location.href = `mailto:falkonplus2023kragujevac@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return false;
}

// ===== Background music (cross-page persistence) =====
(function bgMusic() {
  const audio = document.getElementById('bgMusic');
  const btn = document.getElementById('musicBtn');
  if (!audio || !btn) return;

  const KEY_STATE = 'falkonMusic';
  const KEY_TIME = 'falkonMusicTime';
  audio.volume = 0.45;

  function setPlayingUI(on) {
    btn.classList.toggle('playing', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? 'Pauziraj muziku' : 'Pusti muziku');
    btn.setAttribute('title', on ? 'Pauziraj muziku' : 'Pusti muziku');
  }

  // Restore time from prior page
  const savedTime = parseFloat(sessionStorage.getItem(KEY_TIME) || '0');
  if (!isNaN(savedTime) && savedTime > 0) {
    const applyTime = () => { try { audio.currentTime = savedTime; } catch (e) {} };
    if (audio.readyState >= 1) applyTime();
    else audio.addEventListener('loadedmetadata', applyTime, { once: true });
  }

  // Resume playback if it was on
  if (sessionStorage.getItem(KEY_STATE) === 'on') {
    const p = audio.play();
    if (p && typeof p.then === 'function') {
      p.then(() => setPlayingUI(true)).catch(() => setPlayingUI(false));
    } else {
      setPlayingUI(true);
    }
  }

  btn.addEventListener('click', () => {
    if (audio.paused) {
      const p = audio.play();
      if (p && typeof p.then === 'function') {
        p.then(() => {
          setPlayingUI(true);
          sessionStorage.setItem(KEY_STATE, 'on');
        }).catch(() => setPlayingUI(false));
      } else {
        setPlayingUI(true);
        sessionStorage.setItem(KEY_STATE, 'on');
      }
    } else {
      audio.pause();
      setPlayingUI(false);
      sessionStorage.setItem(KEY_STATE, 'off');
    }
  });

  // Keep time fresh so navigation resumes seamlessly
  setInterval(() => {
    if (!audio.paused) sessionStorage.setItem(KEY_TIME, String(audio.currentTime));
  }, 1000);
  window.addEventListener('pagehide', () => {
    sessionStorage.setItem(KEY_TIME, String(audio.currentTime));
  });

  audio.addEventListener('ended', () => setPlayingUI(false));
})();

// ===== Highlight today in hours table =====
(function highlightToday() {
  const today = new Date().getDay(); // 0=Sun, 1=Mon...
  const map = { 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat', 0: 'sun' };
  const el = document.querySelector(`.hours-row[data-day="${map[today]}"]`);
  if (el) el.classList.add('today');
})();
