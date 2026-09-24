/* =============================================================================
 * Activity 5 - dynamic project content
 *
 * Project data lives in one array. A render function turns it into cards and
 * inserts them into #project-grid. Two are shown initially; "Load More" reveals
 * the rest and then removes itself.
 *
 * Materialize binds its card-reveal handler with
 *   $(document).on('click.card', '.card', ...)
 * which is delegated from document, so cards created here get the flip-reveal
 * behaviour for free without re-initialising anything.
 * ========================================================================== */

(function () {
  'use strict';

  /* ---- 1. Project data ------------------------------------------------- */

  var projects = [
    {
      title: 'Simon Says / Whack-a-Mole',
      blurb: 'Bare-metal embedded reaction game on an STM32F446',
      image: '/assets/img/futuristic-wallpaper.jpg',
      alt: 'Embedded reaction game on an STM32 microcontroller',
      tools: 'C, STM32F446, SDIO-DMA, I²S, PWM',
      period: 'Jan – Apr 2025',
      highlights: [
        'Event-driven game with eight capacitive-touch pads and PWM buzzers.',
        '44 kHz I²S WAV playback streaming at ≈500 kB/s from micro-SD over ' +
          'SDIO-DMA, after doubling throughput via clock-divider tuning.',
        'ADC-noise-seeded random-sequence logic and a menu state machine.',
        'Debugged timing with an oscilloscope and logic analyzer.'
      ],
      links: []
    },
    {
      title: 'CodeBreaker Blitz',
      blurb: 'Interactive code-breaking game on the DE1-SoC',
      image: '/assets/img/javascript-coding-wallpaper-1.jpg',
      alt: 'Code-breaking game running on a DE1-SoC board',
      tools: 'C, ARM assembly, DE1-SoC, Cyclone V FPGA',
      period: 'Jan – Apr 2024',
      highlights: [
        "Ran across the board's ARM HPS and FPGA fabric.",
        '640 × 480 VGA pipeline at 60 fps with < 5 ms input latency using ' +
          'double-buffering.'
      ],
      links: []
    },
    {
      title: 'SDR PCB Subsystem',
      blurb: 'Four-layer RF mixer front-end board in Altium',
      image: '/assets/img/minimal-ai-wallpaper.jpg',
      alt: 'Four-layer RF mixer PCB for a software-defined radio',
      tools: 'Altium Designer, schematic capture, DRC',
      period: 'Jan – Apr 2024',
      highlights: [
        'Co-designed a 75 × 45 mm four-layer RF mixer front-end for a ' +
          'student software-defined radio.',
        'Passed 100% DRC and continuity checks on the first spin.'
      ],
      links: []
    },
    {
      title: 'MoonLanders',
      blurb: 'Verilog FPGA game synthesized at 50 MHz',
      image: '/assets/img/ai-wallpaper-1.jpg',
      alt: 'FPGA lunar lander game written in Verilog',
      tools: 'Verilog, Quartus Prime, Cyclone V FPGA',
      period: 'Sep – Dec 2023',
      highlights: [
        '8-state finite-state machine synthesized to 50 MHz.',
        'Integrated VGA timing, PS/2 keyboard input and real-time collision ' +
          'logic for glitch-free gameplay.'
      ],
      links: []
    },
    {
      title: 'Personal Portfolio Site',
      blurb: 'This website: static, no build step, deployed on GitHub Pages',
      image: '/assets/img/eat-sleep-code-repeat-wallpaper.jpg',
      alt: 'This personal portfolio website',
      tools: 'HTML5, CSS3, JavaScript, Materialize, GitHub Pages',
      period: 'Sep 2026',
      highlights: [
        'Built for ECE444 Software Engineering (PRA2, Front End Design).',
        'Continuously deployed: every push to main republishes the site.'
      ],
      links: [
        { href: 'https://sheruberu.github.io', icon: 'fa-external-link', label: 'View Online' },
        {
          href: 'https://github.com/sheruberu/sheruberu.github.io',
          icon: 'fa-github',
          label: 'View Source'
        }
      ]
    }
  ];

  /* ---- 2. Config and element lookups ----------------------------------- */

  var INITIAL_COUNT = 2;

  var grid = document.getElementById('project-grid');
  var loadMoreBtn = document.getElementById('load-more-projects');

  // If the markup this script depends on is missing, do nothing rather than
  // throw and take down the rest of the page's scripts.
  if (!grid || !loadMoreBtn) {
    return;
  }

  var shownCount = 0;

  /* ---- 3. Rendering ---------------------------------------------------- */

  // The data below is authored by hand, but escaping keeps this safe if the
  // array is ever fed from an external source.
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildActions(links) {
    if (!links.length) {
      return '';
    }
    var buttons = links
      .map(function (link) {
        return (
          '<a aria-label="' + escapeHtml(link.label) + '" href="' + escapeHtml(link.href) + '" ' +
          'target="_blank" rel="noopener" data-position="top" ' +
          'data-tooltip="' + escapeHtml(link.label) + '" ' +
          'class="btn-floating btn-large waves-effect waves-light tooltipped">' +
          '<i class="fa ' + escapeHtml(link.icon) + '"></i></a>'
        );
      })
      .join('');
    return '<div class="card-action">' + buttons + '</div>';
  }

  function buildCard(project) {
    var highlights = project.highlights
      .map(function (item) {
        return '<li>' + item + '</li>';
      })
      .join('');

    return (
      '<div class="col s12 m6 l4">' +
        '<div class="card medium">' +
          '<div class="card-image waves-effect waves-block waves-light">' +
            '<img alt="' + escapeHtml(project.alt) + '" src="' + escapeHtml(project.image) + '" ' +
            'style="height: 100%; width: 100%" class="activator" />' +
          '</div>' +
          '<div class="card-content">' +
            '<span class="card-title activator text-accent hoverline">' +
              escapeHtml(project.title) +
              '<i class="mdi-navigation-more-vert right"></i>' +
            '</span>' +
            '<p>' + project.blurb + '</p>' +
          '</div>' +
          '<div class="card-reveal">' +
            '<span class="card-title text-muted"><small>' + escapeHtml(project.title) + '</small>' +
              '<i class="mdi-navigation-close right"></i>' +
            '</span>' +
            '<ul>' +
              '<li><b>Tools:</b> ' + project.tools + '</li>' +
              highlights +
              '<li><b>' + project.period + '</b></li>' +
            '</ul>' +
            buildActions(project.links) +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  /**
   * Append the next `count` projects to the grid, then update the button.
   * Builds one HTML string and assigns once, so the browser reflows a single
   * time instead of once per card.
   */
  function renderProjects(count) {
    var next = projects.slice(shownCount, shownCount + count);
    if (!next.length) {
      return;
    }

    var markup = next.map(buildCard).join('');
    grid.insertAdjacentHTML('beforeend', markup);
    shownCount += next.length;

    updateButton();
  }

  function updateButton() {
    var remaining = projects.length - shownCount;

    if (remaining <= 0) {
      // Requirement 6: hide the button once everything is displayed.
      loadMoreBtn.hidden = true;
      loadMoreBtn.setAttribute('aria-hidden', 'true');
      return;
    }

    loadMoreBtn.textContent = 'Load More (' + remaining + ')';
  }

  /* ---- 4. Wire up ------------------------------------------------------ */

  loadMoreBtn.addEventListener('click', function () {
    // Requirement 5: reveal the remaining projects without reloading the page.
    renderProjects(projects.length - shownCount);
  });

  renderProjects(INITIAL_COUNT);
})();
