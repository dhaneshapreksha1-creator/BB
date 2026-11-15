/* Billy Buddha UK: shared shell, commerce and motion. Needs data.js first. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
const ses = { get(k) { try { return sessionStorage.getItem(k); } catch { return '1'; } }, set(k) { try { sessionStorage.setItem(k, '1'); } catch {} } };
const page = document.body.dataset.page || '';
const SVG = {
  x: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  arrow: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  plus: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  truck: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
  search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
};
const NAV = [['work', 'work.html', 'Work'], ['billy', 'billy.html', 'About'], ['contact', 'contact.html', 'Contact']];
const QUICK = [['tees', 'T-shirts'], ['polos', 'Polos'], ['hoodies', 'Hoodies']];
const shopLink = set => `shop.html?set=${encodeURIComponent(set)}`;
const catLinks = Object.entries(CATS).map(([k, v]) => `<li><a href="${shopLink('cat:' + k)}" data-set="cat:${k}">${v} <small>(${P.filter(p => p.cat === k).length})</small></a></li>`).join('') + `<li><a href="shop.html" data-set="clear">Shop all styles</a></li>`;

/* ---------------- CHROME ---------------- */
const main = $('main');
document.body.insertAdjacentHTML('afterbegin', `
<div class="progress" id="progress" aria-hidden="true"></div>
<a class="skip" href="#main">Skip to main content</a>
<header class="hdr" id="top">
  <div class="wrap hdr-row">
    <button class="icon-btn burger" id="burger" aria-label="Open menu" aria-haspopup="dialog"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18"/></svg></button>
    <a class="logo has-img" href="index.html" id="logo" aria-label="Billy Buddha UK home"><img src="${LOGO(140)}" alt="" width="64" height="66"></a>
    <nav class="mainnav" aria-label="Main"><ul>
      <li><button class="navlink" aria-expanded="false" aria-controls="mega" id="megaBtn" ${page === 'shop' || page === 'product' ? 'aria-current="page"' : ''}>Shop <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button></li>
      ${NAV.map(([k, h, l]) => `<li><a class="navlink" href="${h}" ${page === k ? 'aria-current="page"' : ''}>${l}</a></li>`).join('')}
    </ul></nav>
    <div class="hdr-tools">
      <div class="search" data-search>${SVG.search}<label class="sr-only" for="q1">Search products</label><input id="q1" type="search" placeholder="Search T-shirts, polos, hoodies…" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="sg1" aria-autocomplete="list"><ul class="suggest" id="sg1" role="listbox" aria-label="Product suggestions"></ul></div>
      <a class="icon-btn" href="contact.html" aria-label="Contact us"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg></a>
      <button class="icon-btn" id="basketBtn" aria-label="Basket, 0 items" aria-haspopup="dialog"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg><span class="badge" id="badge" aria-hidden="true">0</span></button>
    </div>
  </div>
  <nav class="catbar" aria-label="Shop by garment"><div class="catbar-in">
    ${Object.entries(CATS).map(([k, v]) => `<a href="${shopLink('cat:' + k)}" data-set="cat:${k}" data-navcat="${k}">${v}</a>`).join('')}<a href="shop.html" data-set="clear">Shop all blanks</a><a class="cb-extra" href="billy.html#colours">Shop by colour</a><a class="cb-extra" href="index.html#resources">Resources</a>
  </div></nav>
  <div class="mega" id="mega"><div class="wrap mega-grid">
    <div><h4>Garments</h4><ul>${catLinks}</ul></div>
    <div><h4>By fabric</h4><ul>${FABRICS.map(f => `<li><a href="${shopLink('fab:' + f)}" data-set="fab:${f}">${f}</a></li>`).join('')}</ul></div>
    <div><h4>By weight</h4><ul>
      <li><a href="${shopLink('weight:light')}" data-set="weight:light">Lightweight <small>under 170 GSM</small></a></li>
      <li><a href="${shopLink('weight:mid')}" data-set="weight:mid">Midweight <small>170 to 220 GSM</small></a></li>
      <li><a href="${shopLink('weight:heavy')}" data-set="weight:heavy">Heavyweight <small>over 220 GSM</small></a></li>
      <li><a href="billy.html#colours">Full colour palette</a></li>
      <li><a href="contact.html">Bespoke projects</a></li>
    </ul></div>
    <a class="mega-promo" href="${shopLink('cat:hoodies')}" data-set="cat:hoodies"><img alt="" loading="lazy" src="${IMG('2ecf16_e3a03611ba7442c4a722e3aea235b3de~mv2.jpg', 700, 440)}"><span>New season fleece →</span></a>
  </div></div>
</header>
<div class="minibar" role="note" aria-label="Good to know"><span>Free UK delivery over £150</span><i aria-hidden="true"></i><span>No minimum on blanks</span><i aria-hidden="true"></i><span class="mb-3">Made in our own mills</span></div>
<div class="scrim" id="scrim"></div>`);
document.body.insertAdjacentHTML('beforeend', `
<footer class="foot"><div class="wrap">
  <div class="foot-top">
    <div>
      <a class="logo has-img" href="index.html" aria-label="Billy Buddha UK home"><img src="${LOGO(280)}" alt="" width="127" height="132" loading="lazy"><span class="tag">Since 1998</span></a>
      <p style="opacity:.75;margin-top:1.25rem;max-width:24em">Every thread, our own. Blank and branded merchandise.</p>
      <form class="news" id="newsForm" novalidate><label class="sr-only" for="nw">Email address</label><input class="input" id="nw" type="email" autocomplete="email" placeholder="Email address"><button class="btn btn-brick" type="submit">Sign up</button></form>
    </div>
    <div><h2>Merchandise</h2><ul>${Object.entries(CATS).map(([k, v]) => `<li><a href="${shopLink('cat:' + k)}" data-set="cat:${k}">${v}</a></li>`).join('')}</ul></div>
    <div><h2>Studio</h2><ul><li><a href="work.html">Work</a></li><li><a href="billy.html">About</a></li><li><a href="billy.html#mills">Our mills</a></li><li><a href="contact.html">Contact</a></li></ul></div>
    <div><h2>Follow</h2><ul><li><a href="https://www.facebook.com/billybuddha">Facebook</a></li><li><a href="#">Privacy</a></li><li><a href="#">Terms</a></li></ul></div>
  </div>
  <div class="big-word" aria-hidden="true">${[...'Billy Buddha'].map(c => c === ' ' ? '<span>&nbsp;</span>' : `<span>${c}</span>`).join('')}</div>
  <div class="foot-base"><span>© 2026 SummerBlue Clothing Pvt Ltd</span><span>Tiruppur · Ludhiana · London</span></div>
</div></footer>

<dialog class="mnav" id="mnav" aria-label="Menu">
  <div class="mnav-head"><a class="logo has-img" href="index.html" aria-label="Billy Buddha UK home"><img src="${LOGO(100)}" alt="" width="46" height="48"></a><button class="icon-btn" data-close aria-label="Close menu">${SVG.x}</button></div>
  <div class="mnav-body">
    <div class="search" data-search>${SVG.search}<label class="sr-only" for="q2">Search products</label><input id="q2" type="search" placeholder="Search style, fabric, GSM…" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="sg2" aria-autocomplete="list"><ul class="suggest" id="sg2" role="listbox" aria-label="Product suggestions"></ul></div>
    <details open><summary>Merchandise</summary><ul>${catLinks}</ul></details>
    <a class="mlink" href="index.html">Home</a>${NAV.map(([, h, l]) => `<a class="mlink" href="${h}">${l}</a>`).join('')}
  </div>
</dialog>

<dialog class="pdp" id="qv" aria-labelledby="qvTitle">
  <button class="icon-btn pdp-close" data-close aria-label="Close product">${SVG.x}</button>
  <div class="pdp-inner">
    <div class="gallery"><div class="gallery-main" data-b="gmain"><img data-b="gimg" alt=""></div><div class="thumbs" data-b="thumbs" role="group" aria-label="Product images"></div></div>
    ${formHTML('h2', 'qvTitle', true)}
  </div>
</dialog>

<dialog class="drawer" id="drawer" aria-labelledby="bH">
  <div class="drawer-head"><h2 id="bH">Basket</h2><button class="icon-btn" data-close aria-label="Close basket">${SVG.x}</button></div>
  <div class="meterbox" id="meter"></div>
  <ul class="lines" id="lines"></ul>
  <div class="drawer-foot" id="bFoot"></div>
</dialog>

<div class="toast" id="toast" role="status" aria-live="polite"><span id="toastMsg"></span><button type="button" id="toastBtn" hidden>View basket</button></div>
<button class="totop" id="totop" aria-label="Back to top"><svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true" style="position:absolute;inset:0"><circle cx="24" cy="24" r="22" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="2"/><circle id="totopRing" cx="24" cy="24" r="22" fill="none" stroke="#e7a8a6" stroke-width="2" stroke-dasharray="138.2" stroke-dashoffset="138.2" transform="rotate(-90 24 24)"/></svg><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true" style="position:relative"><path d="M12 19V5M6 11l6-6 6 6"/></svg></button>
<div class="cursor" id="cursor" aria-hidden="true"><div class="ring"><span></span></div><div class="dot"></div></div>`);
if (main && !main.id) main.id = 'main';

