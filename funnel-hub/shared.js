/* Global UIM — Shared JavaScript v2 */

// ── UTM Parameter Capture ──
function initUTM() {
  const params = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const url = new URL(window.location.href);
  const captured = {};

  params.forEach(key => {
    const val = url.searchParams.get(key);
    if (val) {
      sessionStorage.setItem(key, val);
      captured[key] = val;
    }
  });

  // Inject into all forms with hidden UTM fields
  function injectUTMFields() {
    params.forEach(key => {
      const stored = sessionStorage.getItem(key);
      if (!stored) return;
      document.querySelectorAll(`input[name="${key}"]`).forEach(el => {
        el.value = stored;
      });
    });
  }

  // Inject now and again after a short delay (for dynamic forms)
  injectUTMFields();
  setTimeout(injectUTMFields, 800);
}

// ── Integration Attributes ──
function initIntegration() {
  document.querySelectorAll('form[id], div[data-ghl-form], div[data-zapier-hook]').forEach(el => {
    const ghlId = el.getAttribute('data-ghl-form');
    const zapierHook = el.getAttribute('data-zapier-hook');

    // Mark forms for downstream processing
    if (ghlId && ghlId !== 'GHL_FORM_ID_PLACEHOLDER') {
      el.setAttribute('data-integration-ghl', ghlId);
    }
    if (zapierHook && zapierHook !== 'ZAPIER_WEBHOOK_URL_PLACEHOLDER') {
      el.setAttribute('data-integration-zapier', zapierHook);
    }
  });
}

// ── Mobile Nav ──
function initNav() {
  const btn = document.querySelector('.nav-menu-btn');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });
}

// ── Sticky Nav Scroll Class ──
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ── Scroll Animations ──
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ── FAQ (ADA-compliant — faq-question must be <button> elements) ──
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    // Ensure the element is a button (ADA requirement)
    if (btn.tagName !== 'BUTTON') return;

    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (!item) return;
      const wasOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        const q = i.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      // Toggle the clicked one
      if (!wasOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard support: Enter/Space already handled by browser for buttons,
    // but we ensure aria-expanded is initialized
    if (!btn.hasAttribute('aria-expanded')) {
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── Chat Widget ──
function initChat() {
  const btn = document.querySelector('.chat-btn');
  const win = document.querySelector('.chat-window');
  const send = document.querySelector('.chat-send');
  const input = document.querySelector('.chat-input');
  const messages = document.querySelector('.chat-messages');
  if (!btn || !win) return;

  const botResponses = [
    "Great question! Let me connect you with one of our Home Service AI specialists. What's the best number to reach you?",
    "I can show you exactly how much revenue your business could be recovering with our Voice AI system. Want to see the numbers?",
    "We're actively serving businesses across Tampa Bay, Atlanta, Charlotte, Nashville, and nationwide. Are you in the Southeast?",
    "Our most popular bundle for home service companies includes Voice AI + Conversational AI + Reputation Management. Would you like to see a live demo?",
    "I'd love to get you booked with Luis or one of our team members. Can I get your business name and the best time to reach you?",
  ];
  let responseIdx = 0;

  btn.addEventListener('click', () => {
    const isOpen = win.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    const badge = document.querySelector('.chat-badge');
    if (badge) badge.remove();
    if (isOpen && input) setTimeout(() => input.focus(), 300);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && win.classList.contains('open')) {
      win.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });

  function addMessage(text, isUser) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${isUser ? 'user' : 'agent'}`;
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const dot = document.createElement('div');
    dot.className = 'chat-msg agent typing-indicator';
    dot.id = 'typing';
    dot.setAttribute('aria-label', 'Agent is typing');
    dot.innerHTML = '<span aria-hidden="true">●</span><span aria-hidden="true">●</span><span aria-hidden="true">●</span>';
    dot.style.cssText = 'display:flex;gap:4px;align-items:center;padding:10px 14px;';
    dot.querySelectorAll('span').forEach((s, i) => {
      s.style.cssText = `animation:typingDot 1.2s ${i * 0.2}s ease-in-out infinite;font-size:.6rem;color:var(--cyan);`;
    });
    if (!document.getElementById('typingStyle')) {
      const style = document.createElement('style');
      style.id = 'typingStyle';
      style.textContent = '@keyframes typingDot{0%,80%,100%{opacity:.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-4px)}}';
      document.head.appendChild(style);
    }
    messages.appendChild(dot);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    document.getElementById('typing')?.remove();
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    addMessage(text, true);
    if (input) input.value = '';
    showTyping();
    setTimeout(() => {
      removeTyping();
      addMessage(botResponses[responseIdx % botResponses.length], false);
      responseIdx++;
    }, 1200 + Math.random() * 800);
  }

  send?.addEventListener('click', () => sendMessage(input?.value || ''));
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input.value);
    }
  });
}

// ── AI Orb ──
function initOrb() {
  const orb = document.querySelector('.ai-orb');
  const panel = document.querySelector('.orb-panel');
  if (!orb || !panel) return;

  orb.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('open');
    orb.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (!orb.contains(e.target) && !panel.contains(e.target)) {
      panel.classList.remove('open');
      orb.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      panel.classList.remove('open');
      orb.setAttribute('aria-expanded', 'false');
      orb.focus();
    }
  });
}

// ── Number Counter Animation ──
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const isFloat = target % 1 !== 0;
  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = target * ease;
    el.textContent = isFloat
      ? current.toFixed(1)
      : Math.floor(current).toLocaleString();
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString();
    }
  };
  requestAnimationFrame(update);
}

function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseFloat(e.target.dataset.count);
        if (!isNaN(target)) animateCounter(e.target, target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}

// ── Exit Intent ──
function initExitIntent() {
  const modal = document.getElementById('exit-modal');
  if (!modal) return;
  let shown = false;

  document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 10 && !shown) {
      shown = true;
      modal.style.display = 'flex';
      // Move focus to the close button for ADA
      setTimeout(() => {
        document.getElementById('exit-close')?.focus();
      }, 100);
    }
  });

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Close button
  document.getElementById('exit-close')?.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      modal.style.display = 'none';
    }
  });
}

// ── Init all ──
document.addEventListener('DOMContentLoaded', () => {
  initUTM();
  initIntegration();
  initNav();
  initNavScroll();
  initScrollAnimations();
  initFAQ();
  initChat();
  initOrb();
  initCounters();
  initExitIntent();
});
