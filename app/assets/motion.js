/**
 * Motion adapter — CSS + View Transitions API today.
 * Phase 2+: swap implementations here (e.g. Motion One) without touching views.
 */

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const motion = {
  /** Run a DOM update inside a view transition when supported. */
  async viewTransition(updateDom) {
    if (prefersReducedMotion() || !document.startViewTransition) {
      updateDom();
      return;
    }
    await document.startViewTransition(updateDom).finished;
  },

  /** Lightbox enter — add class; override in phase 2 for spring animations. */
  openLightbox(dialog) {
    if (!dialog.open) {
      dialog.showModal();
    }
    dialog.classList.add('is-open');
  },

  /** Lightbox exit */
  closeLightbox(dialog) {
    dialog.classList.remove('is-open');
    dialog.close();
  },

  /** Stagger hook for lists — currently instant; pass selector + index later. */
  staggerItem(_element, _index) {
    // Phase 2: motion.animate(element, { opacity: [0, 1], y: [8, 0] }, { delay: index * 0.04 })
  },

  /** Flash saved state on a button */
  pulseSaved(element) {
    element.classList.add('is-saved');
    window.setTimeout(() => element.classList.remove('is-saved'), 1600);
  },
};