const gbp = v => '£' + v.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const tierFor = q => TIERS.find(t => q >= t.min && q <= t.max) || TIERS[0];
$$('img[data-src]').forEach(i => { i.src = IMG(i.dataset.src, +i.dataset.w || 900, +i.dataset.h || 1100); });

/* ---------------- INTRO (first visit per session) ---------------- */
if (false) { // intro screen retired for the clean look
  ses.set('bb-intro');
  document.body.insertAdjacentHTML('afterbegin', `<div class="intro" id="intro" aria-hidden="true"><div class="intro-in"><div class="intro-badge"><img src="${LOGO(260)}" alt=""></div><div class="intro-word"><span>Billy</span><span>Buddha</span><span>Since</span><span>1998</span></div></div></div>`);
  const intro = $('#intro');
  const endIntro = () => { if (!intro.isConnected || intro.classList.contains('out')) return; intro.classList.add('out'); setTimeout(() => intro.remove(), 900); };
  setTimeout(endIntro, 1100);
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(ev => addEventListener(ev, endIntro, { once: true, passive: true }));
}

/* ---------------- HEADER ---------------- */
const hdr = $('.hdr'), totop = $('#totop'), ring = $('#totopRing'), prog = $('#progress');
let lastY = scrollY, vel = 0;
function onScroll() {
  const y = scrollY, max = Math.max(1, document.documentElement.scrollHeight - innerHeight), k = Math.min(1, y / max);
  hdr.classList.toggle('scrolled', y > 8);
  totop.classList.toggle('on', y > 900);
  ring.setAttribute('stroke-dashoffset', 138.2 * (1 - k));
  prog.style.transform = `scaleX(${k})`;
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();
const setHdrH = () => document.documentElement.style.setProperty('--hdrH', hdr.offsetHeight + 'px');
setHdrH(); addEventListener('resize', setHdrH);
function markNav(cat) {
  $$('[data-navcat]').forEach(a => a.dataset.navcat === cat ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
  const quick = QUICK.some(([k]) => k === cat);
  const megaBtn = document.getElementById('megaBtn');
  if (megaBtn) quick ? megaBtn.removeAttribute('aria-current') : (page === 'shop' || page === 'product') && megaBtn.setAttribute('aria-current', 'page');
  const on = $('.catbar [aria-current]'); if (on) on.scrollIntoView({ block: 'nearest', inline: 'center' });
}
totop.onclick = () => { scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); $('#logo').focus({ preventScroll: true }); };
(() => { const s = $$('#utilRot span'); let i = 0; if (reduced || !s.length) return;
  setInterval(() => { const prev = s[i]; prev.classList.remove('on'); prev.classList.add('off'); setTimeout(() => prev.classList.remove('off'), 600); i = (i + 1) % s.length; s[i].classList.add('on'); }, 4000); })();

const megaBtn = $('#megaBtn'), mega = $('#mega'), scrim = $('#scrim');
function setMega(open) { megaBtn.setAttribute('aria-expanded', open); mega.classList.toggle('open', open); scrim.classList.toggle('on', open); }
megaBtn.onclick = () => setMega(megaBtn.getAttribute('aria-expanded') !== 'true');
scrim.onclick = () => setMega(false);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && mega.classList.contains('open')) { setMega(false); megaBtn.focus(); } });
mega.addEventListener('focusout', e => { if (e.relatedTarget && !mega.contains(e.relatedTarget) && e.relatedTarget !== megaBtn) setMega(false); });
const mnav = $('#mnav');
$('#burger').onclick = () => mnav.showModal();
mnav.addEventListener('click', e => { if (e.target.closest('a')) mnav.close(); });
$$('dialog').forEach(d => d.addEventListener('click', e => { if (e.target.closest('[data-close]') || e.target === d) d.close(); }));

