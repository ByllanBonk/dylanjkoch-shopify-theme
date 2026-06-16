/* Dylan J Koch theme behavior: scroll reveals and stat counters. */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealAll() {
    document.querySelectorAll('.djk-reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  function initReveals() {
    var elements = document.querySelectorAll('.djk-reveal');
    if (!elements.length) return;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  function animateCounter(el) {
    var raw = el.getAttribute('data-djk-count');
    var target = parseFloat(raw);
    if (isNaN(target)) return;

    var prefix = el.getAttribute('data-djk-prefix') || '';
    var suffix = el.getAttribute('data-djk-suffix') || '';
    var duration = 1400;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      el.textContent = prefix + value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll('[data-djk-count]');
    if (!counters.length) return;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        var prefix = el.getAttribute('data-djk-prefix') || '';
        var suffix = el.getAttribute('data-djk-suffix') || '';
        var target = parseFloat(el.getAttribute('data-djk-count'));
        if (!isNaN(target)) el.textContent = prefix + target.toLocaleString() + suffix;
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  // Open only one accordion at a time within a group marked data-djk-single.
  function initAccordions() {
    document.querySelectorAll('[data-djk-single]').forEach(function (group) {
      group.addEventListener('toggle', function (event) {
        var opened = event.target;
        if (!(opened instanceof HTMLDetailsElement) || !opened.open) return;
        group.querySelectorAll('details[open]').forEach(function (other) {
          if (other !== opened) other.open = false;
        });
      }, true);
    });
  }

  // Klaviyo expects E.164 phone numbers. North American numbers without a
  // country code get +1; anything else keeps its own country code.
  function normalizePhone(raw) {
    if (!raw) return '';
    var trimmed = raw.trim();
    var digits = trimmed.replace(/\D/g, '');
    if (!digits) return '';
    if (trimmed.charAt(0) === '+') return '+' + digits;
    if (digits.length === 10) return '+1' + digits;
    if (digits.length === 11 && digits.charAt(0) === '1') return '+' + digits;
    return '+' + digits;
  }

  // Basic client-side email check so we never fire a request for an
  // obviously invalid address.
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function klaviyoPayload(form, includePhone) {
    var attrs = { email: form.querySelector('input[type="email"]').value.trim() };

    var name = form.querySelector('input[name="first_name"]');
    if (name && name.value.trim()) attrs.first_name = name.value.trim();

    var lastName = form.querySelector('input[name="last_name"]');
    if (lastName && lastName.value.trim()) attrs.last_name = lastName.value.trim();

    var subscriptions = { email: { marketing: { consent: 'SUBSCRIBED' } } };

    if (includePhone) {
      var phoneEl = form.querySelector('input[type="tel"]');
      var phone = phoneEl ? normalizePhone(phoneEl.value) : '';
      var consent = form.querySelector('input[name="djk_consent"]');
      if (phone) {
        attrs.phone_number = phone;
        // The consent checkbox text covers SMS; only subscribe to texts
        // when it is present and checked.
        if (consent && consent.checked) {
          subscriptions.sms = { marketing: { consent: 'SUBSCRIBED' } };
        }
      }
    }

    attrs.subscriptions = subscriptions;

    return {
      data: {
        type: 'subscription',
        attributes: {
          custom_source: form.getAttribute('data-source') || 'website',
          profile: { data: { type: 'profile', attributes: attrs } }
        },
        relationships: {
          list: { data: { type: 'list', id: form.getAttribute('data-list') } }
        }
      }
    };
  }

  function postToKlaviyo(form, includePhone) {
    var url =
      'https://a.klaviyo.com/client/subscriptions/?company_id=' +
      encodeURIComponent(form.getAttribute('data-company'));
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', revision: '2024-10-15' },
      body: JSON.stringify(klaviyoPayload(form, includePhone))
    });
  }

  // Direct-to-Klaviyo capture forms. Marked with data-djk-klaviyo by
  // snippets/djk-capture-fields.liquid and snippets/djk-newsletter-form.liquid.
  function initKlaviyoForms() {
    document.querySelectorAll('form[data-djk-klaviyo]').forEach(function (form) {
      if (form.dataset.djkBound) return;
      form.dataset.djkBound = 'true';

      form.addEventListener('submit', function (event) {
        event.preventDefault();

        var button = form.querySelector('button[type="submit"]');
        var error = form.querySelector('[data-djk-error]');
        if (error) error.hidden = true;

        // Validate the email client-side before sending anything to Klaviyo.
        var emailEl = form.querySelector('input[type="email"]');
        if (!emailEl || !isValidEmail(emailEl.value.trim())) {
          if (error) error.hidden = false;
          if (emailEl) emailEl.focus();
          return;
        }

        if (button) button.disabled = true;

        var hasPhone = !!form.querySelector('input[type="tel"]');

        postToKlaviyo(form, true)
          .then(function (response) {
            // An invalid phone number rejects the whole request. Retry
            // email-only so the lead is never lost.
            if (!response.ok && hasPhone) return postToKlaviyo(form, false);
            return response;
          })
          .then(function (response) {
            if (!response.ok) throw new Error('klaviyo ' + response.status);
            var template = form.querySelector('template[data-djk-success]');
            if (template) {
              form.innerHTML = '';
              form.appendChild(template.content.cloneNode(true));
              var status = form.querySelector('.djk-form-success');
              if (status) status.focus();
            }
          })
          .catch(function () {
            if (button) button.disabled = false;
            if (error) error.hidden = false;
          });
      });
    });
  }

  function init() {
    initReveals();
    initCounters();
    initAccordions();
    initKlaviyoForms();

    // Re-run reveals when the merchant edits sections in the theme customizer.
    document.addEventListener('shopify:section:load', function () {
      initReveals();
      initCounters();
      initAccordions();
      initKlaviyoForms();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
