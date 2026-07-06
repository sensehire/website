/* SenseHire — UI behaviors: pricing toggle, accessible tab groups, grouped FAQ,
   pointer-tracked card spotlight, ROI calculator. */
(function () {
  'use strict';

  /* ---- Pricing monthly/yearly toggle ---- */
  function initPricing() {
    var sw = document.querySelector('[data-billing-switch]');
    if (!sw) return;
    var labMonthly = document.querySelector('[data-bill-monthly]');
    var labYearly = document.querySelector('[data-bill-yearly]');

    function setYearly(yearly) {
      sw.setAttribute('aria-checked', String(yearly));
      if (labMonthly) labMonthly.classList.toggle('on', !yearly);
      if (labYearly) labYearly.classList.toggle('on', yearly);
      document.querySelectorAll('[data-price]').forEach(function (el) {
        var v = yearly ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly');
        if (v !== null) el.textContent = v;
      });
      document.querySelectorAll('[data-per]').forEach(function (el) {
        el.textContent = yearly ? '/mo billed annually' : '/mo';
      });
    }
    sw.addEventListener('click', function () {
      setYearly(sw.getAttribute('aria-checked') !== 'true');
    });
    sw.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setYearly(sw.getAttribute('aria-checked') !== 'true'); }
    });
    setYearly(false);
  }

  /* ---- Accessible tab groups (use cases, FAQ groups, hero preview) ----
     Adds tablist/tab/tabpanel roles, aria-controls/labelledby wiring,
     roving tabindex, and arrow-key navigation. */
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(function (group) {
      var btns = Array.prototype.slice.call(group.querySelectorAll('[data-tab]'));
      var scope = group.getAttribute('data-tabs');
      var panels = Array.prototype.slice.call(document.querySelectorAll('[data-tab-panel="' + scope + '"]'));
      if (!btns.length || !panels.length) return;

      group.setAttribute('role', 'tablist');
      btns.forEach(function (btn) {
        var key = btn.getAttribute('data-tab');
        if (!btn.id) btn.id = 'tab-' + scope + '-' + key;
        btn.setAttribute('role', 'tab');
        btn.setAttribute('tabindex', btn.classList.contains('active') ? '0' : '-1');
        var panel = panels.filter(function (p) { return p.getAttribute('data-key') === key; })[0];
        if (panel) {
          if (!panel.id) panel.id = 'panel-' + scope + '-' + key;
          panel.setAttribute('role', 'tabpanel');
          panel.setAttribute('aria-labelledby', btn.id);
          btn.setAttribute('aria-controls', panel.id);
        }
      });

      function activate(btn, focus) {
        var key = btn.getAttribute('data-tab');
        btns.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('active', on);
          b.setAttribute('aria-selected', String(on));
          b.setAttribute('tabindex', on ? '0' : '-1');
        });
        panels.forEach(function (p) {
          p.classList.toggle('active', p.getAttribute('data-key') === key);
        });
        if (focus) btn.focus();
      }

      btns.forEach(function (btn, i) {
        btn.addEventListener('click', function () { activate(btn, false); });
        btn.addEventListener('keydown', function (e) {
          var idx = btns.indexOf(document.activeElement);
          if (idx < 0) idx = i;
          var next = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = btns[(idx + 1) % btns.length];
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = btns[(idx - 1 + btns.length) % btns.length];
          else if (e.key === 'Home') next = btns[0];
          else if (e.key === 'End') next = btns[btns.length - 1];
          if (next) { e.preventDefault(); activate(next, true); }
        });
      });
    });
  }

  /* ---- FAQ: only one open at a time within a list ---- */
  function initFaq() {
    document.querySelectorAll('[data-faq-list]').forEach(function (list) {
      var items = list.querySelectorAll('details.faq-item');
      items.forEach(function (item) {
        item.addEventListener('toggle', function () {
          if (item.open) {
            items.forEach(function (other) { if (other !== item) other.open = false; });
          }
        });
      });
    });
  }

  /* ---- Pointer-tracked spotlight on cards (hover-capable devices only) ---- */
  function initSpotlight() {
    if (!window.matchMedia) return;
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;
    document.body.classList.add('spotlight-on');
    var pending = false;
    var lastEvent = null;
    document.addEventListener('pointermove', function (e) {
      lastEvent = e;
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        var t = lastEvent.target;
        var card = t && t.closest ? t.closest('.card') : null;
        if (!card) return;
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (lastEvent.clientX - r.left) + 'px');
        card.style.setProperty('--my', (lastEvent.clientY - r.top) + 'px');
      });
    }, { passive: true });
  }

  /* ---- ROI calculator (pricing.html #calculator) ----
     Illustrative model, stated on-page: AI screening removes ~90% of manual
     screening hours; savings = hours removed x blended hourly cost. */
  function initCalculator() {
    var calc = document.querySelector('[data-calc]');
    if (!calc) return;
    var hires = calc.querySelector('#calcHires');
    var hours = calc.querySelector('#calcHours');
    var rate = calc.querySelector('#calcRate');
    if (!hires || !hours || !rate) return;
    var outHours = calc.querySelector('[data-out-hours]');
    var outCost = calc.querySelector('[data-out-cost]');
    var outFte = calc.querySelector('[data-out-fte]');

    function fmt(n) {
      return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    function paintSlider(el) {
      var min = parseFloat(el.min), max = parseFloat(el.max), v = parseFloat(el.value);
      el.style.setProperty('--fill', (((v - min) / (max - min)) * 100) + '%');
      var badge = calc.querySelector('[data-val="' + el.id + '"]');
      if (badge) {
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        badge.textContent = prefix + fmt(v) + suffix;
      }
      el.setAttribute('aria-valuetext', (el.getAttribute('data-prefix') || '') + fmt(v) + (el.getAttribute('data-suffix') || ''));
    }
    function update() {
      [hires, hours, rate].forEach(paintSlider);
      var h = parseFloat(hires.value);
      var s = parseFloat(hours.value);
      var r = parseFloat(rate.value);
      var hoursSaved = h * s * 0.9;         // ~90% of screening hours removed (illustrative)
      var costSaved = hoursSaved * r;
      var fte = hoursSaved / 1800;          // ~1800 productive hours per recruiter-year
      if (outHours) outHours.textContent = fmt(hoursSaved) + ' hrs';
      if (outCost) outCost.textContent = '$' + fmt(costSaved);
      if (outFte) outFte.textContent = (fte < 0.1 ? '<0.1' : fte.toFixed(1)) + ' FTE';
    }
    [hires, hours, rate].forEach(function (el) {
      el.addEventListener('input', update);
    });
    update();
  }

  function init() {
    initPricing();
    initTabs();
    initFaq();
    initSpotlight();
    initCalculator();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
