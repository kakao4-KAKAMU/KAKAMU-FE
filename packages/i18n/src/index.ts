import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ko: { translation: { hello: '안녕하세요' } },
  en: { translation: { hello: 'Hello' } },
} as const;

export function createI18n() {
  const instance = i18n.createInstance();
  void instance.use(initReactI18next).init({
    resources,
    lng: 'ko',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
  return instance;
}