/* filter links: the shop page handles them in place, everywhere else they navigate */
const BB = window.BB = { onSet: null };
document.addEventListener('click', e => {
  const a = e.target.closest('[data-set]'); if (!a || !BB.onSet) return;
  e.preventDefault(); setMega(false); if (mnav.open) mnav.close(); BB.onSet(a.dataset.set);
});

/* ---------------- REVEAL, SPLIT TEXT, COUNTERS ---------------- */
function splitWords(el) {
  let n = 0;
  const walk = node => [...node.childNodes].forEach(c => {
    if (c.nodeType === 3) {
      const frag = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(w => {
        if (!w) return; if (/^\s+$/.test(w)) { frag.append(' '); return; }
        const o = document.createElement('span'); o.className = 'split-w'; const i = document.createElement('span'); i.textContent = w; i.style.transitionDelay = (n++ * 0.06) + 's'; o.append(i); frag.append(o);
      });
      c.replaceWith(frag);
    } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
  });
  walk(el);
}
if (!reduced) $$('[data-split]').forEach(splitWords);
function countTo(el, end, start = 0, suffix = '') {
  const fmt = n => end >= 10000 ? n.toLocaleString('en-GB') : String(n); // years like 1998 stay comma-free
  if (reduced) { el.textContent = fmt(end) + suffix; return; }
  const t0 = performance.now(), dur = 1400;
  const step = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(Math.round(start + (end - start) * e)) + suffix; if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return; const el = en.target; el.classList.add('in'); io.unobserve(el);
  if (el.dataset.count) countTo(el, +el.dataset.count, +(el.dataset.from || 0), el.dataset.suffix || '');
}), { rootMargin: '0px 0px -12% 0px' }) : null;
const reveal = (root = document) => $$('.rv,.reveal-img,[data-split],.pal,[data-count],.split-media', root).forEach(el => io ? io.observe(el) : el.classList.add('in'));
reveal();

/* ---------------- MOTION: cursor, magnetic, parallax, tapes, pinned scroll, lit words ---------------- */
if (false) { // custom cursor and magnetic buttons retired
  const cur = $('#cursor'), label = $('.ring span', cur), ringEl = $('.ring', cur), dot = $('.dot', cur);
  let mx = -100, my = -100, rx = -100, ry = -100;
  addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; }, { passive: true });
  (function loop() { rx += (mx - rx) * .18; ry += (my - ry) * .18; ringEl.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); })();
  document.addEventListener('pointerover', e => { const t = e.target.closest('[data-cursor]'); cur.classList.toggle('big', !!t); label.textContent = t ? t.dataset.cursor : ''; });
  document.addEventListener('pointerleave', () => cur.classList.add('hide')); document.addEventListener('pointerenter', () => cur.classList.remove('hide'));
  document.addEventListener('pointermove', e => {
    const m = e.target.closest('.btn,.card-quick,[data-magnet]');
    $$('.magnet-on').forEach(x => { if (x !== m) { x.classList.remove('magnet-on'); x.style.transform = ''; } });
    if (!m || m.closest('dialog')) return;
    const r = m.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    m.classList.add('magnet-on'); m.style.transition = 'transform .25s cubic-bezier(.2,.8,.2,1),color .35s,border-color .35s'; m.style.transform = `translate(${dx * .18}px,${dy * .3}px)`;
  }, { passive: true });
}

const tapes = $$('.tape-track').map((t, i) => {
  const words = (t.dataset.words || 'Billy’s red tape|The only red tape you’ll get').split('|');
  t.innerHTML = Array(8).fill(words).flat().map(w => `<span>${w}</span>`).join('');
  return { el: t, x: 0, dir: i % 2 ? 1 : -1 };
});
const pins = $$('.hscroll').map(sec => ({ sec, track: $('.hscroll-track', sec), bar: $('.hscroll-bar i', sec) }));
function sizePins() { pins.forEach(p => { const on = innerWidth >= 900 && !reduced; p.on = on; p.sec.style.height = on ? (p.track.scrollWidth - innerWidth + innerHeight + 80) + 'px' : ''; if (!on) p.track.style.transform = ''; }); }
sizePins(); addEventListener('resize', sizePins); addEventListener('load', sizePins);
const lits = $$('[data-lit]').map(el => { el.innerHTML = el.innerHTML.replace(/(<[^>]+>)|([^\s<]+)/g, (m, tag, w) => tag ? tag : `<span class="word">${w}</span>`); return { el, words: $$('.word', el) }; });
const pars = $$('[data-speed]');
let pv = 0;
(function frame() {
  const y = scrollY; vel = vel * .9 + (y - lastY) * .1; lastY = y;
  if (!reduced) {
    tapes.forEach(t => { const half = t.el.scrollWidth / 2; t.x += t.dir * (0.6 + Math.min(12, Math.abs(vel)) * .6); if (t.x < -half) t.x += half; if (t.x > 0) t.x -= half; t.el.style.transform = `translate3d(${t.x}px,0,0)`; });
    pins.forEach(p => { if (!p.on) return; const r = p.sec.getBoundingClientRect(), dist = p.sec.offsetHeight - innerHeight, k = Math.min(1, Math.max(0, -r.top / dist)); p.track.style.transform = `translate3d(${-k * (p.track.scrollWidth - innerWidth + 40)}px,0,0)`; if (p.bar) p.bar.style.transform = `scaleX(${k})`; });
    pars.forEach(el => { const r = el.getBoundingClientRect(); if (r.bottom < -200 || r.top > innerHeight + 200) return; const c = (r.top + r.height / 2 - innerHeight / 2); el.style.translate = `0 ${c * -(+el.dataset.speed)}px`; });
  }
  lits.forEach(({ el, words }) => { const r = el.getBoundingClientRect(), k = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (r.height + innerHeight * .35))); const n = reduced ? words.length : Math.round(k * words.length); words.forEach((w, i) => w.classList.toggle('lit', i < n)); });
  requestAnimationFrame(frame);
})();

