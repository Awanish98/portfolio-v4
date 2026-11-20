/* ============================================================
   Awanish Kumar / Jordan - COMPLETE PROJECT SHOWCASE
   ============================================================ */

'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const BASE = 'https://awanish98.github.io/premium-web-demos/';
const LINKS = {
  hub: BASE,
  threeD: BASE + '51-developer-showcase/',
  repo: 'https://github.com/Awanish98',
  portfolio: 'index.html'
};

const groups = window.PROJECT_DATA.groups;
const allItems = window.PROJECT_DATA.allItems;
/* ---------------- HELPERS ---------------- */
const hue = str => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return h;
};
const initials = name => name.replace(/[^a-zA-Z ]/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const statusLabel = s => ({ live: 'Live', done: 'Complete', building: 'Building', planned: 'Planned' }[s] || s);
const statusClass = s => `status-${s === 'done' ? 'done' : s === 'live' ? 'live' : s === 'building' ? 'building' : 'planned'}`;
const statusPill = status => `<span class="status-pill ${statusClass(status)}"><i></i>${statusLabel(status)}</span>`;
const tagRow = tags => `<div class="pc-tags">${(tags || []).slice(0, 4).map(t => `<span class="tag">${t}</span>`).join('')}</div>`;

/* ---------------- RENDER ---------------- */
function injectStats() {
  const values = {
    total: allItems.length,
    live: allItems.filter(i => i.status === 'live').length,
    cats: groups.length,
    shipped: allItems.filter(i => i.status === 'live' || i.status === 'done').length
  };
  $$('[data-stat]').forEach(el => {
    const target = values[el.dataset.stat];
    if (target == null) return;
    if (reduceMotion) { el.textContent = target; return; }
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1100, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

function renderReel() {
  const track = $('#reelTrack');
  if (!track) return;
  const chips = allItems.map(p =>
    `<a class="reel-chip" href="${p.url || 'showcase.html'}" ${p.url ? 'target="_blank" rel="noopener"' : ''}><b>${p.groupIcon}</b>${p.name}</a>`
  ).join('');
  // duplicated once so the -50% marquee loops seamlessly
  track.innerHTML = chips + chips;
}

function renderTryWeb() {
  const host = $('#tryWebGrid');
  if (!host) return;
  // a hand-picked mix so different business types are visible at a glance
  const picks = [1, 3, 7, 25, 34, 41].map(n => window.PROJECT_DATA.demos.find(d => d.n === n)).filter(Boolean);
  host.innerHTML = `
    <div class="try-web-label"><span>✦</span> A FEW TO START WITH <b>↘</b></div>
    <div class="try-web-grid">
      ${picks.map((d, i) => `
        <a class="try-shot reveal" href="${d.url}" target="_blank" rel="noopener" data-d="${i % 3}" style="--h:${hue(d.name)}">
          <span class="try-shot-preview">
            <iframe src="${d.url}" loading="lazy" referrerpolicy="no-referrer" title="${d.name} preview" tabindex="-1"></iframe>
            <span class="try-shot-open">TRY THIS ↗</span>
          </span>
          <span class="try-shot-body">
            <b>${d.name}</b>
            <small>${d.sub} · ${d.cat}</small>
          </span>
        </a>`).join('')}
    </div>`;
}

function renderSpotlight() {
  $('#spotGrid').innerHTML = groups.map((g, i) => `
    <button type="button" class="cat-card reveal" data-goto="${g.key}" data-d="${i % 3}">
      <span class="cat-card-top"><span class="cat-icon">${g.icon}</span><span class="cat-n">${String(i + 1).padStart(2, '0')}</span></span>
      <strong class="cat-count">${g.items.length}</strong>
      <span class="cat-label">${g.label}</span>
      <span class="cat-note">${g.note}</span>
      <span class="cat-go">Explore ${g.label} <b>↗</b></span>
    </button>`).join('');
}

function renderFilters() {
  const cats = [{ key: 'all', label: 'All', count: allItems.length }, ...groups.map(g => ({ key: g.key, label: g.short || g.label, count: g.items.length }))];
  $('#projFilters').innerHTML = cats.map((c, i) =>
    `<button type="button" class="filter-btn ${i === 0 ? 'active' : ''}" data-cat="${c.key}">${c.label}<span>${c.count}</span></button>`
  ).join('');
}

function renderProjects() {
  $('#projGrid').innerHTML = allItems.map((p, i) => {
    const searchText = `${p.name} ${p.sub || ''} ${p.groupLabel} ${(p.tags || []).join(' ')}`.toLowerCase();
    const media = p.preview
      ? `<div class="pc-media has-preview" data-preview="${p.preview}" role="button" tabindex="0" aria-label="Preview ${p.name}">
           <iframe src="${p.preview}" loading="lazy" referrerpolicy="no-referrer" title="${p.name} preview" tabindex="-1"></iframe>
           <span class="pc-zoom">CLICK TO EXPAND ↗</span>
         </div>`
      : `<div class="pc-media is-glyph" style="--h:${hue(p.name)}" aria-hidden="true">
           <span class="pc-glyph-ring"></span>
           <span class="pc-initials">${p.groupIcon} ${initials(p.name)}</span>
         </div>`;
    return `
    <article class="proj-card reveal" data-cat="${p.group}" data-name="${searchText.replace(/"/g, '&quot;')}" data-d="${i % 3}">
      ${media}
      <span class="pc-group">${p.groupLabel}</span>
      <div class="pc-body">
        <div class="pc-top"><span class="pc-num">${String(i + 1).padStart(3, '0')}</span>${statusPill(p.status)}</div>
        <h3>${p.name}<small>${p.sub || ''}</small></h3>
        <p>${p.desc}</p>
        ${tagRow(p.tags)}
        <div class="pc-links">
          ${p.url ? `<a class="mini-link solid" href="${p.url}" target="_blank" rel="noopener">${p.url.includes('github') ? 'View on GitHub' : 'Visit project'} ↗</a>` : ''}
          ${p.preview ? `<button type="button" class="mini-link" data-preview="${p.preview}">Live preview</button>` : ''}
        </div>
      </div>
    </article>`;
  }).join('');
  scalePreviews();
}

/* ---------------- INTERACTIONS ---------------- */
function applyFilters() {
  const cat = ($('.filter-btn.active') || {}).dataset?.cat || 'all';
  const q = ($('#projSearch')?.value || '').trim().toLowerCase();
  let shown = 0;
  $$('.proj-card').forEach(card => {
    const match = (cat === 'all' || card.dataset.cat === cat) && (!q || card.dataset.name.includes(q));
    // BOTH properties: `hidden` for semantics, `style.display` because
    // styles.css gives .proj-card an author-level display:flex.
    card.hidden = !match;
    card.style.display = match ? '' : 'none';
    if (match) {
      shown++;
      card.classList.remove('in');
      void card.offsetWidth; // restart the pop-in animation
      card.classList.add('in');
    }
  });
  $('#projCount').textContent = shown;
  const empty = $('#projEmpty');
  if (empty) empty.hidden = shown !== 0;
}

function initFilters() {
  $('#projFilters').addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    $$('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
    applyFilters();
  });
  $('#projSearch').addEventListener('input', applyFilters);

  const gotoCategory = e => {
    const trigger = e.target.closest('[data-goto]');
    if (!trigger) return;
    const key = trigger.dataset.goto;
    $$('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === key));
    $('#projSearch').value = '';
    applyFilters();
    $('#all').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };
  document.addEventListener('click', gotoCategory);

  $('#shuffleBtn').addEventListener('click', () => {
    const grid = $('#projGrid');
    const cards = $$('.proj-card', grid);
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      grid.insertBefore(cards[j], cards[i]);
    }
    applyFilters();
  });

  applyFilters();
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
  $$('[data-preview][role="button"]').forEach(p => p.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(p.dataset.preview); }
  }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
}

function scalePreviews() {
  $$('.pc-media.has-preview, .try-shot-preview').forEach(p => {
    const frame = $('iframe', p);
    if (frame) p.style.setProperty('--scale', (p.clientWidth / 1200).toFixed(4));
  });
  const stage = $('.sh-window-stage');
  if (stage) {
    const frame = $('iframe', stage);
    if (frame) stage.style.setProperty('--wscale', (stage.clientWidth / 1400).toFixed(4));
  }
}
window.addEventListener('resize', () => { clearTimeout(window.__scaleT); window.__scaleT = setTimeout(scalePreviews, 120); });

function initCommon() {
  const loader = $('#loader');
  const hide = () => setTimeout(() => loader.classList.add('done'), reduceMotion ? 0 : 350);
  if (document.readyState === 'complete') hide();
  else window.addEventListener('load', hide, { once: true });
  setTimeout(hide, 1400);

  const items = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) items.forEach(el => el.classList.add('in'));
  else {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .06, rootMargin: '0px 0px -30px 0px' });
    items.forEach(el => io.observe(el));
  }

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
    const navIo = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      $$('.nav-link').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
    }), { rootMargin: '-45% 0px -50% 0px' });
    ['spotlight', 'all'].forEach(id => { const el = document.getElementById(id); if (el) navIo.observe(el); });
  }

  const bar = $('#progressBar'), btn = $('#toTop'), fill = $('#toTopFill');
  const C = 2 * Math.PI * 20;
  fill.style.strokeDasharray = String(C);
  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? window.scrollY / h : 0;
    bar.style.width = `${p * 100}%`;
    btn.classList.toggle('show', window.scrollY > 500);
    fill.style.strokeDashoffset = String(C * (1 - p));
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  if (!reduceMotion && !window.matchMedia('(pointer: coarse)').matches) {
    const dot = $('.cursor-dot'), ring = $('.cursor-ring');
    let mx = -100, my = -100, rx = -100, ry = -100, active = false;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      if (!active) { active = true; document.body.classList.add('cursor-active'); }
    });
    document.addEventListener('mouseover', e => {
      document.body.classList.toggle('cursor-hover', !!e.target.closest('a, button, [role="button"], .proj-card, .cat-card'));
    });
    document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
    const loop = () => {
      rx += (mx - rx) * .16; ry += (my - ry) * .16;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  if (!reduceMotion && !window.matchMedia('(pointer: coarse)').matches) {
    $$('.proj-card, .cat-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.setProperty('--rx', `${(-y * 5).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${(x * 5).toFixed(2)}deg`);
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  $('#year').textContent = new Date().getFullYear();
  window.addEventListener('load', scalePreviews);
}

/* ---------------- BOOT ---------------- */
injectStats();
renderReel();
renderTryWeb();
renderSpotlight();
renderFilters();
renderProjects();
initFilters();
initModal();
initCommon();

