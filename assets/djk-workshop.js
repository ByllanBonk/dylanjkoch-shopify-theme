(() => {
  if (window.djkWorkshopInitialized) return;
  window.djkWorkshopInitialized = true;
  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-workshop-scroll]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  });
  document.addEventListener('submit', (event) => {
    const form = event.target.closest('.djk-workshop__form');
    if (!form) return;
    const workshop = form.closest('[data-workshop]');
    if (workshop.dataset.submitting === 'true') {
      event.preventDefault();
      return;
    }
    workshop.dataset.submitting = 'true';
    workshop.querySelectorAll('.djk-workshop__form button').forEach((button) => button.setAttribute('aria-disabled', 'true'));
    const status = workshop.querySelector('[data-workshop-status]');
    status.textContent = status.dataset.pending;
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      window.location.reload();
      return;
    }
    document.querySelectorAll('[data-workshop]').forEach((workshop) => {
      delete workshop.dataset.submitting;
      workshop.querySelectorAll('.djk-workshop__form button').forEach((button) => button.removeAttribute('aria-disabled'));
      workshop.querySelector('[data-workshop-status]').textContent = '';
    });
  });
})();
