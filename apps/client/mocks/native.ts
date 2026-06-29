import { setupServer } from 'msw/native';

import { getHandlers } from './handlers';

let serverPromise: ReturnType<typeof createServer> | null = null;

async function createServer() {
  const handlers = await getHandlers();
  return setupServer(...handlers);
}

export async function getServer() {
  if (!serverPromise) {
    serverPromise = createServer();
  }

  return serverPromise;
}