/* ---------------- CARDS ---------------- */
function cardHTML(p, n = 0, pref = null) {
  const match = pref ? p.cols.find(c => pref.includes(c)) : null;
  return `<article class="card" style="animation-delay:${reduced ? 0 : (n % 12) * 60}ms">
    <a class="card-media" href="product.html?id=${p.id}" data-cursor="View" aria-label="${esc(p.name)}, ${p.code}">
      ${p.flag ? `<span class="flag ${p.flag === 'Best seller' ? 'red' : ''}">${p.flag}</span>` : ''}
      <img class="main" alt="" loading="lazy" src="${IMG(p.img[0])}"><img class="alt" alt="" loading="lazy" src="${IMG(p.img[1])}">
    </a>
    <button class="card-quick" type="button" data-quick="${p.id}" aria-label="Quick add ${esc(p.name)}">${SVG.plus}</button>
    <div class="card-body">
      <span class="card-code">${p.code}</span>
      <h3><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
      <span class="card-meta">${p.fab} · ${p.gsm} GSM${match ? ` · in ${COL[match][0]}` : ''}</span>
      <div class="card-sw">${p.cols.slice(0, 6).map(c => `<i style="background:${COL[c][1]}" title="${COL[c][0]}"></i>`).join('')}<small>${p.cols.length} colours</small></div>
      <span class="card-price">${gbp(p.price)} <small>· ${gbp(p.price * TIERS[3].m)} at 250+</small></span>
    </div></article>`;
}
document.addEventListener('click', e => { const b = e.target.closest('[data-quick]'); if (b) { e.preventDefault(); quick.open(b.dataset.quick, b); } });

