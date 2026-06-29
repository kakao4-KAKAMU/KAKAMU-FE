/** Metro가 `.web.ts` / `.native.ts`로 대체합니다. 타입체크·fallback용 스텁. */
export async function enableMsw(): Promise<void> {
  throw new Error('[MSW] enable-msw platform module is missing');
}
