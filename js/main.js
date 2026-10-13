(function () {
  'use strict';

  var cfg = window.BBL_CONFIG || {};
  var i18n = window.BBL_I18N;
  var fleet = window.BBL_FLEET || [];

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- Data dari config.js ---------- */
  $all('[data-cfg]').forEach(function (el) {
    var key = el.getAttribute('data-cfg');
    if (cfg[key]) el.textContent = cfg[key];
  });
  $all('[data-cfg-href]').forEach(function (el) {
    var type = el.getAttribute('data-cfg-href');
    if (type === 'tel') el.href = 'tel:+' + cfg.phoneIntl;
    if (type === 'mail') el.href = 'mailto:' + cfg.email;
  });

  var leader = $('[data-leader]');
  if (leader) {
    if (cfg.showLeader === false) { leader.remove(); }
    else if (cfg.leaderName) { $('[data-cfg="leaderName"]', leader).hidden = false; }
  }
  var nibBox = $('[data-nib]');
  if (nibBox && cfg.showNib && cfg.nib) nibBox.hidden = false;

  var year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  var map = $('#map');
  if (map && cfg.mapQuery) {
    map.src = 'https://www.google.com/maps?q=' + encodeURIComponent(cfg.mapQuery) + '&output=embed';
  }

  // Data terstruktur untuk mesin pencari, dibuat dari config
  var ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: cfg.name,
    image: new URL('assets/img/hero.jpg', location.href).href,
    logo: new URL('assets/img/logo.png', location.href).href,
    telephone: '+' + cfg.phoneIntl,
    email: cfg.email,
    foundingDate: cfg.founded,
    address: { '@type': 'PostalAddress', streetAddress: cfg.address, addressCountry: 'ID' }
  });
  document.head.appendChild(ld);

  /* ---------- Link WhatsApp ---------- */
  function waUrl(text) {
    return 'https://wa.me/' + cfg.phoneIntl + '?text=' + encodeURIComponent(text);
  }
  function updateWaLinks() {
    $all('a[data-wa]').forEach(function (a) {
      a.href = waUrl(i18n.t('wa.greeting'));
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  var form = $('#wa-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var message = form.elements.message.value.trim();
      if (!name || !message) {
        (name ? form.elements.message : form.elements.name).focus();
        return;
      }
      var text = i18n.t('contact.tpl').replace('{name}', name).replace('{message}', message);
      window.open(waUrl(text), '_blank', 'noopener');
    });
  }

  /* ---------- Menu mobile ---------- */
  var menuBtn = $('.menu-btn');
  var nav = $('#nav');
  function closeMenu() {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Armada: tab + galeri + lightbox ---------- */
  var tabs = $('#fleet-tabs');
  var panel = $('#fleet-panel');
  var descEl = $('#fleet-desc');
  var gallery = $('#fleet-gallery');
  var box = $('#lightbox');
  var boxImg = $('img', box);
  var activeId = fleet.length ? fleet[0].id : null;

  function altFor(item) {
    return i18n.t('fleet.photoAlt').replace('{name}', item.label);
  }

  function renderTabs() {
    tabs.innerHTML = '';
    fleet.forEach(function (item) {
      var b = document.createElement('button');
      b.type = 'button';
      b.id = 'tab-' + item.id;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-controls', 'fleet-panel');
      b.setAttribute('aria-selected', item.id === activeId ? 'true' : 'false');
      b.tabIndex = item.id === activeId ? 0 : -1;
      b.textContent = item.label;
      b.dataset.id = item.id;
      tabs.appendChild(b);
    });
  }

  function renderPanel() {
    var item = fleet.filter(function (f) { return f.id === activeId; })[0];
    if (!item) return;
    panel.setAttribute('aria-labelledby', 'tab-' + item.id);
    descEl.textContent = i18n.t('fleet.' + item.id);
    gallery.innerHTML = '';
    gallery.setAttribute('data-count', item.images.length);
    item.images.forEach(function (img) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'shot';
      btn.setAttribute('aria-label', i18n.t('fleet.zoom') + ': ' + item.label);
      var el = document.createElement('img');
      el.src = img.src;
      el.width = img.w;
      el.height = img.h;
      el.loading = 'lazy';
      el.alt = altFor(item);
      btn.appendChild(el);
      btn.addEventListener('click', function () {
        boxImg.src = img.src;
        boxImg.alt = altFor(item);
        if (box.showModal) box.showModal(); else box.setAttribute('open', '');
      });
      gallery.appendChild(btn);
    });
  }

  function select(id, focus) {
    activeId = id;
    $all('[role="tab"]', tabs).forEach(function (b) {
      var on = b.dataset.id === id;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    });
    renderPanel();
  }

  tabs.addEventListener('click', function (e) {
    var b = e.target.closest('[role="tab"]');
    if (b) select(b.dataset.id, false);
  });
  tabs.addEventListener('keydown', function (e) {
    var keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (keys.indexOf(e.key) < 0) return;
    e.preventDefault();
    var ids = fleet.map(function (f) { return f.id; });
    var i = ids.indexOf(activeId);
    var rtl = document.documentElement.dir === 'rtl';
    if (e.key === 'Home') i = 0;
    else if (e.key === 'End') i = ids.length - 1;
    else {
      var step = (e.key === 'ArrowRight') === !rtl ? 1 : -1;
      i = (i + step + ids.length) % ids.length;
    }
    select(ids[i], true);
  });

  box.addEventListener('click', function (e) {
    if (e.target === box || e.target.classList.contains('lb-close')) {
      if (box.close) box.close(); else box.removeAttribute('open');
    }
  });

  /* ---------- Inisialisasi dan ganti bahasa ---------- */
  function refresh() {
    updateWaLinks();
    renderPanel();
  }
  renderTabs();
  refresh();
  i18n.onChange(refresh);
})();