/* ---------------- BUY BOX (quick view and product page share it) ---------------- */
function formHTML(hTag, titleId, isQuick) {
  return `<form class="pdp-body" novalidate>
    <div><span class="card-code" data-b="code"></span><${hTag} id="${titleId}" data-b="title"></${hTag}><p class="muted" data-b="desc" style="margin:0 0 .9rem"></p><div class="specs" data-b="specs"></div></div>
    <fieldset><legend>Colour: <output data-b="colname"></output> <span class="muted" style="font-weight:500;font-size:.8rem">(photo shows <span data-b="shown"></span>)</span></legend><div class="colsel-wrap"><span class="colsel-chip" data-b="colchip" aria-hidden="true"></span><select class="colsel" data-b="colsel" aria-label="Colour"></select></div><div class="sw-opts" data-b="cols"></div></fieldset>
    <fieldset><legend>Sizes and quantities</legend><table class="matrix"><caption class="sr-only">Enter a quantity for each size</caption><thead><tr><th scope="col">Size</th><th scope="col">Chest</th><th scope="col">Stock</th><th scope="col">Qty</th></tr></thead><tbody data-b="matrix"></tbody></table></fieldset>
    <fieldset><legend>Decoration</legend><div class="deco-opts" data-b="deco"></div></fieldset>
    <div><p style="font-weight:800;font-size:.9rem;margin:0 0 .5rem">Price per piece by quantity (ex VAT)</p><div class="tierbar" data-b="tiers"></div></div>
    <div class="sumbox"><div class="tot"><span><span data-b="qty">0</span> pieces · <span data-b="unit">£0.00</span>/pc</span><b data-b="total">£0.00</b></div><p class="nudge" data-b="nudge" aria-live="polite"></p><div class="eta">${SVG.truck}<span data-b="eta"></span></div></div>
    <button class="btn btn-brick btn-block" type="submit" data-b="add" disabled>Add to basket</button>
    ${isQuick ? '<a class="link" data-b="full" href="#" style="justify-self:start">See full details</a>' : ''}
    <div><details><summary>Fabric and details</summary><p class="muted" data-b="detail"></p></details><details data-b="sizebox"><summary>Size guide (inches)</summary><table><thead><tr><th scope="col">Size</th><th scope="col">Chest</th><th scope="col">Length</th></tr></thead><tbody data-b="sizetbl"></tbody></table></details><details><summary>Delivery and returns</summary><p class="muted">Blanks: dispatched in 3 to 5 working days, tracked UK delivery. Decorated: about 10 to 12 working days after proof. Free delivery over £150 ex VAT.</p></details></div>
  </form>`;
}
const stockFor = (p, s) => ([...(p.id + s)].reduce((a, c) => a + c.charCodeAt(0), 0) % 10 < 2 ? ['low', 'Low stock'] : ['', 'In stock']);
function workingDays(n) { const d = new Date(); if (d.getHours() >= 14) d.setDate(d.getDate() + 1); while (n > 0) { d.setDate(d.getDate() + 1); if (d.getDay() % 6) n--; } return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); }
function Buy(root, isQuick, onAdded) {
  const q = k => root.querySelector(`[data-b="${k}"]`), form = $('form', root); let cur = null;
  function load(id, prefCol) {
    cur = P.find(p => p.id === id) || P[0];
    const pc = prefCol && cur.cols.includes(prefCol) ? prefCol : cur.shown;
    q('code').textContent = cur.code; q('title').textContent = cur.name; q('desc').textContent = cur.desc;
    q('specs').innerHTML = ['Available blank', cur.fab, cur.gsm + ' GSM', CATS[cur.cat], cur.cols.length + ' colours'].map((s, i) => `<span${i ? '' : ' class="blank"'}>${s}</span>`).join('');
    q('shown').textContent = COL[cur.shown][0];
    const g = q('gimg'); if (g) { g.src = IMG(cur.img[0], 1000, 1250); g.alt = `Model wearing the ${cur.name} in ${COL[cur.shown][0].toLowerCase()}`; g.style.transformOrigin = ''; q('gmain').classList.remove('zoom'); }
    if (q('thumbs')) q('thumbs').innerHTML = cur.img.map((im, i) => `<button type="button" data-g="${i}" aria-label="Show image ${i + 1} of ${cur.img.length}" ${i ? '' : 'aria-current="true"'}><img alt="" src="${IMG(im, 168, 210)}"></button>`).join('');
    q('cols').innerHTML = cur.cols.map(c => `<label title="${COL[c][0]}"><input type="radio" name="col" value="${c}" ${c === pc ? 'checked' : ''} aria-label="${COL[c][0]}"><span style="background:${COL[c][1]}"></span></label>`).join('');
    q('colname').textContent = COL[pc][0];
    q('colsel').innerHTML = cur.cols.map(c => `<option value="${c}" ${c === pc ? 'selected' : ''}>${COL[c][0]}</option>`).join(''); q('colchip').style.background = COL[pc][1];
    const sizes = cur.cat === 'bottoms' ? SIZES.slice(1, 6) : SIZES;
    q('matrix').innerHTML = sizes.map(s => { const [cls, txt] = stockFor(cur, s); return `<tr><td>${s}</td><td>${CHEST[s]}″</td><td><span class="stock ${cls}">${txt}</span></td><td><div class="mini-qty"><button type="button" data-q="${s}" data-d="-1" aria-label="One fewer in ${s}">−</button><input type="number" min="0" max="5000" inputmode="numeric" value="${s === 'M' ? 1 : 0}" data-size="${s}" aria-label="Quantity in size ${s}"><button type="button" data-q="${s}" data-d="1" aria-label="One more in ${s}">+</button></div></td></tr>`; }).join('');
    q('sizetbl').innerHTML = sizes.map(s => `<tr><td>${s}</td><td>${CHEST[s]}</td><td>${LEN[s]}</td></tr>`).join('');
    q('deco').innerHTML = DECO.map((d, i) => `<label><input type="radio" name="deco" value="${d.id}" ${i ? '' : 'checked'}><span>${d.name}<small>${d.add ? '+' + gbp(d.add) + '/pc' : 'Included'}</small></span></label>`).join('');
    q('detail').textContent = `${cur.code}: ${cur.fab.toLowerCase()} at ${cur.gsm} GSM. ${cur.desc} Knitted, dyed and sewn in our own facilities. Machine wash at 40°C, wash dark colours separately, do not iron on print.`;
    if (q('full')) q('full').href = `product.html?id=${cur.id}`;
    $$('details', root).forEach(d => d.open = false);
    upd(); return cur;
  }
  function st() { const sizes = {}; let qty = 0; $$('[data-size]', root).forEach(i => { const v = Math.max(0, Math.min(5000, parseInt(i.value) || 0)); if (v) { sizes[i.dataset.size] = v; qty += v; } }); return { sizes, qty, col: form.col.value, deco: DECO.find(d => d.id === form.deco.value) }; }
  function upd() {
    const s = st(), t = tierFor(Math.max(1, s.qty)), unit = cur.price * t.m + s.deco.add;
    q('qty').textContent = s.qty; q('unit').textContent = gbp(unit); q('total').textContent = gbp(unit * s.qty);
    q('tiers').innerHTML = TIERS.map(x => `<div class="${x === t && s.qty ? 'on' : ''}"><b>${gbp(cur.price * x.m + s.deco.add)}</b>${x.l}</div>`).join('');
    const nx = TIERS[TIERS.indexOf(t) + 1];
    q('nudge').textContent = !s.qty ? 'Enter a quantity for at least one size' : nx ? `Add ${nx.min - s.qty} more to pay ${gbp(cur.price * nx.m + s.deco.add)} per piece` : 'Best price unlocked';
    q('nudge').style.color = s.qty ? '' : 'var(--muted)';
    q('eta').innerHTML = s.deco.add ? `Decorated: estimated delivery <b>${workingDays(12)}</b> if you approve the proof today` : `Order by 2pm for estimated UK delivery <b>${workingDays(4)}</b>`;
    q('add').disabled = !s.qty; q('add').textContent = s.qty ? `Add ${s.qty} to basket · ${gbp(unit * s.qty)}` : 'Add to basket';
    root.dispatchEvent(new CustomEvent('buy:update', { detail: { qty: s.qty, total: unit * s.qty } }));
  }
  form.addEventListener('input', e => {
    if (e.target.name === 'col') { const c = e.target.value; q('colname').textContent = COL[c][0]; q('colsel').value = c; q('colchip').style.background = COL[c][1]; }
    if (e.target === q('colsel')) { const c = e.target.value, r = $(`input[name="col"][value="${c}"]`, root); if (r) r.checked = true; q('colname').textContent = COL[c][0]; q('colchip').style.background = COL[c][1]; }
    upd(); });
  form.addEventListener('change', upd);
  form.addEventListener('click', e => { const b = e.target.closest('[data-q]'); if (!b) return; const i = $(`[data-size="${b.dataset.q}"]`, root); i.value = Math.max(0, (parseInt(i.value) || 0) + +b.dataset.d); upd(); });
  if (q('thumbs')) q('thumbs').addEventListener('click', e => {
    const b = e.target.closest('[data-g]'); if (!b) return; const img = q('gimg');
    img.style.opacity = 0; setTimeout(() => { img.src = IMG(cur.img[+b.dataset.g], 1000, 1250); img.style.opacity = 1; }, reduced ? 0 : 200);
    $$('[data-g]', root).forEach(x => x === b ? x.setAttribute('aria-current', 'true') : x.removeAttribute('aria-current'));
  });
  const gm = q('gmain');
  if (gm) { gm.addEventListener('click', () => gm.classList.toggle('zoom')); gm.addEventListener('mousemove', e => { if (!gm.classList.contains('zoom')) return; const r = gm.getBoundingClientRect(); q('gimg').style.transformOrigin = `${(e.clientX - r.left) / r.width * 100}% ${(e.clientY - r.top) / r.height * 100}%`; }); }
  form.addEventListener('submit', e => {
    e.preventDefault(); const s = st(); if (!s.qty) return;
    const key = [cur.id, s.col, s.deco.id].join('|'), ex = basket.find(l => l.key === key);
    if (ex) Object.entries(s.sizes).forEach(([k, v]) => ex.sizes[k] = (ex.sizes[k] || 0) + v); else basket.push({ key, id: cur.id, col: s.col, deco: s.deco.id, sizes: s.sizes });
    saveB(); celebrate(q('add')); fly(q('gimg') || { src: IMG(cur.img[0]), getBoundingClientRect: () => q('add').getBoundingClientRect() });
    toast(`Added ${s.qty} × ${cur.name} in ${COL[s.col][0]}`, true);
    if (onAdded) onAdded();
  });
  function setLine(l) { $$('[data-size]', root).forEach(i => i.value = l.sizes[i.dataset.size] || 0); $(`input[name="col"][value="${l.col}"]`, root).checked = true; $(`input[name="deco"][value="${l.deco}"]`, root).checked = true; q('colname').textContent = COL[l.col][0]; q('colsel').value = l.col; q('colchip').style.background = COL[l.col][1]; upd(); }
  return { load, setLine, upd, get cur() { return cur; } };
}
const qv = $('#qv'); let opener = null;
const quickBuy = Buy(qv, true, () => qv.close());
const quick = { open(id, from, col) { opener = from; quickBuy.load(id, col || (BB.prefCol && BB.prefCol())); qv.showModal(); $('.pdp-inner', qv).scrollTop = 0; }, buy: quickBuy };
qv.addEventListener('close', () => { if (opener && document.contains(opener) && opener.offsetParent !== null) opener.focus(); });

