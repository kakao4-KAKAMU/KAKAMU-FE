import { setupWorker } from 'msw/browser';

import { getHandlers } from './handlers';

let workerPromise: ReturnType<typeof createWorker> | null = null;

async function createWorker() {
  const handlers = await getHandlers();
  return setupWorker(...handlers);
}

export async function getWorker() {
  if (!workerPromise) {
    workerPromise = createWorker();
  }

  return workerPromise;
}
