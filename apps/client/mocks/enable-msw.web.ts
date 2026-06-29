import { getWorker } from './browser';

export async function enableMsw() {
  const worker = await getWorker();

  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
}