/* ---------------- BASKET ---------------- */
let basket = store.get('bb-basket-v2', []).filter(l => P.some(p => p.id === l.id));
const drawer = $('#drawer'), FREE = 150, SHIP = 6.95, VAT = .2;
const lineQty = l => Object.values(l.sizes).reduce((a, b) => a + b, 0);
const lineUnit = l => { const p = P.find(x => x.id === l.id), d = DECO.find(x => x.id === l.deco); return p.price * tierFor(lineQty(l)).m + d.add; };
function saveB() { store.set('bb-basket-v2', basket); renderB(); }
function renderB() {
  const n = basket.reduce((a, l) => a + lineQty(l), 0);
  $('#badge').textContent = n; $('#basketBtn').setAttribute('aria-label', `Basket, ${n} item${n === 1 ? '' : 's'}`);
  const sub = basket.reduce((a, l) => a + lineUnit(l) * lineQty(l), 0), ship = !sub || sub >= FREE ? 0 : SHIP, vat = (sub + ship) * VAT, pct = Math.min(100, sub / FREE * 100);
  $('#meter').innerHTML = basket.length ? `${sub >= FREE ? '<b>Free UK delivery unlocked</b>' : `Spend <b>${gbp(FREE - sub)}</b> more for free UK delivery`}<div class="meter" role="progressbar" aria-label="Progress to free delivery" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}"><i style="width:${pct}%"></i></div>` : `Free UK delivery over ${gbp(FREE)} ex VAT`;
  $('#lines').innerHTML = basket.length ? basket.map((l, i) => {
    const p = P.find(x => x.id === l.id), d = DECO.find(x => x.id === l.deco), q = lineQty(l), t = tierFor(q);
    return `<li class="ln"><img alt="" src="${IMG(p.img[0], 152, 190)}"><div><h3>${esc(p.name)}</h3><p>${p.code} · ${COL[l.col][0]} · ${d.name}</p><p>${Object.entries(l.sizes).map(([s, v]) => `${s} × ${v}`).join(', ')}</p><p>${q} pcs · ${gbp(lineUnit(l))}/pc${t.m < 1 ? ` · <b style="color:var(--ok)">${Math.round((1 - t.m) * 100)}% bulk saving</b>` : ''}</p></div>
      <div class="end"><span>${gbp(lineUnit(l) * q)}</span><span style="display:grid;justify-items:end"><button type="button" class="link" data-edit="${i}">Edit<span class="sr-only"> ${esc(p.name)}</span></button><button type="button" class="link" data-rm="${i}">Remove<span class="sr-only"> ${esc(p.name)}</span></button></span></div></li>`;
  }).join('') : `<li class="empty-basket"><img src="${LOGO(200)}" alt="" width="90" style="margin:0 auto 1rem;mix-blend-mode:multiply;opacity:.9"><p>Your basket is empty.</p><a class="btn" href="shop.html">Explore merchandise</a></li>`;
  $('#bFoot').innerHTML = basket.length ? `<div class="sum"><span>Subtotal (ex VAT)</span><span>${gbp(sub)}</span></div><div class="sum"><span>UK delivery</span><span>${ship ? gbp(ship) : 'Free'}</span></div><div class="sum"><span>VAT (20%)</span><span>${gbp(vat)}</span></div><div class="sum total"><span>Total</span><span>${gbp(sub + ship + vat)}</span></div><button class="btn btn-brick btn-block" type="button" id="checkout">Checkout securely</button><p class="muted" style="margin:0;text-align:center;font-size:.78rem">Card, Apple Pay, Klarna or 30-day trade invoice</p>` : '';
  const co = $('#checkout'); if (co) co.onclick = () => toast('Checkout would hand off to your payment provider here.');
}
$('#lines').addEventListener('click', e => {
  const r = e.target.closest('[data-rm]'), ed = e.target.closest('[data-edit]');
  if (r) { const l = basket.splice(+r.dataset.rm, 1)[0]; saveB(); toast(`Removed ${P.find(p => p.id === l.id).name}`); $('#drawer [data-close]').focus(); }
  if (ed) { const l = basket.splice(+ed.dataset.edit, 1)[0]; saveB(); drawer.close(); quick.open(l.id, $('#basketBtn'), l.col); quickBuy.setLine(l); }
});
$('#basketBtn').onclick = () => drawer.showModal();
renderB();

