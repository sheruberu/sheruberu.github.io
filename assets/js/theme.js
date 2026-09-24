/* =============================================================================
 * Activity 6 - light / dark colour theme switching
 *
 * Adapted from the theme system in the shadcn/ui admin dashboard I build at
 * work (src/context/theme-context.tsx, src/components/theme-switch.tsx),
 * rewritten from React to vanilla JS and simplified to two states.
 *
 * The theme class is applied to <html> by a small inline script in <head>
 * before this file loads, so the correct theme is painted on the first frame
 * and there is no flash of the wrong colours.
 * ========================================================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'portfolio-theme';
  var LABELS = { light: 'Light', dark: 'Dark' };
  var META_COLOR = { light: '#ffffff', dark: '#020817' };

  var root = document.documentElement;
  var buttons = document.querySelectorAll('.js-theme-toggle');

  if (!buttons.length) {
    return;
  }

  /** Reading localStorage throws in some privacy modes, so never let it break
   *  the page. With nothing stored, take the OS preference as the starting
   *  point; after that the visitor's explicit choice always wins. */
  function readTheme() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch (err) {
      /* fall through to the OS preference */
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function writeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (err) {
      /* Storage unavailable; the theme still applies for this page view. */
    }
  }

  function updateMetaThemeColor(theme) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', META_COLOR[theme]);
    }
  }

  function updateButtons(theme) {
    var next = theme === 'dark' ? 'light' : 'dark';
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      var label = btn.querySelector('.theme-toggle-label');
      if (label) {
        label.textContent = LABELS[theme];
      }
      btn.setAttribute('aria-label', 'Switch to ' + LABELS[next] + ' theme');
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
  }

  function apply(theme) {
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    updateMetaThemeColor(theme);
    updateButtons(theme);
  }

  /** Colour transitions are enabled only for the duration of a switch, so the
   *  first paint is never animated and the toggle still feels deliberate. */
  var transitionTimer = null;
  function withTransition(fn) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fn();
      return;
    }

    root.classList.add('theme-transition');
    fn();

    window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(function () {
      root.classList.remove('theme-transition');
    }, 400);
  }

  var current = readTheme();
  apply(current);

  function toggle() {
    current = current === 'dark' ? 'light' : 'dark';
    writeTheme(current);
    withTransition(function () {
      apply(current);
    });
  }

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', toggle);
  }

  // Exposed so the behaviour can be driven in tests.
  window.__theme = {
    get current() {
      return current;
    },
    toggle: toggle,
    apply: apply
  };
})();
