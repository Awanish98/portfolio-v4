/* ============================================================
   Awanish Kumar / Jordan — Portfolio interactions & data
   ============================================================ */

'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ---------------- DATA ---------------- */

const featured = [
  {
    num: '01',
    name: 'Aura Music',
    status: 'LIVE + APK',
    desc: 'AI-powered YouTube music player & web radio with 40+ mood stations, synced lyrics, Full HD video theater, WebRTC listening rooms and a shipped Android app.',
    tags: ['React', 'WebRTC', 'AI', 'Android'],
    url: 'https://aura-music-1no9.onrender.com',
    preview: 'https://awanish98.github.io/Aura-Music/',
    extra: [
      { label: 'GitHub', url: 'https://github.com/Awanish98/Aura-Music' }
    ]
  },
  {
    num: '02',
    name: 'LDM Paramedical College',
    status: 'LIVE',
    desc: 'A modern, responsive website built for LDM Paramedical College with structured navigation for courses, admissions, faculty information and college updates.',
    tags: ['React', 'Responsive', 'UI / UX'],
    url: 'https://ldmcollege.com',
    extra: []
  },
  {
    num: '03',
    name: 'Jordan Personal Portfolio',
    status: 'LIVE',
    desc: 'The original personal portfolio — a clean, responsive home for projects, experience and everything in between, live on Netlify.',
    tags: ['Portfolio', 'Netlify', 'Web'],
    url: 'https://jordan005.netlify.app',
    extra: []
  }
];

const business = [
  { num: '01', name: 'Hotel Resort',        cat: 'Hospitality',  desc: 'Booking-first hotel & resort experience.', url: 'https://awanish98.github.io/01-hotel-resort/' },
  { num: '02', name: 'Wedding Banquet',     cat: 'Events',      desc: 'Elegant banquet & celebration showcase.', url: 'https://awanish98.github.io/02-wedding-banquet/' },
  { num: '03', name: 'Restaurant',          cat: 'Food & Drink',desc: 'Modern restaurant menu & dining site.',  url: 'https://awanish98.github.io/03-restaurant/' },
  { num: '04', name: 'Cafe Fast Food',      cat: 'Food & Drink',desc: 'Bold, energetic fast-food landing page.', url: 'https://awanish98.github.io/04-cafe-fast-food/' },
  { num: '05', name: 'Gym',                 cat: 'Fitness',     desc: 'High-energy gym & membership website.',   url: 'https://awanish98.github.io/05-gym/' },
  { num: '06', name: 'Salon Beauty',        cat: 'Beauty',      desc: 'Refined salon & beauty showcase.',       url: 'https://awanish98.github.io/06-salon-beauty/' },
  { num: '07', name: 'Hospital Clinic',     cat: 'Healthcare',  desc: 'Clear, calm clinic information site.',   url: 'https://awanish98.github.io/07-hospital-clinic/' },
  { num: '08', name: 'Wedding Lawn Events', cat: 'Events',      desc: 'Lawn and venue event showcase.',         url: 'https://awanish98.github.io/08-wedding-lawn-events/' },
  { num: '09', name: 'Boutique Hotel',      cat: 'Hospitality', desc: 'Boutique stay & rooms experience.',      url: 'https://awanish98.github.io/09-boutique-hotel/' },
  { num: '10', name: 'Fitness Club',        cat: 'Fitness',     desc: 'Premium fitness club landing page.',     url: 'https://awanish98.github.io/10-fitness-club/' }
];