function fly(src) {
  const badge = $('#badge'), bump = () => { badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump'); };
  if (reduced || !src) return bump();
  const a = src.getBoundingClientRect(), b = $('#basketBtn').getBoundingClientRect();
  const im = document.createElement('img'); im.className = 'fly'; im.src = src.src; im.alt = '';
  im.style.left = (a.left + a.width / 2 - 28) + 'px'; im.style.top = (a.top + a.height / 3) + 'px'; document.body.append(im);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top - (a.top + a.height / 3);
  im.animate([{ transform: 'translate(0,0) scale(1.6)', opacity: 1 }, { transform: `translate(${dx * .6}px,${dy - 120}px) scale(1) rotate(-8deg)`, offset: .55 }, { transform: `translate(${dx}px,${dy}px) scale(.2) rotate(10deg)`, opacity: .4 }], { duration: 850, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = () => { im.remove(); bump(); };
}
function celebrate() {}
let tt;
function toast(msg, withBtn) { $('#toastMsg').textContent = msg; $('#toastBtn').hidden = !withBtn; const t = $('#toast'); t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 5000); }
$('#toastBtn').onclick = () => { $('#toast').classList.remove('show'); drawer.showModal(); };

/* ---------------- SEARCH ---------------- */
$$('[data-search]').forEach(box => {
  const inp = $('input', box), list = $('.suggest', box); let items = [], act = -1;
  function close() { list.classList.remove('open'); inp.setAttribute('aria-expanded', 'false'); inp.removeAttribute('aria-activedescendant'); act = -1; }
  function show(qs) {
    qs = qs.trim().toLowerCase(); if (!qs) return close();
    items = P.filter(p => [p.name, p.code, p.fab, CATS[p.cat], p.gsm + ' gsm', p.gsm + 'gsm'].join(' ').toLowerCase().includes(qs)).slice(0, 6);
    list.innerHTML = items.length ? items.map((p, i) => `<li role="option" id="${list.id}-${i}" aria-selected="false" data-i="${i}"><img alt="" src="${IMG(p.img[0], 88, 104)}"><div><b>${esc(p.name)}</b><small>${p.code} · ${p.fab} · ${p.gsm} GSM · ${gbp(p.price)}</small></div></li>`).join('') : `<li class="none" role="option" aria-disabled="true">No styles match “${esc(qs)}”</li>`;
    list.classList.add('open'); inp.setAttribute('aria-expanded', 'true'); act = -1; inp.removeAttribute('aria-activedescendant');
  }
  function move(d) { const o = $$('[data-i]', list); if (!o.length) return; act = (act + d + o.length) % o.length; o.forEach((x, i) => x.setAttribute('aria-selected', i === act)); inp.setAttribute('aria-activedescendant', o[act].id); o[act].scrollIntoView({ block: 'nearest' }); }
  function pick(i) { const p = items[i]; if (!p) return; close(); location.href = `product.html?id=${p.id}`; }
  inp.addEventListener('input', () => show(inp.value));
  inp.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!list.classList.contains('open')) show(inp.value); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); pick(act < 0 ? 0 : act); }
    else if (e.key === 'Escape' && list.classList.contains('open')) { e.preventDefault(); e.stopPropagation(); close(); }
  });
  list.addEventListener('mousedown', e => { const li = e.target.closest('[data-i]'); if (li) { e.preventDefault(); pick(+li.dataset.i); } });
  inp.addEventListener('blur', () => setTimeout(close, 120));
});

