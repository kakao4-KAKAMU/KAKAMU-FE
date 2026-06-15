type JwtPayload = {
  user_id?: unknown;
  sub?: unknown;
};

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

  if (typeof globalThis.atob === 'function') {
    return globalThis.atob(padded);
  }

  throw new Error('Base64 decoding is not supported in this environment');
}

/** JWT payload를 파싱합니다. 서명 검증은 하지 않습니다. */
export function parseJwtPayload<T extends Record<string, unknown> = JwtPayload>(
  token: string,
): T | null {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  try {
    const decoded = decodeBase64Url(parts[1] ?? '');
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
}

/** access token에서 user_id를 추출합니다. `user_id` claim 우선, 없으면 `sub`를 사용합니다. */
export function getUserIdFromAccessToken(token: string | null | undefined): string | null {
  if (!token) {
    return null;
  }

  const payload = parseJwtPayload<JwtPayload>(token);
  if (!payload) {
    return null;
  }

  if (typeof payload.user_id === 'string' && payload.user_id.length > 0) {
    return payload.user_id;
  }

  if (typeof payload.sub === 'string' && payload.sub.length > 0) {
    return payload.sub;
  }

  return null;
}