// Every URL below is taken directly from the supplied project list — no guessed links.
const liveSites = [
  { n: 1,  name: 'Aura Music',              desc: 'Music streaming & player application — web, source and Android release.', tags: ['Web', 'AI', 'APK'], link: 'https://aura-music-1no9.onrender.com' },
  { n: 2,  name: 'LDM Paramedical College', desc: 'Responsive college site with courses, admissions and faculty info.',   tags: ['React', 'Website'], link: 'https://ldmcollege.com' },
  { n: 3,  name: 'Jordan Personal Portfolio', desc: 'Personal developer portfolio hosted on Netlify.',                   tags: ['Portfolio'], link: 'https://jordan005.netlify.app' },
  { n: 4,  name: 'Hotel Resort',            desc: 'Hotel & resort booking website design.',                              tags: ['Business'], link: 'https://awanish98.github.io/01-hotel-resort/' },
  { n: 5,  name: 'Wedding Banquet',         desc: 'Wedding banquet and event website.',                                  tags: ['Business'], link: 'https://awanish98.github.io/02-wedding-banquet/' },
  { n: 6,  name: 'Restaurant',              desc: 'Restaurant website with menu and dining details.',                    tags: ['Business'], link: 'https://awanish98.github.io/03-restaurant/' },
  { n: 7,  name: 'Cafe Fast Food',          desc: 'Fast-food cafe landing experience.',                                  tags: ['Business'], link: 'https://awanish98.github.io/04-cafe-fast-food/' },
  { n: 8,  name: 'Gym',                     desc: 'Fitness and membership website.',                                     tags: ['Business'], link: 'https://awanish98.github.io/05-gym/' },
  { n: 9,  name: 'Salon Beauty',            desc: 'Beauty salon showcase website.',                                     tags: ['Business'], link: 'https://awanish98.github.io/06-salon-beauty/' },
  { n: 10, name: 'Hospital Clinic',         desc: 'Healthcare and clinic information site.',                             tags: ['Business'], link: 'https://awanish98.github.io/07-hospital-clinic/' },
  { n: 11, name: 'Wedding Lawn Events',     desc: 'Wedding lawn and events venue website.',                              tags: ['Business'], link: 'https://awanish98.github.io/08-wedding-lawn-events/' },
  { n: 12, name: 'Boutique Hotel',          desc: 'Boutique hotel rooms and stays website.',                             tags: ['Business'], link: 'https://awanish98.github.io/09-boutique-hotel/' },
  { n: 13, name: 'Fitness Club',            desc: 'Fitness club landing website.',                                       tags: ['Business'], link: 'https://awanish98.github.io/10-fitness-club/' }
];

const githubProjects = [
  { n: 14, name: 'Living Universe',        desc: 'Interactive generative art experiment — a living, breathing cosmos rendered in the browser with canvas animations and particle physics.', tags: ['Canvas', 'JavaScript', 'Creative'], link: 'https://github.com/Awanish98/Living-Universe' },
  { n: 15, name: 'PREMIER',                desc: 'A premium front-end build showcasing advanced layout techniques, smooth scroll interactions, and high-fidelity UI components.', tags: ['HTML', 'CSS', 'JavaScript'], link: 'https://github.com/Awanish98/Premier' },
  { n: 16, name: 'Birth of a Black Hole',  desc: 'Cinematic WebGL-inspired simulation of a black hole forming — dark, dramatic, and physics-inspired visual storytelling.', tags: ['WebGL', 'Canvas', 'Simulation'], link: 'https://github.com/Awanish98/birth-of-a-black-hole' },
  { n: 17, name: 'Ishq Radio',             desc: 'A live Bollywood and Hindi radio streaming app with curated stations, smooth player controls, and a sleek dark interface.', tags: ['Streaming', 'Radio', 'JavaScript'], link: 'https://github.com/Awanish98/Ishq-Radio' },
  { n: 18, name: 'Web Scraping Suite',     desc: 'Modular Python scrapers built with BeautifulSoup, Scrapy, and Pyppeteer — covering e-commerce, news, and catalogue data extraction.', tags: ['Python', 'Scrapy', 'BeautifulSoup'], link: 'https://github.com/Awanish98/Web_Scraping' },
  { n: 19, name: 'Spotify Tooling',        desc: 'Automation scripts for Spotify — playlist exports, track metadata extraction, and playback control experiments using the Spotify API.', tags: ['Python', 'Spotify API', 'Automation'], link: 'https://github.com/Awanish98/Spotify' },
  { n: 20, name: 'Python Projects',        desc: 'A curated collection of Python utilities — web scrapers, data reporters, automation bots, and AI tool experiments.', tags: ['Python', 'Automation', 'Scripts'], link: 'https://github.com/Awanish98/Python_projects' },
  { n: 21, name: 'Portfolio v1',           desc: 'First iteration of the personal portfolio — clean layout, project showcase, and responsive design built with HTML, CSS and JS.', tags: ['Portfolio', 'HTML', 'CSS'], link: 'https://github.com/Awanish98/Portfolio' },
  { n: 22, name: 'Portfolio Spline React', desc: 'Experimental React portfolio with immersive 3D Spline scenes as hero backgrounds — merging WebGL visuals with a developer portfolio.', tags: ['React', 'Spline', '3D'], link: 'https://github.com/Awanish98/Portfolio-spline-React' },
  { n: 23, name: 'College Projects',       desc: 'Academic projects from B.Tech at Rajkiya Engineering College — covering data structures, databases, and software engineering assignments.', tags: ['Academic', 'Python', 'SQL'], link: 'https://github.com/Awanish98/college_test' },
  { n: 24, name: 'Vision — AI Knowledge Platform', desc: 'An AI-powered learning and knowledge management platform with structured content, smart search, and LLM-assisted study flows.', tags: ['AI', 'LLM', 'Python'] }
];

