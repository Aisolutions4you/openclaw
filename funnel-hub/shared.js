/* Global UIM — Shared JavaScript */

// ── Mobile Nav ──
function initNav() {
  const btn = document.querySelector('.nav-menu-btn');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => links.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !links.contains(e.target)) links.classList.remove('open');
  });
}

// ── Scroll Animations ──
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ── FAQ ──
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
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
    "We're currently serving home service businesses across Hillsborough, Pinellas, Pasco, Polk, and Manatee counties. Are you in the Tampa Bay area?",
    "Our most popular bundle for home service companies includes Voice AI + Conversational AI + Reputation Management. Would you like to see a live demo?",
    "I'd love to get you booked with Luis or one of our team members. Can I get your business name and the best time to reach you?",
  ];
  let responseIdx = 0;
  let typing = false;

  btn.addEventListener('click', () => {
    win.classList.toggle('open');
    document.querySelector('.chat-badge')?.remove();
  });

  function addMessage(text, isUser) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${isUser ? 'user' : 'agent'}`;
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    typing = true;
    const dot = document.createElement('div');
    dot.className = 'chat-msg agent typing-indicator';
    dot.id = 'typing';
    dot.innerHTML = '<span>●</span><span>●</span><span>●</span>';
    dot.style.cssText = 'display:flex;gap:4px;align-items:center;padding:10px 14px;';
    dot.querySelectorAll('span').forEach((s, i) => {
      s.style.cssText = `animation:typingDot 1.2s ${i*0.2}s ease-in-out infinite;font-size:0.6rem;color:var(--accent-cyan);`;
    });
    const style = document.createElement('style');
    style.textContent = '@keyframes typingDot{0%,80%,100%{opacity:0.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-4px)}}';
    document.head.appendChild(style);
    messages.appendChild(dot);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    document.getElementById('typing')?.remove();
    typing = false;
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
  input?.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(input.value); });
}

// ── AI Orb ──
function initOrb() {
  const orb = document.querySelector('.ai-orb');
  const panel = document.querySelector('.orb-panel');
  if (!orb || !panel) return;
  orb.addEventListener('click', () => panel.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!orb.contains(e.target) && !panel.contains(e.target)) panel.classList.remove('open');
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
    el.textContent = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString();
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
    }
  });
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
  document.getElementById('exit-close')?.addEventListener('click', () => modal.style.display = 'none');
}

// ── Sticky Nav Shadow ──
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 20 ? '0 4px 30px rgba(0,0,0,0.5)' : 'none';
  });
}

// ── Init all ──
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollAnimations();
  initFAQ();
  initChat();
  initOrb();
  initCounters();
  initExitIntent();
  initNavScroll();
});
