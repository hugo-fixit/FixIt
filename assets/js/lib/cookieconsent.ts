/**
 * Cookie Consent integration for FixIt.
 *
 * Responsibilities:
 * - Initialize the cookie consent banner with configured settings.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.config.cookieconsent && window.cookieconsent)
    window.cookieconsent.initialise(window.config.cookieconsent)
}, false)
