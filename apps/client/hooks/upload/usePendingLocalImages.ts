import { useCallback, useEffect, useRef } from 'react';

import { revokeImagePreviewUri, type LocalImagePick } from '@/lib/upload/local-image';

export function usePendingLocalImages() {
  const pendingRef = useRef(new Map<string, LocalImagePick>());

  const registerLocalImage = useCallback((previewUri: string, pick: LocalImagePick) => {
    pendingRef.current.set(previewUri, pick);
  }, []);

  const releaseLocalImage = useCallback((previewUri: string) => {
    revokeImagePreviewUri(previewUri);
    pendingRef.current.delete(previewUri);
  }, []);

  useEffect(() => {
    const pending = pendingRef.current;
    return () => {
      for (const previewUri of pending.keys()) {
        revokeImagePreviewUri(previewUri);
      }
      pending.clear();
    };
  }, []);

  return {
    registerLocalImage,
    releaseLocalImage,
    getPendingLocalImages: () => pendingRef.current,
  };
}
