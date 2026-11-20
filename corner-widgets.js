/* ============================================================
   NAV WIDGET — compact live clock + weather + ambient audio
   Weather: Open-Meteo (no key) · Sound: Web Audio (no file)
   ============================================================ */
(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  const old = $('cwRoot');
  if (old && old.parentNode) old.parentNode.removeChild(old);

  const holder = document.createElement('div');
  holder.innerHTML =
    '<div class="cw-chip" id="cwRoot" aria-label="Live clock and weather">' +
      '<span class="cw-chip-icon" id="cwIcon" aria-hidden="true"></span>' +
      '<span class="cw-chip-temp" id="cwTemp" title="Loading weather">--°</span>' +
      '<span class="cw-chip-time" id="cwTime" title="">--:--</span>' +
      '<button class="cw-chip-sound" id="cwSound" type="button" aria-pressed="false" aria-label="Play ambient music" title="Play ambient music">' +
        '<span class="cw-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' +
      '</button>' +
    '</div>';
  const root = holder.firstElementChild;
  const host = document.querySelector('.nav') || document.querySelector('.print-bar') || document.body;
  host.insertBefore(root, host.querySelector('.nav-cta, .btn-print') || null);
  if (!$('cwRoot')) return;

  const cwIcon = $('cwIcon'), cwTemp = $('cwTemp'), cwTime = $('cwTime'), sound = $('cwSound');

  /* ---------------------------------------------------------
     1. WEATHER + CLOCK
     --------------------------------------------------------- */
  const ICONS = {
    clear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.4v2.2M12 19.4v2.2M2.4 12h2.2M19.4 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6"/></svg>',
    partly: '<svg viewBox="0 0 24 24"><circle cx="8" cy="7.5" r="3.2"/><path d="M8 1.7v1.6M2.2 7.5h1.6M3.8 3.3l1.1 1.1M12.2 3.3l-1.1 1.1"/><path d="M7.2 20h10.3a3.4 3.4 0 0 0 .2-6.8 4.7 4.7 0 0 0-8.9-1.2 3.9 3.9 0 0 0-1.6 8z"/></svg>',
    cloud: '<svg viewBox="0 0 24 24"><path d="M6.4 18.6h11.1a3.6 3.6 0 0 0 .3-7.2 5 5 0 0 0-9.5-1.3 4.3 4.3 0 0 0-1.9 8.5z"/></svg>',
    rain: '<svg viewBox="0 0 24 24"><path d="M6.4 15.2h11.1a3.4 3.4 0 0 0 .2-6.8 4.8 4.8 0 0 0-9.1-1.2 4.1 4.1 0 0 0-2.2 8z"/><path d="M8 18.2l-1 2.4M12.4 18.2l-1 2.4M16.8 18.2l-1 2.4"/></svg>',
    snow: '<svg viewBox="0 0 24 24"><path d="M6.4 14.8h11.1a3.4 3.4 0 0 0 .2-6.8 4.8 4.8 0 0 0-9.1-1.2 4.1 4.1 0 0 0-2.2 8z"/><path d="M8.2 18.4v3M6.7 19.9h3M15 18.4v3M13.5 19.9h3"/></svg>',
    storm: '<svg viewBox="0 0 24 24"><path d="M6.4 14.8h11.1a3.4 3.4 0 0 0 .2-6.8 4.8 4.8 0 0 0-9.1-1.2 4.1 4.1 0 0 0-2.2 8z"/><path d="M13 16.4l-2.8 3.2h2.6l-1 2.6 3.4-3.7h-2.6z"/></svg>',
    fog: '<svg viewBox="0 0 24 24"><path d="M7.2 13.6h9.6a3.2 3.2 0 0 0 .2-6.4 4.6 4.6 0 0 0-8.7-1.1 3.8 3.8 0 0 0-1.1 7.5z"/><path d="M5.5 17h13M7.5 20h9"/></svg>'
  };
  const ICON_COLORS = { clear: '#ffd166', partly: '#ffd980', cloud: '#cfe4ec', rain: '#7fd8ff', snow: '#dff4ff', storm: '#c9b6ff', fog: '#cbd5df' };
  function setIcon(kind) {
    cwIcon.innerHTML = ICONS[kind] || ICONS.cloud;
    cwIcon.style.color = ICON_COLORS[kind] || ICON_COLORS.cloud;
  }
  setIcon('cloud');

  function condition(code) {
    if (code === 0) return 'Clear sky';
    if (code === 1) return 'Mostly clear';
    if (code === 2) return 'Partly cloudy';
    if (code === 3) return 'Overcast';
    if (code === 45 || code === 48) return 'Foggy';
    if (code >= 51 && code <= 57) return 'Light drizzle';
    if (code >= 61 && code <= 67) return 'Rain';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 80 && code <= 82) return 'Showers';
    if (code >= 85 && code <= 86) return 'Snow showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Weather update';
  }
  function iconKind(code) {
    if (code === 0 || code === 1) return 'clear';
    if (code === 2) return 'partly';
    if (code === 45 || code === 48) return 'fog';
    if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'snow';
    if (code >= 95) return 'storm';
    return 'cloud';
  }

  let tz = 'Asia/Kolkata';
  function fmt(opts) {
    const d = new Date();
    try { return new Intl.DateTimeFormat('en-GB', Object.assign({ timeZone: tz }, opts)).format(d); }
    catch (e) { return new Intl.DateTimeFormat('en-GB', opts).format(d); }
  }
  function tick() {
    cwTime.textContent = fmt({ hour: '2-digit', minute: '2-digit', hour12: true });
    cwTime.title = fmt({ weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  }
  tick();
  setInterval(tick, 1000);

  const GEO_KEY = 'cwGeoCache', WX_KEY = 'cwWxCache', TTL = 20 * 60 * 1000;
  function cacheGet(key) {
    try {
      const v = JSON.parse(localStorage.getItem(key) || 'null');
      if (v && Date.now() - v.t < TTL) return v.d;
    } catch (e) { /* private mode */ }
    return null;
  }
  function cacheSet(key, data) {
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), d: data })); } catch (e) { /* ignore */ }
  }
  async function getJSON(url) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 9000);
    try {
      const res = await fetch(url, { signal: ctrl.signal, cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } finally { clearTimeout(timer); }
  }

  async function load(force) {
    root.classList.add('is-loading');
    root.classList.remove('is-retry');
    cwTemp.textContent = '··°';
    root.title = 'Locating you…';
    try {
      let geo = force ? null : cacheGet(GEO_KEY);
      if (!geo) {
        const providers = [
          async () => {
            const ip = await getJSON('https://ipwho.is/');
            if (!ip.success || !ip.latitude) throw new Error('geo');
            return { lat: ip.latitude, lon: ip.longitude, city: ip.city || ip.region || 'Your area', region: ip.region || '', tz: (ip.timezone && ip.timezone.id) || '' };
          },
          async () => {
            const ip = await getJSON('https://ipapi.co/json/');
            if (!ip.latitude) throw new Error('geo');
            return { lat: ip.latitude, lon: ip.longitude, city: ip.city || ip.region || 'Your area', region: ip.region || '', tz: ip.timezone || '' };
          },
          async () => {
            const ip = await getJSON('https://ipinfo.io/json');
            const loc = (ip.loc || '').split(',');
            if (!loc[0] || !loc[1]) throw new Error('geo');
            return { lat: +loc[0], lon: +loc[1], city: ip.city || 'Your area', region: ip.region || '', tz: ip.timezone || '' };
          }
        ];
        for (const provider of providers) {
          try { geo = await provider(); break; } catch (e) { /* try next */ }
        }
        if (!geo) throw new Error('location');
        cacheSet(GEO_KEY, geo);
      }
      if (geo.tz) { tz = geo.tz; tick(); }

      const key = Math.round(geo.lat * 10) + '_' + Math.round(geo.lon * 10);
      let wx = force ? null : cacheGet(WX_KEY);
      if (!wx || wx.key !== key) {
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + encodeURIComponent(geo.lat) +
          '&longitude=' + encodeURIComponent(geo.lon) +
          '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto';
        const data = await getJSON(url);
        const c = data.current || {};
        wx = {
          key: key,
          temp: Math.round(c.temperature_2m),
          code: c.weather_code,
          hum: Math.round(c.relative_humidity_2m),
          wind: Math.round(c.wind_speed_10m),
          feels: Math.round(c.apparent_temperature),
          tz: data.timezone || geo.tz
        };
        cacheSet(WX_KEY, wx);
      }
      if (wx.tz) { tz = wx.tz; tick(); }

      const place = geo.city + (geo.region ? ', ' + geo.region : '');
      const full = condition(wx.code) + ' · ' + wx.temp + '°C · feels ' + wx.feels + '° · ' + place +
        ' · ' + wx.hum + '% humidity · ' + wx.wind + ' km/h wind';
      setIcon(iconKind(wx.code));
      cwTemp.textContent = wx.temp + '°';
      cwTemp.title = full;
      root.title = full;
    } catch (e) {
      setIcon('cloud');
      cwTemp.textContent = '—°';
      cwTemp.title = 'Weather offline — click to retry';
      root.title = 'Weather offline — click to retry';
      root.classList.add('is-retry');
    } finally {
      root.classList.remove('is-loading');
    }
  }
  root.addEventListener('click', e => {
    if (e.target && e.target.closest && e.target.closest('#cwSound')) return;
    if (!root.classList.contains('is-loading')) load(true);
  });

  /* ---------------------------------------------------------
     2. AMBIENT MUSIC — soft generative pad, play/mute toggle
     --------------------------------------------------------- */
  const WANT_KEY = 'cwAmbientOn';
  const CHORDS = [
    [174.61, 261.63, 329.63, 440.00], // Fmaj7
    [196.00, 246.94, 293.66, 392.00], // G
    [220.00, 261.63, 329.63, 392.00], // Am7
    [164.81, 261.63, 329.63, 392.00]  // Cmaj7
  ];

  let ctx = null, master = null, tone = null;
  let chordTimer = null, fadeTimer = null, voices = [], chordIndex = 0, playing = false;

  function setUI(on) {
    sound.classList.toggle('is-playing', on);
    sound.setAttribute('aria-pressed', on ? 'true' : 'false');
    sound.setAttribute('aria-label', on ? 'Mute ambient music' : 'Play ambient music');
    sound.title = on ? 'Mute ambient music' : 'Play ambient music';
  }
  setUI(false);

  function ensureAudio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18; comp.ratio.value = 4;
      comp.attack.value = .01; comp.release.value = .3;
      master.connect(comp); comp.connect(ctx.destination);

      tone = ctx.createBiquadFilter();
      tone.type = 'lowpass'; tone.frequency.value = 1050; tone.Q.value = .5;
      tone.connect(master);

      const delay = ctx.createDelay(1), wet = ctx.createGain(), fb = ctx.createGain();
      delay.delayTime.value = .42; wet.gain.value = .24; fb.gain.value = .27;
      tone.connect(delay); delay.connect(wet); wet.connect(master);
      delay.connect(fb); fb.connect(delay);

      const sweep = ctx.createOscillator(), sweepAmt = ctx.createGain();
      sweep.frequency.value = .05; sweepAmt.gain.value = 240;
      sweep.connect(sweepAmt); sweepAmt.connect(tone.frequency); sweep.start();

      /* soft pink-ish air texture */
      const noise = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < d.length; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + .02 * white) / 1.02;
        d[i] = last * 3.2;
      }
      noise.buffer = buf; noise.loop = true;
      const nf = ctx.createBiquadFilter(); nf.type = 'lowpass'; nf.frequency.value = 620;
      const ng = ctx.createGain(); ng.gain.value = .012;
      noise.connect(nf); nf.connect(ng); ng.connect(master);
      const nlfo = ctx.createOscillator(), namt = ctx.createGain();
      nlfo.frequency.value = .08; namt.gain.value = .005;
      nlfo.connect(namt); namt.connect(ng.gain); nlfo.start();
      noise.start();
    }
    return true;
  }

  function playChord() {
    if (!ctx || !playing) return;
    const now = ctx.currentTime, dur = 8.5;
    const chord = CHORDS[chordIndex++ % CHORDS.length];
    const nodes = [];
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      osc.detune.value = (Math.random() * 2 - 1) * 5;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(.085, now + 2.6);
      g.gain.setValueAtTime(.085, now + dur - 2.2);
      g.gain.linearRampToValueAtTime(0, now + dur);
      const lfo = ctx.createOscillator(), amt = ctx.createGain();
      lfo.frequency.value = .07 + i * .017; amt.gain.value = .028;
      lfo.connect(amt); amt.connect(g.gain);
      lfo.start(now); lfo.stop(now + dur + .1);
      osc.connect(g); g.connect(tone);
      osc.start(now); osc.stop(now + dur + .1);
      nodes.push(osc, lfo);
    });
    voices.push({ nodes: nodes, until: now + dur });
    voices = voices.filter(v => {
      if (v.until < now - .5) {
        v.nodes.forEach(n => { try { n.stop(); } catch (e) { /* already stopped */ } });
        return false;
      }
      return true;
    });
    chordTimer = setTimeout(playChord, (dur - 2) * 1000);
  }

  function start() {
    if (playing) return;
    if (!ensureAudio()) { sound.title = 'Audio unavailable'; return; }
    playing = true;
    ctx.resume().catch(() => {});
    clearTimeout(fadeTimer);
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(.55, ctx.currentTime + 1.8);
    playChord();
    setUI(true);
    try { localStorage.setItem(WANT_KEY, '1'); } catch (e) { /* ignore */ }
  }

  function stop() {
    if (!playing) return;
    playing = false;
    clearTimeout(chordTimer); chordTimer = null;
    try { localStorage.setItem(WANT_KEY, '0'); } catch (e) { /* ignore */ }
    if (ctx) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + .5);
      fadeTimer = setTimeout(() => {
        if (!playing && ctx && ctx.state === 'running') ctx.suspend().catch(() => {});
      }, 750);
    }
    setUI(false);
  }

  sound.addEventListener('click', () => { playing ? stop() : start(); });

  /* resume across pages on first gesture if the user left it on */
  try {
    if (localStorage.getItem(WANT_KEY) === '1') {
      const resume = e => {
        if (e.target && e.target.closest && e.target.closest('#cwSound')) {
          window.removeEventListener('pointerdown', resume);
          return;
        }
        window.removeEventListener('pointerdown', resume);
        start();
      };
      window.addEventListener('pointerdown', resume, { passive: true });
    }
  } catch (e) { /* ignore */ }

  load(false);
})();
