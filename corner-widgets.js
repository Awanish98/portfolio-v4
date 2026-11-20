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
      '<button class="cw-chip-sound cw-chip-muteall" id="cwMuteAll" type="button" aria-pressed="false" aria-label="Mute all sounds" title="Mute all sounds">🔊</button>' +
    '</div>';
  const root = holder.firstElementChild;
  const host = document.querySelector('.nav') || document.querySelector('.print-bar') || document.body;
  host.insertBefore(root, host.querySelector('.nav-cta, .btn-print') || null);
  if (!$('cwRoot')) return;

  const cwIcon = $('cwIcon'), cwTemp = $('cwTemp'), cwTime = $('cwTime'), sound = $('cwSound'), muteAllBtn = $('cwMuteAll');

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
  const SFX_KEY = 'bobSfxOn';
  const ALL_KEY = 'cwMuteAll';
  const CHORDS = [
    [174.61, 261.63, 329.63, 440.00, 523.25], // Fmaj9
    [196.00, 246.94, 293.66, 392.00, 493.88], // Gadd9
    [220.00, 261.63, 329.63, 392.00, 523.25], // Am9
    [164.81, 261.63, 329.63, 392.00, 493.88]  // Cmaj9
  ];

  let ctx = null, master = null, tone = null, delayNode = null, shakerBuf = null;
  let chordTimer = null, fadeTimer = null, voices = [], chordIndex = 0, playing = false;

  /* Bob's reaction blips share this AudioContext but have their own bus,
     so they stay crisp even when the ambient pad is muted. */
  let sfxOn = true, sfxGain = null, allMuted = false;
  const lastSfx = Object.create(null);
  try {
    sfxOn = localStorage.getItem(SFX_KEY) !== '0';
    allMuted = localStorage.getItem(ALL_KEY) === '1';
  } catch (e) { /* ignore */ }

  function setUI(on) {
    sound.classList.toggle('is-playing', on);
    sound.setAttribute('aria-pressed', on ? 'true' : 'false');
    sound.setAttribute('aria-label', on ? 'Mute ambient music' : 'Play ambient music');
    sound.title = on ? 'Mute ambient music' : 'Play ambient music';
  }
  setUI(false);

  function syncMuteUI() {
    root.classList.toggle('is-all-muted', allMuted);
    muteAllBtn.textContent = allMuted ? '🔇' : '🔊';
    muteAllBtn.setAttribute('aria-pressed', String(allMuted));
    const label = allMuted ? 'Unmute all sounds' : 'Mute all sounds';
    muteAllBtn.setAttribute('aria-label', label);
    muteAllBtn.title = label;
  }
  syncMuteUI();

  function ensureAudio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 3;
      comp.attack.value = .01; comp.release.value = .3;
      master.connect(comp); comp.connect(ctx.destination);

      tone = ctx.createBiquadFilter();
      tone.type = 'lowpass'; tone.frequency.value = 1500; tone.Q.value = .5;
      tone.connect(master);

      const delay = ctx.createDelay(1), wet = ctx.createGain(), fb = ctx.createGain();
      delayNode = delay;
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
      const ng = ctx.createGain(); ng.gain.value = .018;
      noise.connect(nf); nf.connect(ng); ng.connect(master);
      const nlfo = ctx.createOscillator(), namt = ctx.createGain();
      nlfo.frequency.value = .08; namt.gain.value = .005;
      nlfo.connect(namt); namt.connect(ng.gain); nlfo.start();
      noise.start();
    }
    return true;
  }

  function playChord() {
    if (!ctx || !playing || allMuted) return;
    const now = ctx.currentTime, dur = 9.2;
    const chord = CHORDS[chordIndex++ % CHORDS.length];
    const nodes = [];

    /* warm sustained pad */
    chord.forEach((freq, i) => {
      const upper = i === chord.length - 1;
      const osc = ctx.createOscillator();
      osc.type = upper || i % 2 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      osc.detune.value = (Math.random() * 2 - 1) * 5;
      const g = ctx.createGain();
      const peak = upper ? .055 : .10;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(peak, now + 2.4);
      g.gain.setValueAtTime(peak, now + dur - 2.4);
      g.gain.linearRampToValueAtTime(0, now + dur);
      const lfo = ctx.createOscillator(), amt = ctx.createGain();
      lfo.frequency.value = .06 + i * .013; amt.gain.value = upper ? .012 : .028;
      lfo.connect(amt); amt.connect(g.gain);
      lfo.start(now); lfo.stop(now + dur + .1);
      osc.connect(g); g.connect(tone);
      osc.start(now); osc.stop(now + dur + .1);
      nodes.push(osc, lfo);
    });

    /* soft sub bass gives the loop a heartbeat */
    const bass = ctx.createOscillator(), bassG = ctx.createGain();
    bass.type = 'triangle';
    bass.frequency.value = chord[0] / 2;
    bassG.gain.setValueAtTime(0, now);
    bassG.gain.linearRampToValueAtTime(.12, now + 1.1);
    bassG.gain.setValueAtTime(.12, now + dur - 2);
    bassG.gain.linearRampToValueAtTime(0, now + dur);
    bass.connect(bassG); bassG.connect(master);
    bass.start(now); bass.stop(now + dur + .1);
    nodes.push(bass);

    /* mallet melody — turns the pad into a real instrumental */
    const scale = [chord[2], chord[3], chord[4], chord[3] * 2, chord[4] * 2, chord[2] * 2];
    [0, .72, 1.44, 2.16, 2.88, 3.6, 4.32, 5.04, 5.76].forEach((offset, k) => {
      if (Math.random() < .18) return; /* leave a little air */
      const t = now + offset, f = scale[(k + chordIndex) % scale.length];
      const o = ctx.createOscillator(), h = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; h.type = 'triangle';
      o.frequency.value = f; h.frequency.value = f * 2;
      g.gain.setValueAtTime(.0001, t);
      g.gain.linearRampToValueAtTime(.075, t + .012);
      g.gain.exponentialRampToValueAtTime(.0001, t + .75);
      o.connect(g); h.connect(g); g.connect(master);
      if (delayNode) g.connect(delayNode);
      o.start(t); h.start(t); o.stop(t + .8); h.stop(t + .8);
      nodes.push(o, h);
    });

    /* airy high bells */
    [.9, 3.2, 5.5].forEach((offset, k) => {
      const t = now + offset;
      const bell = ctx.createOscillator(), bg = ctx.createGain();
      bell.type = 'sine';
      bell.frequency.value = chord[(k + 1) % chord.length] * 2;
      bg.gain.setValueAtTime(0, t);
      bg.gain.linearRampToValueAtTime(.045, t + .025);
      bg.gain.exponentialRampToValueAtTime(.0001, t + 2.2);
      bell.connect(bg); bg.connect(master);
      if (delayNode) bg.connect(delayNode);
      bell.start(t); bell.stop(t + 2.3);
      nodes.push(bell);
    });

    /* brushed shaker — very quiet pulse, no drums */
    if (!shakerBuf) {
      shakerBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * .12), ctx.sampleRate);
      const sd = shakerBuf.getChannelData(0);
      for (let i = 0; i < sd.length; i++) sd[i] = (Math.random() * 2 - 1) * (1 - i / sd.length);
    }
    for (let offset = .36; offset < dur - 1; offset += .72) {
      const t = now + offset;
      const src = ctx.createBufferSource(), hp = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = shakerBuf;
      hp.type = 'highpass'; hp.frequency.value = 5200;
      g.gain.setValueAtTime(.0001, t);
      g.gain.linearRampToValueAtTime(.018, t + .005);
      g.gain.exponentialRampToValueAtTime(.0001, t + .11);
      src.connect(hp); hp.connect(g); g.connect(master);
      src.start(t); src.stop(t + .12);
      nodes.push(src);
    }

    voices.push({ nodes: nodes, until: now + dur });
    voices = voices.filter(v => {
      if (v.until < now - .5) {
        v.nodes.forEach(n => { try { n.stop(); } catch (e) { /* already stopped */ } });
        return false;
      }
      return true;
    });
    chordTimer = setTimeout(playChord, (dur - 2.5) * 1000);
  }

  function start() {
    if (playing || allMuted) return;
    if (!ensureAudio()) { sound.title = 'Audio unavailable'; return; }
    playing = true;
    ctx.resume().catch(() => {});
    clearTimeout(fadeTimer);
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(.8, ctx.currentTime + 1.4);
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
        if (!playing && !sfxOn && !allMuted && ctx && ctx.state === 'running') ctx.suspend().catch(() => {});
      }, 750);
    }
    setUI(false);
  }

  sound.addEventListener('click', () => {
    if (allMuted) setMuteAll(false);
    playing ? stop() : start();
  });

  /* one kill switch for every sound on the site */
  function setMuteAll(on) {
    allMuted = !!on;
    try { localStorage.setItem(ALL_KEY, allMuted ? '1' : '0'); } catch (e) { /* ignore */ }
    syncMuteUI();
    if (ctx) {
      clearTimeout(fadeTimer);
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      if (allMuted) {
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + .25);
        fadeTimer = setTimeout(() => {
          if (allMuted && ctx && ctx.state === 'running') ctx.suspend().catch(() => {});
        }, 400);
      } else {
        ctx.resume().catch(() => {});
        master.gain.linearRampToValueAtTime(playing ? .8 : 0, ctx.currentTime + .8);
      }
    }
    if (!allMuted) {
      if (!playing && localStorage.getItem(WANT_KEY) === '1') start();
      else if (playing) { clearTimeout(chordTimer); playChord(); }
    }
    window.dispatchEvent(new CustomEvent('cwMuteAll', { detail: { muted: allMuted } }));
  }
  muteAllBtn.addEventListener('click', () => setMuteAll(!allMuted));

  /* ---------- BOB REACTION SOUNDS — tiny generated blips, no files ---------- */
  function sfxBus() {
    if (!ensureAudio()) return null;
    if (!sfxGain) {
      sfxGain = ctx.createGain();
      sfxGain.gain.value = .5; /* own volume, independent of the pad */
      sfxGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return sfxGain;
  }

  const SFX = {
    pop:   { f: 620, to: 940,  dur: .11, wave: 'sine',     vol: .15, gap: 180 },
    peep:  { f: 880, to: 1180, dur: .09, wave: 'triangle', vol: .09, gap: 850 },
    chime: { f: 700, to: 1050, dur: .32, wave: 'sine',     vol: .12, gap: 1200 },
    tap:   { f: 440, to: 300,  dur: .08, wave: 'triangle', vol: .10, gap: 140 },
    think: { f: 330, to: 520,  dur: .24, wave: 'sine',     vol: .10, gap: 900 },
    hello: { f: 520, to: 790,  dur: .26, wave: 'sine',     vol: .13, gap: 1200 }
  };

  function playSfx(name) {
    if (!sfxOn || allMuted) return;
    const now = Date.now(), p = SFX[name] || SFX.pop;
    if (now - (lastSfx[name] || 0) < p.gap) return; /* never spam */
    const bus = sfxBus(); if (!bus) return;
    lastSfx[name] = now;
    const t = ctx.currentTime + .005;
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = p.wave;
    osc.frequency.setValueAtTime(p.f, t);
    osc.frequency.exponentialRampToValueAtTime(p.to, t + p.dur);
    g.gain.setValueAtTime(.0001, t);
    g.gain.linearRampToValueAtTime(p.vol, t + .012);
    g.gain.exponentialRampToValueAtTime(.0001, t + p.dur);
    osc.connect(g); g.connect(bus);
    osc.start(t); osc.stop(t + p.dur + .03);
  }

  /* shared with bob.js — Bob's sounds stay mutable from his own panel */
  window.CW_AUDIO = {
    sfx: playSfx,
    sfxEnabled: () => sfxOn,
    ambientEnabled: () => playing,
    allMuted: () => allMuted,
    setMuteAll,
    setSfx(on) {
      sfxOn = !!on;
      try { localStorage.setItem(SFX_KEY, sfxOn ? '1' : '0'); } catch (e) { /* ignore */ }
      if (!sfxOn && !playing && ctx && ctx.state === 'running') ctx.suspend().catch(() => {});
    }
  };

  /* browsers block autoplay — begin on the first real gesture, unless opted out */
  try {
    const pref = localStorage.getItem(WANT_KEY);
    if (pref !== '0' && !allMuted) {
      const resume = e => {
        window.removeEventListener('pointerdown', resume);
        window.removeEventListener('keydown', resume);
        if (e.target && e.target.closest &&
            e.target.closest('#cwSound, #cwMuteAll')) return; /* let the button decide */
        if (!allMuted && !playing) start();
      };
      window.addEventListener('pointerdown', resume, { passive: true });
      window.addEventListener('keydown', resume);
    }
  } catch (e) { /* ignore */ }

  load(false);
})();