const pythonProjects = [
  { n: 25, name: 'E-Commerce Data Collection Suite', desc: 'Python, Pyppeteer, XPath and asyncio scraping across e-commerce sites.', tags: ['Python', 'Pyppeteer', 'asyncio'] },
  { n: 26, name: 'Fortune 1000+ Product Data Scraper', desc: 'Scraped 1,000+ products (Men, Women, Kids) using XPath and asyncio.', tags: ['XPath', 'asyncio'] },
  { n: 27, name: 'Le Chocolat Product Scraper', desc: 'Extracted 500+ chocolate products with automated pricing calculations.', tags: ['Scraping', 'Pricing'] },
  { n: 28, name: "Trader Joe's Product Scraper", desc: 'Collected 700+ products (Flowers, Beverages) with pagination handling.', tags: ['Scraping', 'Pagination'] },
  { n: 29, name: 'Audible Data Scraping', desc: 'Automated audiobook catalogue data collection.', tags: ['Python'] },
  { n: 30, name: 'Hacker News Data Scraping', desc: 'Story and metadata collection from Hacker News.', tags: ['Python'] },
  { n: 31, name: 'Bollywood / Movie Data Scraping', desc: 'Movie metadata collection pipeline.', tags: ['Python'] },
  { n: 32, name: 'Spotify Playlist Automation', desc: 'Automated playlist handling and exports.', tags: ['Automation'] },
  { n: 33, name: 'YouTube Playlist Processing Automation', desc: 'Bulk playlist processing workflow.', tags: ['Automation'] },
  { n: 34, name: 'Hotel Booking Automation Bot', desc: 'Automated hotel search and booking workflow.', tags: ['Bot'] },
  { n: 35, name: 'PyAutoGUI Desktop Automation', desc: 'Desktop UI automation with PyAutoGUI.', tags: ['PyAutoGUI'] },
  { n: 36, name: 'Python Code Reviewer', desc: 'Automated review helpers for Python code.', tags: ['Python'] },
  { n: 37, name: 'News Reporting Automation', desc: 'Automated news collection and reporting.', tags: ['Automation'] },
  { n: 38, name: 'Weather Reporting Automation', desc: 'Automated weather data reporting.', tags: ['Automation'] }
];

const aiProjects = [
  { n: 39, name: 'AI Lead Agent — Business Lead Generation System', desc: 'FastAPI, SQLite, Chrome Extension and Groq-powered lead generation.', tags: ['FastAPI', 'SQLite', 'Groq'] },
  { n: 40, name: 'AI Web Research & Business Discovery', desc: 'Automated research and business discovery flow.', tags: ['AI', 'Research'] },
  { n: 41, name: 'Google Maps Business Data Collection', desc: 'Business listings collection from Google Maps.', tags: ['Maps', 'Data'] },
  { n: 42, name: 'DuckDuckGo Search Automation', desc: 'Automated search-result collection.', tags: ['Automation'] },
  { n: 43, name: 'Browser-Based Web Scraping Automation', desc: 'Browser-driven scraping pipeline.', tags: ['Browser', 'Scraping'] },
  { n: 44, name: 'Local AI Coding Assistant — Ollama / Llama', desc: 'Local LLM coding experiments and helpers.', tags: ['Ollama', 'Llama'] }
];

