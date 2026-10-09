// Internationalization class for Level Browser
// Handles loading and retrieving translated strings

import en from "./en.js";
import fr from "./fr.js";
import es from "./es.js";
import ger from "./ger.js";
import ptbr from "./ptbr.js";
import zh from "./zh.js";
import ar from "./ar.js";

/**
 * Get the current language code
 * @returns {string} Language code (e.g., "en", "fr", "es", "ger", "ptbr")
 */
export function getCurrentLanguage() {
  let runtime = globalThis?._levelBrowserScope?.runtime;
  if (runtime) {
    const save = runtime.objects.save.getFirstInstance();
    if (save) {
      return save.getJsonDataCopy()?.settings?.language || "en";
    }
  }
  return "en";
}

/**
 * Available language packs
 * Add new languages here as they are created
 */
const languagePacks = {
  en,
  fr,
  es,
  ger,
  ptbr,
  zh,
  ar,
};

export class I18n {
  /**
   * @param {string} [languageCode] - Language code to use (defaults to getCurrentLanguage())
   */
  constructor(languageCode) {
    this.languageCode = languageCode || getCurrentLanguage() || "en";
    this.strings = this.loadLanguage(this.languageCode);
  }

  /**
   * Load a language pack
   * @param {string} code - Language code
   * @returns {Object} Language strings object
   */
  loadLanguage(code) {
    // Try to load the requested language, fall back to English
    if (languagePacks[code]) {
      return languagePacks[code];
    }

    console.warn(
      `[I18n] Language "${code}" not found, falling back to English`
    );
    return languagePacks.en;
  }

  /**
   * Get a translated string by key path
   * Supports nested keys like "header.title" or "buttons.refresh"
   * @param {string} key - Dot-separated key path
   * @param {Object} [params] - Optional parameters for string interpolation
   * @returns {string} Translated string or the key if not found
   */
  t(key, params = {}) {
    const keys = key.split(".");
    let value = this.strings;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        console.warn(`[I18n] Missing translation for key: ${key}`);
        return key;
      }
    }

    if (typeof value !== "string") {
      console.warn(`[I18n] Key "${key}" does not resolve to a string`);
      return key;
    }

    // Handle parameter interpolation: {paramName}
    return value.replace(/\{(\w+)\}/g, (match, paramName) => {
      if (paramName in params) {
        return String(params[paramName]);
      }
      return match;
    });
  }

  /**
   * Change the current language
   * @param {string} code - Language code
   */
  setLanguage(code) {
    this.languageCode = code;
    this.strings = this.loadLanguage(code);
  }

  /**
   * Get the current language code
   * @returns {string}
   */
  getLanguageCode() {
    return this.languageCode;
  }

  /**
   * Check if a translation key exists
   * @param {string} key - Dot-separated key path
   * @returns {boolean}
   */
  has(key) {
    const keys = key.split(".");
    let value = this.strings;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return false;
      }
    }

    return typeof value === "string";
  }
}

// Singleton instance for convenience
let instance = null;

/**
 * Get the singleton I18n instance
 * @returns {I18n}
 */
export function getI18n() {
  if (!instance) {
    instance = new I18n();
  }
  return instance;
}

/**
 * Initialize or reinitialize the I18n singleton with a specific language
 * @param {string} [languageCode] - Language code
 * @returns {I18n}
 */
export function initI18n(languageCode) {
  instance = new I18n(languageCode);
  return instance;
}
