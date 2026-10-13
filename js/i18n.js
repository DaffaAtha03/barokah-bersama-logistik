/* Mesin multi bahasa: ID, EN, AR (RTL), ZH.
   Urutan memilih bahasa: ?lang=xx di URL, pilihan tersimpan, bahasa browser, lalu Indonesia. */
(function () {
  'use strict';

  var DEFAULT = 'id';
  var STORE_KEY = 'bbl-lang';
  var META = {
    id: { html: 'id', dir: 'ltr' },
    en: { html: 'en', dir: 'ltr' },
    ar: { html: 'ar', dir: 'rtl' },
    zh: { html: 'zh-Hans', dir: 'ltr' }
  };
  var dict = window.BBL_LANG || {};
  var current = DEFAULT;
  var listeners = [];

  function readStored() {
    try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }
  function writeStored(v) {
    try { localStorage.setItem(STORE_KEY, v); } catch (e) { /* abaikan */ }
  }

  function detect() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q && dict[q]) return q;
    var saved = readStored();
    if (saved && dict[saved]) return saved;
    var prefs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    for (var i = 0; i < prefs.length; i++) {
      var code = String(prefs[i]).toLowerCase().slice(0, 2);
      if (code === 'in') code = 'id';
      if (dict[code]) return code;
    }
    return DEFAULT;
  }

  function t(key) {
    var d = dict[current] || {};
    if (key in d) return d[key];
    var f = dict[DEFAULT] || {};
    return key in f ? f[key] : key;
  }

  function apply() {
    var m = META[current];
    document.documentElement.lang = m.html;
    document.documentElement.dir = m.dir;
    document.title = t('meta.title');

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var i = pair.indexOf(':');
        el.setAttribute(pair.slice(0, i), t(pair.slice(i + 1)));
      });
    });
    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === current ? 'true' : 'false');
    });
    listeners.forEach(function (fn) { fn(current); });
  }

  function set(code) {
    if (!dict[code]) return;
    current = code;
    writeStored(code);
    apply();
  }

  window.BBL_I18N = {
    t: t,
    get lang() { return current; },
    set: set,
    onChange: function (fn) { listeners.push(fn); }
  };

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-lang]');
    if (btn) set(btn.getAttribute('data-lang'));
  });

  current = detect();
  apply();
})();