const mediaProjects = [
  { n: 45, name: 'ISHQ Radio — Live Radio Streaming', desc: 'Live radio streaming experience.', tags: ['Radio', 'Streaming'] },
  { n: 46, name: 'Aura Music Backend', desc: 'Backend and API behind the Aura Music platform.', tags: ['Backend', 'API'] },
  { n: 47, name: 'Aura Music Android Application', desc: 'Android build of the Aura Music player.', tags: ['Android'] },
  { n: 48, name: 'Aura Music Web Player', desc: 'Browser music player with queue and playback controls.', tags: ['Web', 'Player'] },
  { n: 49, name: 'Aura Lyrics Visualizer', desc: 'Synced, animated lyric experience.', tags: ['Lyrics', 'Animation'] },
  { n: 50, name: 'Insta LRC Player', desc: 'LRC-format lyrics player experiment.', tags: ['LRC', 'Audio'] },
  { n: 51, name: 'Cinematic Word-by-Word Lyrics Animation', desc: 'Word-level animated lyrics rendering.', tags: ['Animation'] },
  { n: 52, name: 'Jordy — YouTube Playlist to Google Drive Music Automation', desc: 'Automated playlist-to-Drive music workflow.', tags: ['Automation', 'YouTube'] }
];

const archiveGroups = [
  { letter: 'A', title: 'Live websites & applications', note: 'Products and client websites that are live right now.', items: liveSites.map(i => ({ ...i, status: 'live' })) },
  { letter: 'B', title: 'GitHub projects', note: 'A mix of experiments, builds and earlier iterations.', items: githubProjects.map(i => ({ ...i, status: 'done', tags: i.tags || ['GitHub'] })) },
  { letter: 'C', title: 'Python, automation & data collection', note: 'Scrapers, collectors and workflow automation.', items: pythonProjects.map(i => ({ ...i, status: 'done' })) },
  { letter: 'D', title: 'AI & browser automation', note: 'AI-assisted research, lead generation and local experiments.', items: aiProjects.map(i => ({ ...i, status: 'done' })) },
  { letter: 'E', title: 'Music & media development', note: 'Streaming, players, lyrics and the builds behind Aura Music.', items: mediaProjects.map(i => ({ ...i, status: 'done' })) }
];

const labProjects = [
  { name: 'Jarvis Personal AI Assistant', status: 'building', desc: 'Central assistant core for memory, tasks, tool execution and model routing.' },
  { name: 'Deadpool Context Bridge', status: 'planned', desc: 'Context hand-off layer between agents and tools.' },
  { name: 'Oracle Memory Agent', status: 'planned', desc: 'Long-term memory and retrieval agent.' },
  { name: 'Raptor Job Hunter', status: 'building', desc: 'Job search and recruitment workflow agent.' },
  { name: 'Friday Job Assistant', status: 'planned', desc: 'Assistant for applications, follow-ups and tracking.' },
  { name: 'Watcher Business Agent', status: 'planned', desc: 'Business monitoring and signal collection agent.' },
  { name: 'Adam Meta-Agent', status: 'planned', desc: 'Orchestration layer for specialized agents.' },
  { name: 'Ultron Security Agent', status: 'planned', desc: 'Security-focused monitoring and response agent.' },
  { name: 'Genesis Agent', status: 'planned', desc: 'General-purpose agent foundation.' },
  { name: 'Memory Core', status: 'building', desc: 'Shared memory layer for the agent ecosystem.' },
  { name: 'AI Reel Creator', status: 'planned', desc: 'Automated short-form video generation workflow.' },
  { name: 'Twilio Voice AI Agent', status: 'planned', desc: 'Voice-based AI calling agent experiment.' },
  { name: 'Exam Form Application Tracker', status: 'planned', desc: 'Tracker for exam forms and application deadlines.' },
  { name: 'Freelancing Automation System', status: 'planned', desc: 'Client, proposal and delivery automation system.' }
];

const skills = [
  { title: 'Languages', items: ['Python', 'SQL', 'HTML', 'CSS', 'JavaScript', 'React.js'] },
  { title: 'Scraping & automation', items: ['Selenium', 'BeautifulSoup', 'Scrapy', 'Pyppeteer', 'PyAutoGUI'] },
  { title: 'Data & visualization', items: ['Pandas', 'Excel', 'Power BI', 'Tableau', 'Matplotlib'] },
  { title: 'AI & productivity', items: ['ChatGPT', 'Gemini', 'Claude', 'Prompt Engineering', 'Ollama / Llama', 'Groq'] },
  { title: 'Backend & platforms', items: ['FastAPI', 'SQLite', 'Google Cloud Databases', 'Render', 'Netlify', 'GitHub Pages'] },
  { title: 'Tools & workflow', items: ['Git', 'GitHub', 'VS Code', 'Linux', 'Google Workspace', 'Documentation'] }
];

