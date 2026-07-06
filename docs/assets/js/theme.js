/* SenseHire — theme toggle + persistence.
   The no-FOUC pre-paint application lives inline in each page <head>;
   this file wires up the toggle buttons and keeps state in sync. */
(function () {
  'use strict';
  var KEY = 'sensehire-site-theme';

  function current() {
    return document.documentElement.classList.contains('light') ? 'light' : 'dark';
  }

  function apply(theme) {
    var root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    try { localStorage.setItem(KEY, theme); } catch (e) { /* storage blocked */ }
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(theme === 'light'));
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    });
  }

  function toggle() { apply(current() === 'light' ? 'dark' : 'light'); }

  function init() {
    apply(current());
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', toggle);
    });
    // Respond to OS theme changes only when the user has not set a preference.
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: light)');
      var onChange = function (e) {
        var stored;
        try { stored = localStorage.getItem(KEY); } catch (err) { stored = null; }
        if (!stored) apply(e.matches ? 'light' : 'dark');
      };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
