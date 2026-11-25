(() => {
  'use strict';
  const D = window.XYZ;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = document.body.dataset.page;
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const save = (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} };
  const load = k => { try { return localStorage.getItem(k); } catch (_) { return null; } };

  /* ---------- Shared shell: header, newsletter, footer, modal ---------- */
  const bolt = s => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true"><path class="im" d="M13.5 2 4 14h6l-1.5 8L20 9h-6.5z"/></svg>`;
  const links = [['home', 'index.html', 'Home'], ['magazine', 'magazine.html', 'Magazine'], ['guides', 'guides.html', 'Product Guides'], ['', '#newsletter', 'Newsletter']];

  $('#siteHeader').innerHTML = `<div class="wrap bar">
    <a class="brand" href="index.html" aria-label="TrendSphere home">${bolt(26)}<span>TrendSphere</span></a>
    <nav id="nav" class="nav" aria-label="Main">${links.map(([p, h, t]) => `<a href="${h}"${p === page ? ' class="active" aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
    <div class="tools">
      <button id="themeBtn" class="icon-btn" aria-label="Switch to dark theme"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor"/></svg></button>
      <button id="menuBtn" class="icon-btn burger" aria-expanded="false" aria-controls="nav" aria-label="Open menu"><span></span><span></span><span></span></button>
    </div></div>`;

  $('#nlSlot').innerHTML = `<section class="wrap sec" id="newsletter"><div class="news">
    <h2>One email a week. No filler.</h2>
    <p>New reviews, price drops worth acting on, and one thing we changed our mind about.</p>
    <form id="nl" class="nl-form" novalidate><label class="sr" for="email">Email address</label>
      <input id="email" type="email" placeholder="you@example.com" autocomplete="email" required>
      <button class="btn btn-light" type="submit">Subscribe</button></form>
    <p class="msg" id="nlMsg" role="status" aria-live="polite"></p></div></section>`;

  $('#siteFooter').innerHTML = `<div class="wrap foot-grid">
    <div><a class="brand" href="index.html">${bolt(24)}<span>TrendSphere</span></a><p>Independent reviews and explainers for the gear you actually use.</p></div>
    <div><h3>Pages</h3><a href="index.html">Home</a><a href="magazine.html">Magazine</a><a href="guides.html">Product Guides</a></div>
    <div><h3>Categories</h3><a href="magazine.html">Wearables</a><a href="magazine.html">Audio</a><a href="magazine.html">Smart Home</a></div>
    <div><h3>About</h3><a href="#newsletter">Newsletter</a><a href="#top">Back to top</a></div></div>
    <p class="wrap copy">&copy; ${new Date().getFullYear()} TrendSphere Magazine. All rights reserved.</p>`;

  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal" id="modal" aria-hidden="true"><div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-labelledby="mTitle" tabindex="-1"></div></div>`);

  /* ---------- Theme and menu ---------- */
  const themeBtn = $('#themeBtn');
  const setTheme = t => {
    root.dataset.theme = t;
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    save('volt-theme', t);
  };
  setTheme(load('volt-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  const menuBtn = $('#menuBtn'), nav = $('#nav');
  const setMenu = o => {
    nav.classList.toggle('open', o);
    menuBtn.setAttribute('aria-expanded', String(o));
    menuBtn.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
  };
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });

  /* ---------- RGB colour cycling: hue follows scroll, plus a slow drift ---------- */
  if (!reduce) {
    let lastH = -1;
    const cycle = t => {
      const max = root.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(scrollY / max, 1) : 0;
      const h = Math.round(((275 + p * 360 + t / 1000 * 6) % 360) / 3) * 3;
      if (h !== lastH) { lastH = h; root.style.setProperty('--h', h); }
      requestAnimationFrame(cycle);
    };
    requestAnimationFrame(cycle);
  }

  /* ---------- Art ---------- */
  const art = k => '<svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + [
    '<circle class="fc" cx="320" cy="40" r="70" opacity=".45"/><circle class="fb" cx="90" cy="150" r="60" opacity=".5"/><path class="fw" d="M0 120q100-60 200 0t200 0v40H0z" opacity=".25"/>',
    '<rect class="fc" x="260" y="-20" width="110" height="110" rx="28" transform="rotate(20 315 35)" opacity=".5"/><circle class="fb" cx="70" cy="60" r="44" opacity=".5"/><circle class="fw" cx="180" cy="130" r="16" opacity=".35"/>',
    '<path class="fc" d="M0 0h200l-60 160H0z" opacity=".4"/><circle class="fb" cx="300" cy="90" r="64" opacity=".5"/><circle class="fw" cx="340" cy="30" r="12" opacity=".5"/>',
    '<circle class="fc" cx="80" cy="40" r="50" opacity=".45"/><rect class="fb" x="230" y="40" width="120" height="120" rx="60" opacity=".5"/><path class="fw" d="M0 150l80-50 60 30 70-60 190 80v10H0z" opacity=".2"/>'
  ][k] + '</svg>';
  const pics = {
    watch: '<rect class="fw" x="82" y="6" width="36" height="138" rx="12" opacity=".55"/><rect class="fw" x="62" y="38" width="76" height="76" rx="22"/><rect class="fa" x="70" y="46" width="60" height="60" rx="16"/><path d="M82 82l9-16 7 11 8-14 6 19" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    buds: '<rect class="fw" x="50" y="28" width="30" height="86" rx="15"/><circle class="fc" cx="65" cy="46" r="20"/><circle class="fa" cx="65" cy="46" r="8"/><rect class="fw" x="120" y="28" width="30" height="86" rx="15"/><circle class="fc" cx="135" cy="46" r="20"/><circle class="fa" cx="135" cy="46" r="8"/>',
    lamp: '<ellipse class="fw" cx="90" cy="132" rx="40" ry="8"/><path d="M90 132V74l34-38" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/><circle class="fc" cx="132" cy="38" r="30" opacity=".55"/><rect class="fw" x="112" y="18" width="46" height="30" rx="10" transform="rotate(38 135 33)"/>'
  };
  const pic = p => `<svg viewBox="0 0 200 150" aria-hidden="true">${pics[p.s]}</svg>`;

  /* ---------- Reveal and count-up ---------- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    io.unobserve(e.target);
    setTimeout(() => e.target.style.setProperty('--d', '0ms'), 1600);
  }), { threshold: .12 }) : null;
  const watch = r => $$('.reveal:not(.in)', r).forEach(el => io ? io.observe(el) : el.classList.add('in'));
  $$('[data-count]').forEach(el => {
    const t = +el.dataset.count, suf = el.dataset.suf || '';
    const run = () => {
      if (reduce) return;
      const s = performance.now();
      const f = n => { const k = Math.min((n - s) / 1200, 1); el.textContent = Math.round(t * (1 - Math.pow(1 - k, 3))) + suf; if (k < 1) requestAnimationFrame(f); };
      requestAnimationFrame(f);
    };
    if (!('IntersectionObserver' in window)) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { o.disconnect(); run(); } }, { threshold: .5 });
    o.observe(el);
  });
  const track = $('#track');
  if (track) track.innerHTML += track.innerHTML;

  /* ---------- Cards ---------- */
  const cardA = (a, i, f) => `<article class="card reveal k${a.k}${f ? ' feature' : ''}" style="--d:${i * 90}ms"><div class="art">${art(a.k)}</div><div class="body"><div class="meta"><span class="pill">${a.cat}</span><span>${a.time} min read</span></div><h3>${a.t}</h3><p>${a.ex}</p><button class="btn btn-ghost" data-read="${a.id}">Read Article</button></div></article>`;
  const cardP = (p, i) => `<article class="card reveal k${p.k}" style="--d:${i * 110}ms"><div class="art">${pic(p)}<span class="score" aria-label="Editorial score ${p.score} out of 10">${p.score}</span></div><div class="body"><div class="meta"><span class="pill">${p.type}</span><span>${p.price}</span></div><h3>${p.name}</h3><ul>${p.bullets.map(b => `<li>${b}</li>`).join('')}</ul><button class="btn btn-ghost" data-spec="${p.id}">View Full Specs</button></div></article>`;

  const top = $('#topStories'), topP = $('#topProducts');
  if (top) { top.innerHTML = D.articles.slice(0, 3).map((a, i) => cardA(a, i)).join(''); watch(top); }
  if (topP) { topP.innerHTML = D.products.map(cardP).join(''); watch(topP); }

  const feed = $('#feed');
  if (feed) {
    let cat = 'All', q = '';
    const tabs = $('#tabs');
    tabs.innerHTML = ['All', ...new Set(D.articles.map(a => a.cat))].map((c, i) => `<button class="tab" data-cat="${c}" aria-pressed="${i === 0}">${c}</button>`).join('');
    const draw = () => {
      const list = D.articles.filter(a => (cat === 'All' || a.cat === cat) && (a.t + a.ex + a.cat).toLowerCase().includes(q));
      feed.innerHTML = list.map((a, i) => cardA(a, i, cat === 'All' && !q && i === 0)).join('');
      $('#empty').hidden = list.length > 0;
      watch(feed);
    };
    tabs.addEventListener('click', e => {
      const t = e.target.closest('.tab'); if (!t) return;
      cat = t.dataset.cat;
      $$('.tab', tabs).forEach(b => b.setAttribute('aria-pressed', String(b === t)));
      draw();
    });
    $('#q').addEventListener('input', e => { q = e.target.value.trim().toLowerCase(); draw(); });
    draw();
  }

  const prods = $('#products');
  if (prods) {
    prods.innerHTML = D.products.map(cardP).join(''); watch(prods);
    const best = (arr, fn) => arr.indexOf(fn(...arr));
    const sc = best(D.products.map(p => p.score), Math.max), pr = best(D.products.map(p => p.pn), Math.min);
    const row = (label, f, hi) => `<tr><th scope="row">${label}</th>${D.products.map((p, i) => `<td${hi === i ? ' class="best"' : ''}>${f(p)}</td>`).join('')}</tr>`;
    $('#compare').innerHTML = `<table><caption class="sr">Product comparison</caption><thead><tr><th><span class="sr">Feature</span></th>${D.products.map(p => `<th scope="col">${p.name}</th>`).join('')}</tr></thead><tbody>
      ${row('Category', p => p.type)}${row('Editorial score', p => p.score + ' / 10', sc)}${row('Price', p => p.price, pr)}${row('Best for', p => p.fit)}${row('Battery or power', p => p.specs[1][1])}</tbody></table>`;
  }

  /* ---------- Modals ---------- */
  const modal = $('#modal'), sheet = $('#sheet');
  let last = null;
  const openModal = (html, trigger) => {
    last = trigger;
    sheet.innerHTML = '<button class="close icon-btn" data-close aria-label="Close"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button>' + html;
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    sheet.scrollTop = 0; sheet.focus();
  };
  const closeModal = () => {
    modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
    if (last) last.focus();
  };
  const readerHTML = a => `<div class="k${a.k}"><div class="m-art">${art(a.k)}</div><div class="meta"><span class="pill">${a.cat}</span><span>${a.time} min read</span></div><h2 id="mTitle">${a.t}</h2><p>${a.body[0]}</p><blockquote>${a.q}</blockquote><p>${a.body[1]}</p></div>`;
  const specHTML = p => `<div class="k${p.k}"><div class="m-art">${pic(p)}</div><div class="meta"><span class="pill">${p.type}</span><span>Editorial score ${p.score}/10</span><span>${p.price}</span></div><h2 id="mTitle">${p.name}</h2>
    <div class="tbl"><table><caption class="sr">Technical specifications</caption><tbody>${p.specs.map(([a, b]) => `<tr><th scope="row">${a}</th><td>${b}</td></tr>`).join('')}</tbody></table></div>
    <div class="pc"><div><h3>Pros</h3><ul>${p.pros.map(x => `<li>${x}</li>`).join('')}</ul></div><div><h3>Cons</h3><ul>${p.cons.map(x => `<li>${x}</li>`).join('')}</ul></div></div>
    <div class="verdict"><h3>Editorial verdict</h3><p>${p.v}</p></div></div>`;

  document.addEventListener('click', e => {
    const r = e.target.closest('[data-read]'), s = e.target.closest('[data-spec]');
    if (r) openModal(readerHTML(D.articles.find(a => a.id === r.dataset.read)), r);
    else if (s) openModal(specHTML(D.products.find(p => p.id === s.dataset.spec)), s);
    else if (e.target.closest('[data-close]') || e.target === modal) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setMenu(false);
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') { e.preventDefault(); $('[data-close]', sheet).focus(); }
  });

  /* ---------- Progress bar ---------- */
  const bar = $('#progress');
  let ticking = false;
  const update = () => {
    const max = root.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();

  /* ---------- Desktop-only mouse parallax ---------- */
  const stage = $('#stage');
  if (stage && !reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const layers = $$('.layer', stage), hero = $('.hero');
    let raf = 0, x = 0, y = 0;
    const apply = () => { raf = 0; layers.forEach(l => { const d = +l.dataset.d; l.style.transform = `translate3d(${x * d}px,${y * d}px,0)`; }); };
    const queue = () => { if (!raf) raf = requestAnimationFrame(apply); };
    hero.addEventListener('mousemove', e => {
      const b = stage.getBoundingClientRect();
      x = (e.clientX - (b.left + b.width / 2)) / b.width;
      y = (e.clientY - (b.top + b.height / 2)) / b.height;
      queue();
    });
    hero.addEventListener('mouseleave', () => { x = y = 0; queue(); });
  }

  /* ---------- Newsletter validation ---------- */
  $('#nl').addEventListener('submit', e => {
    e.preventDefault();
    const input = $('#email'), msg = $('#nlMsg');
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
    input.setAttribute('aria-invalid', String(!ok));
    msg.className = 'msg ' + (ok ? 'ok' : 'err');
    msg.textContent = ok ? 'You are in. Check your inbox to confirm.' : 'Enter a valid email address, like name@example.com.';
    if (ok) input.value = '';
  });
})();
