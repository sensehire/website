/* SenseHire — demo/contact form: lightweight validation + success state.
   No backend: this is a front-end demo capture with a confirmation state. */
(function () {
  'use strict';

  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function init() {
    var form = document.querySelector('[data-demo-form]');
    if (!form) return;
    var success = document.querySelector('[data-form-success]');
    var live = document.querySelector('[data-form-live]');

    // Wire each field's error span to its input for screen readers.
    form.querySelectorAll('.field').forEach(function (wrap) {
      var input = wrap.querySelector('input, select, textarea');
      var err = wrap.querySelector('.err-msg');
      if (input && err) {
        if (!err.id) err.id = 'err-' + (input.id || input.name || Math.floor(Math.random() * 1e6));
        input.setAttribute('aria-describedby', err.id);
      }
    });

    function setError(field, on) {
      var wrap = field.closest('.field');
      if (wrap) wrap.classList.toggle('error', on);
      field.setAttribute('aria-invalid', String(on));
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var firstInvalid = null;

      form.querySelectorAll('[required]').forEach(function (field) {
        var val = (field.value || '').trim();
        var ok = val.length > 0;
        if (ok && field.type === 'email') ok = isEmail(val);
        setError(field, !ok);
        if (!ok) { valid = false; if (!firstInvalid) firstInvalid = field; }
      });

      if (!valid) {
        var count = form.querySelectorAll('.field.error').length;
        if (live) live.textContent = count + (count === 1 ? ' field needs' : ' fields need') + ' attention. Please review the highlighted inputs.';
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      if (live) live.textContent = '';

      // Simulate async submission, then show confirmation.
      var btn = form.querySelector('[type="submit"]');
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Sending…'; }

      window.setTimeout(function () {
        if (success) {
          var name = (form.querySelector('[name="firstName"]') || {}).value || '';
          var nameSlot = success.querySelector('[data-success-name]');
          if (nameSlot && name) nameSlot.textContent = name.trim().split(' ')[0];
          form.style.display = 'none';
          success.classList.add('show');
          success.setAttribute('tabindex', '-1');
          success.focus();
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 700);
    });

    // Clear error as the user fixes a field.
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () { setError(field, false); });
    });

    var resetBtn = document.querySelector('[data-form-reset]');
    if (resetBtn && success) {
      resetBtn.addEventListener('click', function () {
        success.classList.remove('show');
        form.reset();
        form.style.display = '';
        var btn = form.querySelector('[type="submit"]');
        if (btn) { btn.disabled = false; if (btn.dataset.label) btn.textContent = btn.dataset.label; }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
