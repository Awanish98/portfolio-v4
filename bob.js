/* ============================================================
   BOB — floating portfolio assistant (chat + voice)
   Uses /api/bob when deployed on Netlify; falls back to a
   built-in local brain for file:// and GitHub Pages previews.
   ============================================================ */
(function () {
  'use strict';

  if (window.__bobReady) return;
  window.__bobReady = true;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const synth = window.speechSynthesis;

  const root = document.createElement('div');
  root.className = 'bob-root';
  root.id = 'bobRoot';
  root.innerHTML = `
    <div class="bob-bench" aria-hidden="true">
      <span class="bob-bench-plank"></span>
      <span class="bob-bench-leg bob-bench-leg--l"></span>
      <span class="bob-bench-leg bob-bench-leg--r"></span>
    </div>
    <div class="bob-tooltip" id="bobTip">Hello!</div>
    <button class="bob-fab" id="bobFab" type="button" aria-label="Open Bob, the portfolio assistant" aria-expanded="false">
      <span class="bob-fab-ring" aria-hidden="true"></span>
      <span class="bob-bot" aria-hidden="true">
        <span class="bob-antenna"><i></i></span>
        <span class="bob-rhead">
          <span class="bob-visor">
            <span class="bob-eye bob-eye--l"><i></i></span>
            <span class="bob-eye bob-eye--r"><i></i></span>
          </span>
          <span class="bob-smile"></span>
        </span>
        <span class="bob-body">
          <span class="bob-arm bob-arm--l"></span>
          <span class="bob-arm bob-arm--r"></span>
          <span class="bob-side"></span>
        </span>
        <span class="bob-legs">
          <span class="bob-leg bob-leg--l"><i></i></span>
          <span class="bob-leg bob-leg--r"><i></i></span>
        </span>
        <span class="bob-shadow"></span>
        <span class="bob-zzz" aria-hidden="true">z z z</span>
      </span>
    </button>
    <section class="bob-panel" id="bobPanel" role="dialog" aria-label="Bob, portfolio assistant" aria-hidden="true">
      <header class="bob-head">
        <div class="bob-head-id">
          <span class="bob-avatar" aria-hidden="true">B<i></i></span>
          <span class="bob-head-text">
            <strong>Bob</strong>
            <small><i class="bob-status-dot"></i> Portfolio assistant · online</small>
          </span>
        </div>
        <div class="bob-head-actions">
          <button class="bob-icon-btn" id="bobVoiceToggle" type="button" title="Mute voice replies" aria-label="Mute voice replies">🔊</button>
          <button class="bob-icon-btn" id="bobClose" type="button" title="Close chat" aria-label="Close chat">✕</button>
        </div>
      </header>

      <div class="bob-messages" id="bobMessages" aria-live="polite"></div>

      <div class="bob-chips" id="bobChips" aria-label="Suggested questions">
        <button type="button" class="bob-chip" data-q="Show me a restaurant website">Restaurant website?</button>
        <button type="button" class="bob-chip" data-q="Show all 106 projects">All projects</button>
        <button type="button" class="bob-chip" data-q="Send me your resume">Resume</button>
        <button type="button" class="bob-chip" data-q="How can I contact you?">Contact</button>
      </div>

      <form class="bob-compose" id="bobForm">
        <button class="bob-mic" id="bobMic" type="button" title="Speak your message" aria-label="Speak your message">🎤</button>
        <input id="bobInput" type="text" maxlength="600" placeholder="Ask about projects, demos, resume…" autocomplete="off" aria-label="Message Bob">
        <button class="bob-send" type="submit" title="Send" aria-label="Send message">↗</button>
      </form>
      <p class="bob-disclaimer">Bob is AI-assisted and may make mistakes. For anything important, email Awanish directly.</p>
    </section>`;
  document.body.appendChild(root);

  const $ = id => document.getElementById(id);
  const fab = $('bobFab'), panel = $('bobPanel'), tip = $('bobTip');
  const messages = $('bobMessages'), form = $('bobForm'), input = $('bobInput');
  const mic = $('bobMic'), voiceToggle = $('bobVoiceToggle'), closeBtn = $('bobClose');

  let open = false;
  let greeted = false;
  let busy = false;
  let voiceOn = true;
  let listening = false;
  let recognition = null;
  const history = [];

  /* ---------- robot state + micro-animations ---------- */
  root.dataset.state = 'idle';
  const IDLE_ANTICS = ['is-yawning', 'is-tapping', 'is-peeking', 'is-hop'];
  const clearAntics = () => fab.classList.remove(...IDLE_ANTICS);
  const setState = state => {
    root.dataset.state = state;
    if (state !== 'idle') fab.classList.remove('is-bored', 'is-excited', 'is-curious', 'is-pop', ...IDLE_ANTICS);
  };
  let speechToken = 0;

  function wave() {
    fab.classList.add('is-waving');
    setTimeout(() => fab.classList.remove('is-waving'), 1100);
  }

  function scheduleBlink() {
    setTimeout(() => {
      if (root.dataset.state !== 'speaking') {
        fab.classList.add('is-blinking');
        setTimeout(() => fab.classList.remove('is-blinking'), 150);
      }
      scheduleBlink();
    }, 2600 + Math.random() * 3400);
  }
  scheduleBlink();

  /* Bob is comfy on his bench — every so often he pulls a silly idle stunt. */
  function scheduleAntics() {
    setTimeout(() => {
      const calm = !open && !busy && !document.hidden &&
        root.dataset.state === 'idle' &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (calm) {
        const stunt = IDLE_ANTICS[Math.floor(Math.random() * IDLE_ANTICS.length)];
        clearAntics();
        void fab.offsetWidth; /* restart the CSS animation */
        fab.classList.add(stunt);
        const hold = stunt === 'is-yawning' ? 2600 : stunt === 'is-tapping' ? 1900 : 1400;
        setTimeout(() => fab.classList.remove(stunt), hold);
      }
      scheduleAntics();
    }, 6500 + Math.random() * 7000);
  }
  scheduleAntics();

  /* eyes follow the cursor while Bob is idle */
  document.addEventListener('mousemove', e => {
    if (open || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = fab.getBoundingClientRect();
    const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 260));
    const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / 260));
    fab.style.setProperty('--eye-x', (dx * 3.2).toFixed(1) + 'px');
    fab.style.setProperty('--eye-y', (dy * 3.2).toFixed(1) + 'px');
    fab.style.setProperty('--tilt', (dx * 5).toFixed(1) + 'deg');
  }, { passive: true });

  /* ==========================================================
     REACTIVE ENGINE — Bob reads the page and reacts to the user
     ========================================================== */

  /* crawl the current page so Bob knows what's around him */
  function crawlSite() {
    const clean = s => (s || '').replace(/\s+/g, ' ').trim();
    const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
      .map(h => clean(h.textContent)).filter(Boolean).slice(0, 12);
    const sections = Array.from(document.querySelectorAll('[id]'))
      .map(el => ({
        id: el.id,
        label: clean(el.getAttribute('aria-label') || (el.querySelector('h2, h3') && el.querySelector('h2, h3').textContent) || el.id)
      }))
      .filter(s => s.label && s.label.length < 60).slice(0, 18);
    const buttons = Array.from(document.querySelectorAll('button'))
      .map(b => clean(b.textContent)).filter(Boolean).slice(0, 20);
    const cards = document.querySelectorAll('.proj-card, .project-card, .demo-card, .card').length;
    return {
      page: location.pathname.split('/').pop() || 'index.html',
      title: document.title,
      heading: headings[0] || '',
      headings, sections, buttons, cards
    };
  }
  const site = crawlSite();

  const reactTimers = {};
  let nudgeTimer = null;

  /* short-lived expression on the mascot */
  function react(mood, ms = 1000) {
    fab.classList.remove('is-bored', 'is-excited', 'is-curious', 'is-pop', ...IDLE_ANTICS);
    void fab.offsetWidth; /* restart CSS animation */
    fab.classList.add('is-' + mood);
    clearTimeout(reactTimers[mood]);
    reactTimers[mood] = setTimeout(() => fab.classList.remove('is-' + mood), ms);
  }

  /* temporary speech bubble message */
  function nudge(text, mood, ms = 4000) {
    if (open) return;
    tip.textContent = text;
    tip.classList.add('is-nudge');
    if (mood) react(mood, ms);
    clearTimeout(nudgeTimer);
    nudgeTimer = setTimeout(() => {
      tip.textContent = 'Hello!';
      tip.classList.remove('is-nudge');
      nudgeTimer = null;
    }, ms);
  }

  function contextHint() {
    const p = site.page;
    if (p.indexOf('showcase') > -1) return 'Psst… try Search or Shuffle 🔍';
    if (p.indexOf('resume') > -1) return 'The CV is right here 📄';
    if (site.buttons.some(b => /shuffle/i.test(b))) return 'Bored? Hit Shuffle 🎲';
    if (site.headings.some(h => /project/i.test(h))) return '106 projects up there 👆';
    return 'Bored? Ask me something 👀';
  }

  /* activity / boredom tracking */
  let lastActive = Date.now();
  let boredStage = 0;
  function markActive() {
    lastActive = Date.now();
    if (boredStage) {
      boredStage = 0;
      fab.classList.remove('is-bored');
      clearTimeout(nudgeTimer);
      tip.textContent = 'Hello!';
      tip.classList.remove('is-nudge');
      nudgeTimer = null;
    }
  }
  ['pointermove', 'pointerdown', 'scroll', 'keydown', 'touchstart'].forEach(ev =>
    window.addEventListener(ev, markActive, { passive: true }));

  setInterval(() => {
    if (open) return;
    const secs = (Date.now() - lastActive) / 1000;
    if (secs > 15 && boredStage === 0) {
      boredStage = 1;
      fab.classList.add('is-bored');
      nudge('👀', null, 3000);
    } else if (secs > 32 && boredStage === 1) {
      boredStage = 2;
      nudge(contextHint(), null, 6500);
    } else if (secs > 55 && boredStage === 2) {
      boredStage = 3;
      nudge('Tap me — I’m lonely! 🥺', 'excited', 5000);
      lastActive = Date.now() - 30000; /* cooldown before next cycle */
    }
  }, 3000);

  /* scrolling — one contextual nudge per page */
  let scrollHintDone = false;
  window.addEventListener('scroll', () => {
    if (!scrollHintDone && !open && (window.scrollY || 0) > 420) {
      scrollHintDone = true;
      react('curious', 900);
      nudge('Scrolling? Try Shuffle 🎲', null, 3500);
    }
  }, { passive: true });

  /* click — eyes dart to the click, tiny pop */
  window.addEventListener('pointerdown', e => {
    if (e.target instanceof Node && root.contains(e.target)) return;
    const r = fab.getBoundingClientRect();
    const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 260));
    const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / 260));
    fab.style.setProperty('--eye-x', (dx * 3.2).toFixed(1) + 'px');
    fab.style.setProperty('--eye-y', (dy * 3.2).toFixed(1) + 'px');
    react('pop', 450);
  }, { passive: true });

  /* hovering a project card — Bob peeks at it */
  let lastCardHint = 0;
  document.addEventListener('pointerover', e => {
    if (open || !e.target.closest) return;
    const card = e.target.closest('.proj-card, .project-card, .demo-card');
    if (!card || (e.target instanceof Node && root.contains(e.target))) return;
    const now = Date.now();
    if (now - lastCardHint < 10000) return;
    lastCardHint = now;
    const label = (card.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 32);
    if (!label) return;
    react('curious', 900);
    nudge(label + ' ↗', null, 3200);
  }, { passive: true });

  /* typing — curious face */
  input.addEventListener('input', () => {
    if (input.value) react('curious', 800);
  });

  /* idle while chat is open — a gentle proactive prompt (once) */
  let idleChatDone = false;
  setInterval(() => {
    if (!open || busy || idleChatDone) return;
    if (Date.now() - lastActive > 28000 && messages.children.length <= 2) {
      idleChatDone = true;
      addMessage('bot', 'Still there? Try “Show me a restaurant website” or open the Showcase ↗');
    }
  }, 5000);

  /* ---------- safe text rendering (auto-linkify, no innerHTML from model) ---------- */
  function putText(el, text) {
    const re = /(https?:\/\/[^\s)]+|mailto:[^\s)]+|\/[A-Za-z0-9_./-]+\.(?:html|css|js))/g;
    let last = 0, m;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) el.appendChild(document.createTextNode(text.slice(last, m.index)));
      const a = document.createElement('a');
      a.href = m[0];
      a.textContent = m[0].replace(/^https?:\/\//, '').replace(/\/$/, '');
      if (/^https?:/.test(m[0])) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      el.appendChild(a);
      last = re.lastIndex;
    }
    if (last < text.length) el.appendChild(document.createTextNode(text.slice(last)));
  }

  function addMessage(role, text) {
    const wrap = document.createElement('div');
    wrap.className = 'bob-msg bob-msg--' + role;
    const bubble = document.createElement('div');
    bubble.className = 'bob-bubble';
    putText(bubble, text);
    wrap.appendChild(bubble);
    messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
    return wrap;
  }

  function showTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'bob-msg bob-msg--bot bob-typing';
    wrap.innerHTML = '<div class="bob-bubble"><i></i><i></i><i></i></div>';
    messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
    return wrap;
  }

  /* ---------- local fallback brain (no key / file:// / GitHub Pages) ---------- */
  function localBob(q) {
    const s = q.toLowerCase();
    const data = window.PROJECT_DATA;
    const demos = (data && data.demos) || [];

    if (/(bored|entertain|fun|joke|surprise me|something else)/.test(s))
      return 'Bored? Hit the Shuffle button on the Showcase 🎲 — it throws a random project at you. Or ask me for a restaurant website demo!';
    if (/(this page|current page|what.s on|site map|what can i see|where am i|what.s here)/.test(s)) {
      const secs = site.sections.slice(0, 4).map(x => x.label).join(', ');
      return `You're on ${site.title || site.page}.${secs ? ' On this page: ' + secs + '.' : ''} Ask me about projects, demos, the resume or contact.`;
    }
    if (/^(hi|hello|hey|namaste|yo|good (morning|evening))\b/.test(s))
      return 'Hey! I’m Bob 👋 Ask me about the 106 projects, the 50 business website demos, the resume, or how to reach Awanish.';
    if (/(resume|cv|biography|qualification)/.test(s))
      return 'Here’s the full CV: /resume.html — skills, experience, education and certifications, all in one page.';
    if (/(contact|email|phone|reach|hire|freelance|price|cost|budget)/.test(s))
      return 'Best way to reach Awanish: mailto:awanishkumarrocky552@gmail.com · Phone +91 94158 48436 · GitHub https://github.com/Awanish98';
    if (/(3d|developer showcase|virtual)/.test(s))
      return 'The interactive 3D showcase is here: https://awanish98.github.io/premium-web-demos/51-developer-showcase/';
    if (/(thank|thanks|great|awesome|nice)/.test(s))
      return 'Anytime! 😊 Want to see a specific kind of website, or should I open the full showcase?';

    const keys = ['restaurant','hotel','clinic','medical','cafe','coffee','salon','beauty','gym','fitness','wedding','banquet','portfolio','agency','studio','education','property','real estate','food'];
    const hit = keys.find(k => s.includes(k));
    if (hit || /(website|web demo|business site|demo|site)/.test(s)) {
      const picked = hit
        ? demos.filter(d => `${d.name} ${d.sub} ${d.cat}`.toLowerCase().includes(hit)).slice(0, 3)
        : demos.slice(0, 3);
      if (picked.length) {
        const lines = picked.map(d => `${d.name} (${d.sub}) — ${d.url}`);
        return `${hit ? 'For ' + hit + ', try these: ' : 'A few live demos to start with: '}\n${lines.join('\n')}\nAll 50 demos: /showcase.html`;
      }
      return 'There are 50 ready-to-try business website demos — hotel, restaurant, clinic, cafe, gym, salon, wedding and more. Open /showcase.html and filter “Websites”.';
    }

    if (/\b(projects?|everything|full archive|how many|all work)\b/.test(s))
      return '106 projects across 7 categories — websites, apps, open source, tools & scripts, AI, music & media and lab experiments. Explore & filter them all: /showcase.html';
    if (/(who are you|your name|about bob|what can you)/.test(s))
      return 'I’m Bob, the little assistant living on Awanish’s portfolio. I can point you to projects, business website demos, the CV and contact details.';
    return 'I can help with projects, website demos, the resume and contact details. Try “Show me a hotel website” or “Open all projects”. You can also email Awanish: awanishkumarrocky552@gmail.com';
  }

  /* ---------- voice ---------- */
  function speak(text) {
    const token = ++speechToken;
    if (!voiceOn || !synth) { setState('idle'); return; }
    synth.cancel();
    setState('speaking');
    const clean = String(text)
      .replace(/https?:\/\/\S+/g, 'link')
      .replace(/[↗✦●🙂👋😊]/g, '')
      .slice(0, 400);
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = 'en-IN';
    u.rate = 1.03;
    u.pitch = 1.04;
    const voice = (synth.getVoices() || []).find(v => /en-IN|en-US/i.test(v.lang) && /natural|google|chrome/i.test(v.name));
    if (voice) u.voice = voice;
    const done = () => { if (token === speechToken && root.dataset.state === 'speaking') setState('idle'); };
    u.onend = done;
    u.onerror = done;
    synth.speak(u);
  }

  function setListening(state) {
    listening = state;
    mic.classList.toggle('is-listening', state);
    mic.title = state ? 'Listening… click to stop' : 'Speak your message';
    mic.textContent = state ? '⏹' : '🎤';
    if (root.dataset.state !== 'thinking' && root.dataset.state !== 'speaking') {
      setState(state ? 'listening' : 'idle');
    }
  }

  function startListening() {
    if (!SpeechRecognition) {
      addMessage('bot', 'Voice input works best in Chrome or Edge. You can type here instead.');
      return;
    }
    if (listening) { recognition && recognition.stop(); setListening(false); return; }
    if (synth) synth.cancel();
    recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setListening(true);
    recognition.onresult = e => {
      const text = (e.results[0] && e.results[0][0] && e.results[0][0].transcript || '').trim();
      setListening(false);
      if (text) send(text);
    };
    recognition.onerror = () => {
      setListening(false);
      addMessage('bot', 'Mic didn’t catch that. Type your question instead — I’m here.');
    };
    recognition.onend = () => setListening(false);
    try { recognition.start(); }
    catch { setListening(false); }
  }

  /* ---------- chat plumbing ---------- */
  async function askServer(message) {
    const res = await fetch('/api/bob', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history: history.slice(-10) })
    });
    if (!res.ok) throw new Error('server unavailable');
    const data = await res.json();
    if (!data || !data.reply) throw new Error('empty reply');
    return data.reply;
  }

  async function send(text) {
    const message = String(text || '').trim();
    if (!message || busy) return;
    busy = true;
    setState('thinking');
    input.value = '';
    addMessage('user', message);
    history.push({ role: 'user', text: message });
    const typing = showTyping();

    let reply;
    try {
      reply = await askServer(message);
    } catch {
      reply = localBob(message);
    }

    typing.remove();
    addMessage('bot', reply);
    history.push({ role: 'bot', text: reply });
    if (history.length > 20) history.splice(0, history.length - 20);
    speak(reply);
    busy = false;
    input.focus();
  }

  function setOpen(state) {
    open = state;
    root.classList.toggle('bob-open', open);
    panel.setAttribute('aria-hidden', String(!open));
    fab.setAttribute('aria-expanded', String(open));
    tip.classList.toggle('is-hidden', open);
    if (open) {
      setState('idle');
      wave();
      if (!greeted) {
        greeted = true;
        addMessage('bot', 'Hey, I’m Bob! 👋 Ask me about projects, business website demos, the CV or how to get in touch.');
      }
      setTimeout(() => input.focus(), 260);
    } else {
      if (listening && recognition) recognition.stop();
      setListening(false);
      if (synth) synth.cancel();
      speechToken++;
      setState('idle');
    }
  }

  /* ---------- events ---------- */
  fab.addEventListener('click', () => setOpen(!open));
  closeBtn.addEventListener('click', () => setOpen(false));
  form.addEventListener('submit', e => { e.preventDefault(); send(input.value); });
  mic.addEventListener('click', startListening);
  voiceToggle.addEventListener('click', () => {
    voiceOn = !voiceOn;
    voiceToggle.textContent = voiceOn ? '🔊' : '🔇';
    voiceToggle.title = voiceOn ? 'Mute voice replies' : 'Unmute voice replies';
    voiceToggle.setAttribute('aria-label', voiceToggle.title);
    if (!voiceOn) {
      speechToken++;
      if (synth) synth.cancel();
      setState('idle');
    }
  });
  $('bobChips').addEventListener('click', e => {
    const chip = e.target.closest('.bob-chip');
    if (chip) send(chip.dataset.q);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) setOpen(false);
  });

  /* preload voices when the browser is ready */
  if (synth && synth.getVoices) {
    const load = () => synth.getVoices();
    if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = load;
    load();
  }
})();
