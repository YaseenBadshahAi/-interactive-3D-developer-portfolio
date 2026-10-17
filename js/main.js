/* ============================================================
   MAIN — nav, projects, modal, reveals, contact form
   ============================================================ */
(function () {
  'use strict';

  var CFG = window.PORTFOLIO_CONFIG || {};
  var PROJECTS = window.PROJECTS || [];
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- apply central config ---------- */
  function applyConfig() {
    if (CFG.name) {
      document.title = CFG.name + " — Frontend Developer | Interactive Web Experiences";
      var logoText = document.querySelector('.logo-text');
      if (logoText) logoText.textContent = CFG.name;
      var logo = document.querySelector('.logo');
      if (logo) logo.setAttribute('aria-label', CFG.name + " — home");
      var fn = document.getElementById('footer-name');
      if (fn) fn.textContent = CFG.name;
    }
    if (CFG.initials) {
      var mark = document.querySelector('.logo-mark');
      if (mark) mark.textContent = CFG.initials;
      var portrait = document.querySelector('.portrait span');
      if (portrait) portrait.textContent = CFG.initials;
    }
    if (CFG.email) {
      var le = document.getElementById('link-email');
      if (le) { le.href = "mailto:" + CFG.email; le.textContent = CFG.email; }
    }
    if (CFG.github) {
      var gh = document.getElementById('link-github');
      if (gh) gh.href = CFG.github;
    }
    if (CFG.linkedin) {
      var li = document.getElementById('link-linkedin');
      if (li) li.href = CFG.linkedin;
    }
    if (CFG.availability && CFG.availability.enabled) {
      var av = document.getElementById('availability');
      var avt = document.getElementById('availability-text');
      if (av && avt) { avt.textContent = CFG.availability.text; av.hidden = false; }
    }
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ---------- mobile nav ---------- */
  function initNav() {
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var open = menu.hidden;
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // active link highlighting
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
    var sections = links.map(function (l) { return document.querySelector(l.getAttribute('href')); })
      .filter(Boolean);
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            links.forEach(function (l) {
              l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id);
            });
          }
        });
      }, { rootMargin: '-40% 0px -55% 0px' });
      sections.forEach(function (s) { obs.observe(s); });
    }
  }

  /* ---------- project cards ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderProjects() {
    var grid = document.getElementById('project-grid');
    if (!grid) return;
    grid.innerHTML = PROJECTS.map(function (p) {
      return '' +
        '<button class="project-card reveal" data-project="' + esc(p.id) + '" aria-haspopup="dialog">' +
          '<span class="browser" aria-hidden="true">' +
            '<span class="browser-bar"><span class="dots"><i></i><i></i><i></i></span>' +
            '<span class="url-pill">' + esc(p.url) + '</span></span>' +
            '<span class="mock-screen"><span class="mock ' + esc(p.theme) + '">' +
              '<span class="mock-nav"><span class="mock-logo"></span><span class="mock-links"><i></i><i></i><i></i></span></span>' +
              '<span class="mock-hero"><span class="mock-title"></span><span class="mock-sub"></span>' +
              '<span class="mock-cta-row"><span class="mock-cta"></span><span class="mock-cta ghost"></span></span></span>' +
              '<span class="mock-cards"><i></i><i></i><i></i></span>' +
            '</span></span>' +
          '</span>' +
          '<span class="project-body">' +
            '<span class="project-tags"><span class="tag">' + esc(p.category) + '</span>' +
            (p.isExample ? '<span class="example-badge">Example</span>' : '') + '</span>' +
            '<h3>' + esc(p.title) + '</h3>' +
            '<p>' + esc(p.summary) + '</p>' +
            '<span class="project-link-hint">View case study →</span>' +
          '</span>' +
        '</button>';
    }).join('');

    grid.querySelectorAll('.project-card').forEach(function (card) {
      card.addEventListener('click', function () { openModal(card.dataset.project); });
      initTilt(card);
    });
  }

  /* subtle 3D tilt on hover (pointer devices only, no reduced motion) */
  function initTilt(card) {
    if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'perspective(900px) rotateY(' + (x * 7).toFixed(2) + 'deg) rotateX(' + (-y * 7).toFixed(2) + 'deg) translateY(-4px)';
    });
    card.addEventListener('pointerleave', function () { card.style.transform = ''; });
  }

  /* ---------- project modal ---------- */
  var lastFocus = null;
  function openModal(id) {
    var p = PROJECTS.find(function (x) { return x.id === id; });
    if (!p) return;
    lastFocus = document.activeElement;

    var body = document.getElementById('modal-body');
    body.innerHTML =
      '<div class="project-tags"><span class="tag">' + esc(p.category) + '</span>' +
      (p.isExample ? '<span class="example-badge">Example project — replace with real work</span>' : '') + '</div>' +
      '<h2 id="modal-title">' + esc(p.title) + '</h2>' +
      '<p>' + esc(p.summary) + '</p>' +
      '<p class="case-label">The problem</p><p>' + esc(p.problem) + '</p>' +
      '<p class="case-label">My role</p><p>' + esc(p.role) + '</p>' +
      '<p class="case-label">The solution</p><p>' + esc(p.solution) + '</p>' +
      '<p class="case-label">Key features</p><ul>' +
        p.features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') +
      '</ul>' +
      '<p class="case-label">Stack</p><p>' + p.tech.map(esc).join(' · ') + '</p>' +
      (p.result ? '<p class="case-label">Result</p><p><span class="result-stat">' + esc(p.result.stat) + ' <small style="font-weight:400">' + esc(p.result.label) + '</small></span></p>' : '') +
      '<div class="modal-links">' +
        (p.liveUrl && p.liveUrl !== '#' ? '<a class="btn btn-primary" href="' + esc(p.liveUrl) + '" target="_blank" rel="noopener">Live Website</a>' : '') +
        (p.sourceUrl && p.sourceUrl !== '#' ? '<a class="btn btn-ghost" href="' + esc(p.sourceUrl) + '" target="_blank" rel="noopener">Source Code</a>' : '') +
        '<a class="btn btn-ghost" href="#contact" id="modal-cta">Start a Similar Project</a>' +
      '</div>';

    var backdrop = document.getElementById('modal-backdrop');
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';

    var cta = document.getElementById('modal-cta');
    if (cta) cta.addEventListener('click', closeModal);

    document.getElementById('modal-close').focus();
  }

  function closeModal() {
    document.getElementById('modal-backdrop').hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function initModal() {
    var backdrop = document.getElementById('modal-backdrop');
    document.getElementById('modal-close').addEventListener('click', closeModal);
    backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closeModal(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !backdrop.hidden) closeModal();
      // simple focus trap
      if (e.key === 'Tab' && !backdrop.hidden) {
        var modal = document.getElementById('modal');
        var f = modal.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        f = Array.prototype.filter.call(f, function (el) { return !el.disabled && el.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- scroll reveals ---------- */
  function initReveals() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (!reduceMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      els.forEach(function (el) {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onStart: function () { el.classList.add('is-visible'); }
        });
      });
      // hero entrance
      gsap.from('.hero-title .line', { opacity: 0, y: 46, duration: 1.1, stagger: 0.14, ease: 'power3.out', delay: 0.15 });
      gsap.from('.hero-sub, .hero-ctas, .availability', { opacity: 0, y: 24, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: 0.55 });
      return;
    }
    // fallback: IntersectionObserver (also the reduced-motion path via CSS)
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      els.forEach(function (el) { obs.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* ---------- contact form ---------- */
  function setError(input, errEl, message) {
    if (message) { errEl.textContent = message; errEl.hidden = false; input.setAttribute('aria-invalid', 'true'); }
    else { errEl.hidden = true; input.removeAttribute('aria-invalid'); }
  }

  function validateField(input) {
    var err = document.getElementById('err-' + input.id.replace('f-', ''));
    if (!err) return true;
    var v = input.value.trim();
    var ok = true, msg = '';
    if (input.required && !v) { ok = false; }
    else if (input.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { ok = false; msg = 'Please enter a valid email address.'; }
    else if (input.minLength > 0 && v && v.length < input.minLength) { ok = false; }
    if (!ok && !msg) msg = err.dataset.default || 'This field is required.';
    setError(input, err, ok ? '' : msg);
    return ok;
  }

  function initForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var submit = document.getElementById('form-submit');
    var label = submit.querySelector('.btn-label');
    var spinner = submit.querySelector('.spinner');
    var status = document.getElementById('form-status');

    // stash default messages
    form.querySelectorAll('.field-error').forEach(function (e) { e.dataset.default = e.textContent; });

    ['f-name', 'f-email', 'f-type', 'f-details'].forEach(function (id) {
      var input = document.getElementById(id);
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        var err = document.getElementById('err-' + id.replace('f-', ''));
        if (err && !err.hidden) validateField(input);
      });
    });

    function showStatus(type, message) {
      status.className = 'form-status ' + type;
      status.textContent = message;
      status.hidden = false;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = ['f-name', 'f-email', 'f-type', 'f-details'].map(function (id) { return document.getElementById(id); });
      var valid = fields.map(validateField).every(Boolean);
      if (!valid) {
        var firstBad = document.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      var endpoint = (CFG.formEndpoint || '').trim();
      if (!endpoint) {
        // Honest: no endpoint configured — never fake a success.
        showStatus('error', 'This form is not connected yet. Please email me directly at ' + (CFG.email || 'the address above') + ' and I will reply within one business day.');
        return;
      }

      submit.disabled = true;
      label.textContent = 'Sending…';
      spinner.hidden = false;
      status.hidden = true;

      var payload = {
        name: document.getElementById('f-name').value.trim(),
        email: document.getElementById('f-email').value.trim(),
        projectType: document.getElementById('f-type').value,
        budget: document.getElementById('f-budget').value,
        details: document.getElementById('f-details').value.trim(),
        page: location.href
      };

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (res) {
        if (!res.ok) throw new Error('Server responded with ' + res.status);
        return res.json().catch(function () { return {}; });
      }).then(function () {
        showStatus('success', 'Message sent — thank you! I will get back to you within one business day.');
        form.reset();
      }).catch(function () {
        showStatus('error', 'Something went wrong sending your message. Please email me directly at ' + (CFG.email || 'the address above') + '.');
      }).finally(function () {
        submit.disabled = false;
        label.textContent = 'Send Message';
        spinner.hidden = true;
      });
    });
  }

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    applyConfig();
    initNav();
    renderProjects();
    initModal();
    initReveals();
    initForm();
  });
})();
