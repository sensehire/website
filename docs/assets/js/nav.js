/* SenseHire — sticky header shadow, mobile menu drawer (focus-trapped),
   active nav link, and mobile sticky CTA bar. */
(function () {
  'use strict';

  function init() {
    var header = document.querySelector('[data-header]');
    var menuBtn = document.querySelector('[data-menu-btn]');
    var menu = document.querySelector('[data-mobile-menu]');

    // Sticky header style after a little scroll.
    if (header) {
      var onScroll = function () {
        if (window.scrollY > 12) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Mobile drawer with focus trap + focus return.
    if (menuBtn && menu) {
      var lastFocused = null;
      var setOpen = function (open) {
        menu.classList.toggle('open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) {
          lastFocused = document.activeElement;
          var first = menu.querySelector('a, button');
          if (first) first.focus();
        } else if (lastFocused && lastFocused.focus) {
          lastFocused.focus();
        }
      };
      menuBtn.addEventListener('click', function () {
        setOpen(!menu.classList.contains('open'));
      });
      menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { setOpen(false); });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('open')) setOpen(false);
      });
      // Keep Tab cycling inside the open drawer.
      menu.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab' || !menu.classList.contains('open')) return;
        var focusables = menu.querySelectorAll('a, button');
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
    }

    // Mark the active nav link based on the current path.
    var path = (location.pathname.split('/').pop() || 'index.html');
    if (path === '') path = 'index.html';
    document.querySelectorAll('[data-nav-link]').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('#')[0];
      if (href === path) a.classList.add('active');
    });

    // Mobile sticky CTA bar: show after ~70% viewport of scroll, hide near footer.
    var bar = document.querySelector('[data-sticky-cta]');
    if (bar) {
      var nearFooter = false;
      var updateBar = function () {
        var show = window.scrollY > window.innerHeight * 0.7 && !nearFooter;
        bar.classList.toggle('visible', show);
      };
      var footer = document.querySelector('.site-footer');
      if (footer && 'IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          nearFooter = entries[0].isIntersecting;
          updateBar();
        }, { rootMargin: '0px 0px 60px 0px' }).observe(footer);
      }
      window.addEventListener('scroll', updateBar, { passive: true });
      updateBar();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
