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
    <div class="bob-tooltip" id="bobTip">Ask Bob anything ↗</div>
    <button class="bob-fab" id="bobFab" type="button" aria-label="Open Bob, the portfolio assistant" aria-expanded="false">
      <span class="bob-fab-ring" aria-hidden="true"></span>
      <span class="bob-fab-face" aria-hidden="true">B</span>
      <span class="bob-fab-dot" aria-hidden="true"></span>
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
    if (!voiceOn || !synth) return;
    synth.cancel();
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
    synth.speak(u);
  }

  function setListening(state) {
    listening = state;
    mic.classList.toggle('is-listening', state);
    mic.title = state ? 'Listening… click to stop' : 'Speak your message';
    mic.textContent = state ? '⏹' : '🎤';
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
      if (!greeted) {
        greeted = true;
        addMessage('bot', 'Hey, I’m Bob! 👋 Ask me about projects, business website demos, the CV or how to get in touch.');
      }
      setTimeout(() => input.focus(), 260);
    } else {
      if (listening && recognition) recognition.stop();
      setListening(false);
      if (synth) synth.cancel();
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
    if (!voiceOn && synth) synth.cancel();
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
