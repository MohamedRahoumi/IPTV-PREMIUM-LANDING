import translations from './translations.js';

const STORAGE_KEY = 'iptv-lang';

function getSavedLang() {
  try { return localStorage.getItem(STORAGE_KEY) || 'en'; }
  catch { return 'en'; }
}

function saveLang(lang) {
  try { localStorage.setItem(STORAGE_KEY, lang); }
  catch {}
}

function t(key, lang) {
  const entry = translations[key];
  if (!entry) return null;
  return entry[lang] || entry['en'] || null;
}

function applyLanguage(lang) {
  document.documentElement.setAttribute('lang', lang);
  if (lang === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.removeAttribute('dir');
  }

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const text = t(key, lang);
    if (text === null) return;

      const resolved = text.replace(/\{year\}/g, String(new Date().getFullYear()));
      if (el.hasAttribute('data-i18n-price')) {
        const price = el.getAttribute('data-i18n-price');
        el.textContent = resolved + price;
      } else if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = resolved;
      } else {
        el.textContent = resolved;
      }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    const text = t(key, lang);
    if (text !== null) el.setAttribute('placeholder', text);
  });

  const currentBtn = document.getElementById('langBtn');
  if (currentBtn) {
    const langNames = { en: 'EN', fr: 'FR', ar: 'AR' };
    const textNode = currentBtn.childNodes[2];
    if (textNode) textNode.textContent = langNames[lang] || 'EN';
  }

  document.querySelectorAll('.lang-check').forEach((el) => {
    const parent = el.closest('.lang-option');
    const optLang = parent?.getAttribute('data-lang');
    if (parent) {
      el.style.display = optLang === lang ? '' : 'none';
    }
  });
}

export function setLanguage(lang) {
  saveLang(lang);
  applyLanguage(lang);
  document.querySelector('.lang-dropdown')?.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = getSavedLang();
  applyLanguage(saved);

  document.querySelectorAll('.lang-option').forEach((opt) => {
    opt.addEventListener('click', function (e) {
      e.preventDefault();
      const lang = this.getAttribute('data-lang');
      if (lang) setLanguage(lang);
    });
  });
});
