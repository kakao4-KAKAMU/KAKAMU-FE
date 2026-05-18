/** 웹 전용 — `firebase/app` */
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';

import { getFirebaseWebOptions } from './webOptions';

let cachedApp: FirebaseApp | null = null;

export function getFirebaseWebApp(): FirebaseApp {
  if (cachedApp) {
    return cachedApp;
  }
  if (getApps().length > 0) {
    cachedApp = getApp();
    return cachedApp;
  }
  cachedApp = initializeApp(getFirebaseWebOptions());
  return cachedApp;
}

/** 웹에서 `firebase/app` 기준으로 단일 앱 인스턴스를 보장합니다. */
export function ensureFirebaseWebInitialized(): void {
  getFirebaseWebApp();
}
