import i18next from 'i18next';
import { I18nextProvider, initReactI18next, useTranslation } from 'react-i18next';

export { buildAuthFormValidationMessages } from './auth-form-validation-messages';
export { buildPersonaFormValidationMessages } from './persona-form-validation-messages';

import enTranslation from './generated/en.json';
import koTranslation from './generated/ko.json';

const resources = {
  ko: { translation: koTranslation },
  en: { translation: enTranslation },
};

export type KakamuTranslationNamespace = typeof koTranslation;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: KakamuTranslationNamespace;
    };
  }
}

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: KakamuTranslationNamespace;
    };
  }
}

let instance: typeof i18next | undefined;

export function getI18n() {
  if (!instance) {
    instance = i18next.createInstance();
    void instance.use(initReactI18next).init({
      resources,
      lng: 'ko',
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      defaultNS: 'translation',
    });
  }
  return instance;
}

/** @deprecated Prefer `getI18n()` — returns the shared singleton. */
export function createI18n() {
  return getI18n();
}

export { enTranslation, I18nextProvider, initReactI18next, koTranslation, useTranslation };
