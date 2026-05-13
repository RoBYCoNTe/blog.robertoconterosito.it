(function () {
  var PREFS = ['auto', 'light', 'dark'];
  var ICONS = { auto: '◑', light: '☀', dark: '🌙' };
  var mq = window.matchMedia('(prefers-color-scheme: dark)');

  function effectiveTheme() {
    var pref = localStorage.getItem('theme') || 'auto';
    if (pref === 'auto') return mq.matches ? 'dark' : 'light';
    return pref;
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', effectiveTheme());
  }

  function updateButton() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var pref = localStorage.getItem('theme') || 'auto';
    btn.textContent = ICONS[pref];
    btn.title = 'Theme: ' + pref;
  }

  function cycle() {
    var current = localStorage.getItem('theme') || 'auto';
    var next = PREFS[(PREFS.indexOf(current) + 1) % PREFS.length];
    if (next === 'auto') localStorage.removeItem('theme');
    else localStorage.setItem('theme', next);
    applyTheme();
    updateButton();
  }

  // React to OS-level theme changes when in auto mode
  mq.addEventListener('change', function () {
    if (!localStorage.getItem('theme')) applyTheme();
  });

  document.addEventListener('DOMContentLoaded', function () {
    updateButton();
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', cycle);
  });
})();
