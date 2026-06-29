import { getServer } from './native';

export async function enableMsw() {
  const server = await getServer();
  server.listen({ onUnhandledRequest: 'bypass' });
}