/* ---------------- HELPERS ---------------- */

const hue = str => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return h;
};
const initials = name => name.replace(/[^a-zA-Z ]/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const statusLabel = s => ({ live: 'Live', done: 'Completed', building: 'Building', planned: 'Planned' }[s] || s);
const statusClass = s => `status-${s === 'done' ? 'done' : s === 'live' ? 'live' : s === 'building' ? 'building' : 'planned'}`;

const statusPill = status => `<span class="status-pill ${statusClass(status)}"><i></i>${statusLabel(status)}</span>`;
const tagRow = tags => `<div class="tag-row">${(tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>`;

/* ---------------- RENDER ---------------- */

function renderFeatured() {
  $('#featuredGrid').innerHTML = featured.map((p, i) => `
    <article class="fcard reveal" data-d="${i % 3}" data-url="${p.preview || p.url}">
      <div class="fcard-preview" data-preview="${p.preview || p.url}">
        <iframe data-src="${p.preview || p.url}" loading="lazy" referrerpolicy="no-referrer" title="${p.name} live preview" tabindex="-1"></iframe>
        <span class="preview-tag"><i></i> LIVE PREVIEW</span>
        <span class="expand-hint">Click to expand ↗</span>
      </div>
      <div class="fcard-body">
        <div class="fcard-top"><span class="fcard-num">${p.num} / FEATURED</span>${statusPill('live')}</div>
        <h3><a href="${p.url}" target="_blank" rel="noopener">${p.name}</a></h3>
        <p>${p.desc}</p>
        ${tagRow(p.tags)}
        <div class="fcard-links">
          <a class="mini-link solid" href="${p.url}" target="_blank" rel="noopener">Live site ↗</a>
          ${p.extra.map(e => `<a class="mini-link" href="${e.url}" target="_blank" rel="noopener">${e.label}</a>`).join('')}
        </div>
      </div>
    </article>`).join('');

  $$('.fcard[data-url]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

function renderBusiness() {
  if (!$('#businessGrid')) return; // section lives on the showcase page now
  const cats = ['All', ...new Set(business.map(b => b.cat))];
  $('#businessFilters').innerHTML = cats.map((c, i) =>
    `<button class="filter-btn ${i === 0 ? 'active' : ''}" data-cat="${c}">${c}<span>${c === 'All' ? business.length : business.filter(b => b.cat === c).length}</span></button>`
  ).join('');

  $('#businessGrid').innerHTML = business.map((b, i) => `
    <article class="bcard reveal" data-d="${i % 3}" data-cat="${b.cat}" data-url="${b.url}">
      <div class="bcard-preview" data-preview="${b.url}" role="button" tabindex="0" aria-label="Preview ${b.name}">
        <iframe data-src="${b.url}" loading="lazy" referrerpolicy="no-referrer" title="${b.name} live preview" tabindex="-1"></iframe>
        <span class="bcard-cat">${b.cat}</span>
        <span class="bcard-zoom">CLICK TO EXPAND ↗</span>
      </div>
      <div class="bcard-body">
        <div><h3><span>${b.num}</span>${b.name}</h3><p>${b.desc}</p></div>
        <a class="visit-link" href="${b.url}" target="_blank" rel="noopener">Visit ↗</a>
      </div>
    </article>`).join('');

  $$('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;
    $$('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
    let shown = 0;
    $$('.bcard').forEach(card => {
      const match = cat === 'All' || card.dataset.cat === cat;
      card.hidden = !match;
      if (match) { shown++; card.classList.add('in'); }
    });
    $('#businessCount').textContent = shown;
  }));

  scalePreviews();
}

function renderArchive() {
  if (!$('#archiveTimeline')) return; // section lives on the showcase page now
  $('#archiveJump').innerHTML = archiveGroups.map(g =>
    `<a href="#group-${g.letter}"><b>${g.letter}</b>${g.title.split(' & ')[0]}</a>`
  ).join('');

  $('#archiveTimeline').innerHTML = archiveGroups.map(g => `
    <div class="tl-group" id="group-${g.letter}">
      <div class="tl-group-head">
        <span class="tl-letter">${g.letter}</span>
        <h3>${g.title}</h3>
        <span class="tl-count">${g.items.length} projects</span>
      </div>
      <p class="tl-note">${g.note}</p>
      <div class="proj-grid">
        ${g.items.map((p, i) => `
          <article class="proj-card reveal" data-d="${i % 3}">
            <div class="proj-top">
              <span class="proj-num">${String(p.n).padStart(2, '0')}</span>
              <span class="proj-icon" style="--h:${hue(p.name)}">${initials(p.name)}</span>
            </div>
            <h4>${p.name}</h4>
            <p>${p.desc}</p>
            ${tagRow((p.tags || ['Project']).slice(0, 3))}
            ${p.link ? `<a class="proj-link" href="${p.link}" target="_blank" rel="noopener">${p.link.includes('github') ? 'View on GitHub' : 'Visit project'} ↗</a>` : ''}
          </article>`).join('')}
      </div>
    </div>`).join('');
}

function renderLab() {
  if (!$('#labGrid')) return; // section lives on the showcase page now
  $('#labGrid').innerHTML = labProjects.map((p, i) => `
    <article class="lab-card ${p.status === 'building' ? 'building' : ''} reveal" data-d="${i % 3}">
      <div class="lab-top"><span class="proj-num">${String(i + 1).padStart(2, '0')}</span>${statusPill(p.status)}</div>
      <h3>${p.name}</h3><p>${p.desc}</p><span class="lab-scan"></span>
    </article>`).join('');
}

function renderSkills() {
  $('#skillGroups').innerHTML = skills.map(s => `
    <div class="skill-group"><h4>${s.title}</h4><div class="skill-tags">${s.items.map(i => `<span>${i}</span>`).join('')}</div></div>
  `).join('');
}

function renderCarousel() {
  const track = $('#carouselTrack');
  const data = window.PROJECT_DATA;
  if (!track || !data) return;
  const items = data.allItems.map((p, i) => {
    const text = `${p.name} ${p.sub || ''} ${p.groupLabel} ${(p.tags || []).join(' ')}`.toLowerCase();
    return `
      <a class="car-card" href="${p.url || 'showcase.html'}" ${p.url ? 'target="_blank" rel="noopener"' : ''}
         data-name="${text.replace(/"/g, '&quot;')}" style="--h:${hue(p.name)}" aria-label="${p.name}">
        <span class="car-card-top">
          <span class="car-card-icon">${p.groupIcon}</span>
          <span class="car-card-num">${String(i + 1).padStart(3, '0')} / ${data.allItems.length}</span>
        </span>
        <span class="car-card-glyph">${p.name}<small>${p.sub || ''}</small></span>
        <span class="car-card-foot">
          <span class="car-card-cat">${p.groupLabel}</span>
          <span class="car-card-arrow">↗</span>
        </span>
      </a>`;
  }).join('');
  // duplicate once so the -50% CSS marquee loops without a visible jump
  track.innerHTML = items + items;

  $$('.car-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`);
      card.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

/* ---------------- INTERACTIONS ---------------- */

function initLoader() {
  const loader = $('#loader');
  const hide = () => setTimeout(() => loader.classList.add('done'), reduceMotion ? 0 : 450);
  if (document.readyState === 'complete') hide();
  else window.addEventListener('load', hide, { once: true });
  setTimeout(hide, 1800); // safety fallback
}

function initReveal() {
  const items = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => io.observe(el));
}

function initCounters() {
  const els = $$('[data-count]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    els.forEach(el => el.textContent = el.dataset.count);
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count;
      let start = null;
      const step = ts => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1200, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: .6 });
  els.forEach(el => io.observe(el));
}

function initNav() {
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = $('#navToggle'), links = $('#navLinks');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  $$('.nav-link', links).forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open'); toggle.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
  }));

  if ('IntersectionObserver' in window) {
    const navIo = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        $$('.nav-link').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['featured', 'carousel', 'showcase-cta', 'about'].forEach(id => {
      const el = document.getElementById(id); if (el) navIo.observe(el);
    });
  }

  document.addEventListener('click', e => {
    if (links.classList.contains('open') && !nav.contains(e.target)) {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function initProgress() {
  const bar = $('#progressBar');
  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${h > 0 ? (window.scrollY / h) * 100 : 0}%`;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initCursor() {
  if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) return;
  const dot = $('.cursor-dot'), ring = $('.cursor-ring');
  if (!dot || !ring) return;
  let mx = -100, my = -100, rx = -100, ry = -100, raf = null, active = false;

  /* The loop stops itself once the ring has caught up — no permanent rAF. */
  const loop = () => {
    raf = null;
    rx += (mx - rx) * .16; ry += (my - ry) * .16;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
    if (Math.abs(mx - rx) > .15 || Math.abs(my - ry) > .15) raf = requestAnimationFrame(loop);
  };
  const kick = () => { if (raf === null) raf = requestAnimationFrame(loop); };

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (!active) { active = true; document.body.classList.add('cursor-active'); }
    kick();
  }, { passive: true });
  document.addEventListener('mouseover', e => {
    const hit = e.target.closest('a, button, [role="button"], .fcard, .bcard');
    document.body.classList.toggle('cursor-hover', !!hit);
  }, { passive: true });
  document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
}

function initStars() {
  const canvas = $('#starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, stars = [], raf = null, last = 0, onScreen = true;

  const resize = () => {
    w = canvas.width = Math.min(window.innerWidth, 1920);
    h = canvas.height = Math.max(window.innerHeight, 700);
    /* fewer particles + 30fps cap = same look, a fraction of the CPU */
    const count = Math.min(90, Math.floor(w / 14));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.4 + .25,
      vy: Math.random() * .22 + .04,
      a: Math.random() * .6 + .15,
      tw: Math.random() * .02 + .006,
      red: Math.random() > .82
    }));
  };

  const render = () => {
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => {
      s.y += s.vy; if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
      s.a += s.tw; if (s.a > .85 || s.a < .1) s.tw *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.red ? `rgba(67,59,255,${s.a})` : `rgba(251,251,254,${s.a * .7})`;
      ctx.fill();
    });
  };

  const tick = ts => {
    raf = requestAnimationFrame(tick);
    if (ts - last < 22) return;          // ~45fps: smooth drift, still cheap
    last = ts;
    render();
  };
  const play = () => {
    if (raf === null && !reduceMotion && onScreen && !document.hidden) raf = requestAnimationFrame(tick);
  };
  const stop = () => { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  if (reduceMotion) { render(); return; }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; onScreen ? play() : stop(); },
      { threshold: 0 }).observe(canvas);
  } else play();
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : play());
}

function scalePreviews() {  $$('.bcard-preview').forEach(p => {
    const frame = $('iframe', p);
    if (frame) p.style.setProperty('--scale', (p.clientWidth / 1200).toFixed(4));
  });
  const stage = $('.promo-stage');
  if (stage) {
    const frame = $('iframe', stage);
    if (frame) stage.style.setProperty('--pscale', (stage.clientWidth / 1400).toFixed(4));
  }
}
window.addEventListener('resize', () => { clearTimeout(window.__scaleT); window.__scaleT = setTimeout(scalePreviews, 120); });

function initLazyIframes() {
  if (!('IntersectionObserver' in window)) {
    $$('iframe[data-src]').forEach(f => { f.src = f.dataset.src; });
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const f = e.target;
        if (f.dataset.src) { f.src = f.dataset.src; delete f.dataset.src; }
        io.unobserve(f);
      }
    });
  }, { rootMargin: '300px' });
  $$('iframe[data-src]').forEach(f => io.observe(f));
}

function initModal() {
  const modal = $('#previewModal'), frame = $('#modalFrame'), urlEl = $('#modalUrl'), openEl = $('#modalOpen');
  const open = url => {
    urlEl.textContent = url.replace(/^https?:\/\//, '');
    openEl.href = url;
    frame.src = url;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => modal.classList.add('show'));
  };
  const close = () => {
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    setTimeout(() => { modal.hidden = true; frame.src = 'about:blank'; }, 320);
  };
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-preview]');
    if (trigger) { e.preventDefault(); open(trigger.dataset.preview); return; }
    if (e.target.closest('[data-close]')) close();
  });
  $$('.bcard-preview').forEach(p => p.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(p.dataset.preview); }
  }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
}

function initContact() {
  const form = $('#contactForm');
  const btn = form ? form.querySelector('button[type="submit"]') : null;
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = $('#cfName').value.trim();
    const email = $('#cfEmail').value.trim();
    const subject = $('#cfSubject').value.trim() || `Portfolio enquiry from ${name}`;
    const message = $('#cfMessage').value.trim();
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    try {
      const res = await fetch('https://formspree.io/f/xdkozaqv', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, _subject: subject, message })
      });
      if (res.ok) {
        form.innerHTML = '<p style="text-align:center;color:#4ade80;font-family:var(--mono);font-size:.88rem;padding:24px 0;letter-spacing:.05em;">✓ MESSAGE SENT — I\'ll get back to you soon.</p>';
      } else {
        throw new Error('Form error');
      }
    } catch {
      if (btn) { btn.disabled = false; btn.textContent = 'Send message ↗'; }
      const mailto = `mailto:awanishkumarrocky552@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message + '\n\n— ' + name + '\n' + email)}`;
      window.location.href = mailto;
    }
  });
}

/* ---------------- BOOT ---------------- */

renderFeatured();
renderCarousel();
renderBusiness();
renderArchive();
renderLab();
renderSkills();

initLoader();
initReveal();
initCounters();
initNav();
initProgress();
initCursor();
initStars();
initModal();
initLazyIframes();
initContact();

$('#year').textContent = new Date().getFullYear();
window.addEventListener('load', scalePreviews);


/* ============================================================
   PREMIUM MOTION — portrait parallax, magnetic UI, 3D tilt,
   scroll-linked timeline fill and floating progress button
   ============================================================ */

function initPortrait() {
  const hero = $('.hero'), frame = $('.portrait-frame');
  if (!hero || !frame || reduceMotion) return;
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width - .5) * 2;
    const py = ((e.clientY - r.top) / r.height - .5) * 2;
    frame.style.setProperty('--px', (px * 12).toFixed(2));
    frame.style.setProperty('--py', (py * 9).toFixed(2));
  });
  hero.addEventListener('mouseleave', () => {
    frame.style.setProperty('--px', 0);
    frame.style.setProperty('--py', 0);
  });
  const onScroll = () => {
    const y = Math.min(window.scrollY, window.innerHeight);
    frame.style.setProperty('--sy', (y * .07).toFixed(2));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initMagnetic() {
  if (reduceMotion) return;
  $$('.magnetic').forEach(el => {
    let rect = null, measured = 0;
    el.addEventListener('mousemove', e => {
      const now = performance.now();
      if (!rect || now - measured > 120) { rect = el.getBoundingClientRect(); measured = now; }
      const x = (e.clientX - rect.left - rect.width / 2) * .18;
      const y = (e.clientY - rect.top - rect.height / 2) * .26;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }, { passive: true });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

function initTilt() {
  if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) return;
  $$('.fcard, .bcard, .proj-card').forEach(card => {
    let rect = null, measured = 0;
    card.addEventListener('mousemove', e => {
      const now = performance.now();
      if (!rect || now - measured > 120) { rect = card.getBoundingClientRect(); measured = now; }
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      card.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`);
      card.style.setProperty('--ry', `${(x * 7).toFixed(2)}deg`);
    }, { passive: true });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

function initTimelineFill() {
  const tl = $('#archiveTimeline');
  if (!tl) return;
  const fill = document.createElement('span');
  fill.className = 'timeline-fill';
  tl.prepend(fill);
  const update = () => {
    const r = tl.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (window.innerHeight * .5 - r.top) / Math.max(r.height, 1)));
    fill.style.height = `${(p * 100).toFixed(2)}%`;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function initToTop() {
  const btn = $('#toTop'), fill = $('#toTopFill');
  if (!btn || !fill) return;
  const C = 2 * Math.PI * 20;
  fill.style.strokeDasharray = String(C);
  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? window.scrollY / h : 0;
    btn.classList.toggle('show', window.scrollY > 500);
    fill.style.strokeDashoffset = String(C * (1 - p));
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
}

window.filterArchive = function(query) {
  const q = query.toLowerCase().trim();
  $$('.proj-card').forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = q && !text.includes(q) ? 'none' : '';
  });
  $$('.tl-group').forEach(group => {
    const visible = $$('.proj-card', group).some(c => c.style.display !== 'none');
    group.style.display = visible || !q ? '' : 'none';
  });
};

initPortrait();
initMagnetic();
initTilt();
initTimelineFill();
initToTop();