/* ---------------- SHARED SECTIONS (run when present) ---------------- */
if ($('#hero')) (() => {
  const hero = $('#hero'), slides = $$('.slide', hero), dots = $$('#dots button'); let i = 0, t = null, paused = reduced; const DUR = 7000;
  hero.style.setProperty('--dur', DUR + 'ms');
  function go(n) {
    slides[i].classList.remove('on'); slides[i].setAttribute('aria-hidden', 'true'); dots[i].removeAttribute('aria-current');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('on'); slides[i].removeAttribute('aria-hidden'); dots[i].setAttribute('aria-current', 'true');
    const bar = dots[i].querySelector('i'); bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
    schedule();
  }
  function schedule() { clearTimeout(t); if (!paused && !hero.classList.contains('hold')) t = setTimeout(() => go(i + 1), DUR); }
  dots.forEach((d, n) => d.onclick = () => go(n));
  const pb = $('#pause');
  function setPaused(p) { paused = p; hero.classList.toggle('paused', p); pb.setAttribute('aria-label', p ? 'Play slideshow' : 'Pause slideshow'); $('#pauseIcon').innerHTML = p ? '<path d="M7 5l12 7-12 7z"/>' : '<rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>'; schedule(); }
  pb.onclick = () => setPaused(!paused);
  hero.addEventListener('focusin', () => { hero.classList.add('hold', 'paused'); clearTimeout(t); });
  hero.addEventListener('focusout', e => { if (!hero.contains(e.relatedTarget)) { hero.classList.remove('hold'); hero.classList.toggle('paused', paused); schedule(); } });
  // first slide waits for the intro curtain
  const first = slides[0]; if ($('#intro')) { first.classList.remove('on'); setTimeout(() => { first.classList.add('on'); setPaused(reduced); }, 1150); } else setPaused(reduced);
})();
if ($('#cats')) $('#cats').innerHTML = Object.entries(CATS).map(([k, v], n) => {
  const list = P.filter(p => p.cat === k), from = Math.min(...list.map(p => p.price * TIERS[3].m));
  return `<a class="cat rv d${n % 3}" href="${shopLink('cat:' + k)}" data-cursor="View"><span class="cat-n">0${n + 1}</span><img alt="" loading="lazy" src="${IMG(CAT_IMG[k], 700, 875)}"><div class="cat-label"><div><h3>${v}</h3><small>${list.length} styles</small></div><span class="cat-arrow" aria-hidden="true">${SVG.arrow}</span></div></a>`;
}).join('');
if ($('#marq')) { const w = ['Serious cotton', 'Silly name', 'Arms up', 'Combed cotton', 'Mercerised', 'Fleece', 'No bad days', 'Made in our mills']; $('#marq').innerHTML = [...w, ...w].map(x => `<span>${x}</span>`).join(''); }
if ($('#palGrid')) $('#palGrid').innerHTML = ALL.map((c, n) => `<a class="pal" href="${shopLink('col:' + c)}" data-cursor="Shop" style="transition-delay:${n * 25}ms;text-decoration:none"><i style="background:${COL[c][1]}"></i>${COL[c][0]}<span class="sr-only">: show styles in this colour</span></a>`).join('');
$$('[data-products]').forEach(el => { const ids = el.dataset.products.split(','); el.innerHTML = ids.map((id, n) => cardHTML(P.find(p => p.id === id), n)).join(''); });
// content built by script above needs the scroll-reveal watcher too
['#cats', '#palGrid'].forEach(sel => { const el = $(sel); if (el) reveal(el); });
if ($('#tabs')) (() => {
  const tl = $('#tabs'), tp = $('#tabpanels'), media = $('#techMedia');
  tl.innerHTML = TECH.map((t, i) => `<button class="tab" type="button" role="tab" id="tab-${t.id}" aria-controls="tp-${t.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${t.name}</button>`).join('');
  tp.innerHTML = TECH.map((t, i) => `<div class="tabpanel" role="tabpanel" id="tp-${t.id}" aria-labelledby="tab-${t.id}" ${i ? 'hidden' : ''} tabindex="0"><h3>${t.h}</h3><p class="muted">${t.p}</p><ul>${t.pts.map(x => `<li>${x}</li>`).join('')}</ul><a class="btn btn-outline" href="${shopLink(t.set)}">Shop ${t.name} styles</a></div>`).join('');
  media.insertAdjacentHTML('afterbegin', TECH.map((t, i) => `<img alt="" loading="lazy" class="${i ? '' : 'on'}" src="${IMG(t.img, 800, 1000)}">`).join(''));
  const tabs = $$('.tab', tl), panels = $$('.tabpanel', tp), imgs = $$('img', media);
  function sel(n, focus) { tabs.forEach((t, i) => { t.setAttribute('aria-selected', i === n); t.tabIndex = i === n ? 0 : -1; panels[i].hidden = i !== n; imgs[i].classList.toggle('on', i === n); }); panels[n].classList.remove('enter'); void panels[n].offsetWidth; panels[n].classList.add('enter'); countTo($('#techGsm'), TECH[n].gsm, +$('#techGsm').textContent); if (focus) tabs[n].focus(); }
  tabs.forEach((t, i) => t.onclick = () => sel(i));
  tl.addEventListener('keydown', e => { const i = tabs.indexOf(document.activeElement); if (i < 0) return; const map = { ArrowRight: (i + 1) % tabs.length, ArrowLeft: (i - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 }; if (e.key in map) { e.preventDefault(); sel(map[e.key], true); } });
})();

/* ---------------- FORMS ---------------- */
const ukPost = /^(GIR ?0AA|[A-PR-UWYZ]([0-9]{1,2}|[A-HK-Y][0-9]{1,2}|[0-9][A-HJKS-UW]|[A-HK-Y][0-9][ABEHMNPRV-Y]) ?[0-9][ABD-HJLNP-UW-Z]{2})$/i;
const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
function validate(f, rules) {
  let first = null;
  rules.forEach(([el, ok, msg]) => { const bad = !ok(el.value); el.setAttribute('aria-invalid', bad); $('#' + el.getAttribute('aria-describedby').split(' ')[0]).textContent = bad ? msg : ''; if (bad && !first) first = el; });
  if (first) { first.focus(); return false; } return true;
}
$('#newsForm').addEventListener('submit', e => { e.preventDefault(); if (emailOk($('#nw').value)) { toast('Thank you. You’re on the list.'); e.target.reset(); } else { toast('Enter a valid email address'); $('#nw').focus(); } });
$$('.file').forEach(drop => {
  const art = $('input[type=file]', drop), name = $('.muted', drop), def = name.textContent;
  art.addEventListener('change', () => { name.textContent = art.files[0] ? art.files[0].name : def; });
  ['dragover', 'dragenter'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('drag'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('drag'); }));
  drop.addEventListener('drop', e => { if (e.dataTransfer.files[0]) name.textContent = e.dataTransfer.files[0].name; });
});

(() => {
  const set = new URLSearchParams(location.search).get('set') || '';
  const pid = new URLSearchParams(location.search).get('id');
  const cat = set.startsWith('cat:') ? set.slice(4) : (page === 'product' ? (P.find(p => p.id === pid) || P[0]).cat : null);
  markNav(cat);
})();
Object.assign(BB, { markNav, $, $$, reduced, fine, gbp, esc, tierFor, cardHTML, Buy, formHTML, quick, toast, reveal, countTo, celebrate, validate, emailOk, ukPost, shopLink, SVG, store, splitWords });
})();
