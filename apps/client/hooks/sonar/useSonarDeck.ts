import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from '@kakamu/i18n';
import { useEvaluateMovieMutation, useMoviesToEvaluateQuery } from '@kakamu/query';
import { usePersonaStore } from '@kakamu/store';
import { useErrorAlertDialog } from '@kakamu/ui';

import type { TrailerQueueItem, TrailerVote } from '@/components/featured/sonar/types';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import {
  mapSonarEvaluateError,
  mapSonarLoadError,
} from '@/lib/error-message-map/sonar/sonar-evaluate-error';
import { mapMoviesToTrailerItems } from '@/lib/sonar/map-movie-to-trailer-item';

const DEFAULT_LIMIT = 20;

export function useSonarDeck() {
  const { t } = useTranslation();
  const client = useBackendApiClient();
  const { open: openErrorAlert } = useErrorAlertDialog();
  const personaId = usePersonaStore((state) => state.selectedPersonaId);
  const loadErrorAlertedRef = useRef(false);

  const moviesQuery = useMoviesToEvaluateQuery(client, {
    persona_id: personaId,
    limit: DEFAULT_LIMIT,
  });

  const evaluateMutation = useEvaluateMovieMutation(client, {
    onError: (error) => {
      openErrorAlert(mapSonarEvaluateError(error, t));
    },
  });

  useEffect(() => {
    if (moviesQuery.isError && !loadErrorAlertedRef.current) {
      loadErrorAlertedRef.current = true;
      openErrorAlert(mapSonarLoadError(moviesQuery.error, t));
    }
    if (!moviesQuery.isError) {
      loadErrorAlertedRef.current = false;
    }
  }, [moviesQuery.isError, moviesQuery.error, openErrorAlert, t]);

  const items = useMemo(
    () => mapMoviesToTrailerItems(moviesQuery.data?.items ?? []),
    [moviesQuery.data?.items],
  );

  const onVote = useCallback(
    (vote: TrailerVote, item: TrailerQueueItem) => {
      evaluateMutation.mutate({
        movie_id: item.id,
        evaluation: vote === 'like' ? 'LIKE' : 'DISLIKE',
        persona_id: personaId,
      });
    },
    [evaluateMutation, personaId],
  );

  const onQueueEmpty = useCallback(() => {
    void moviesQuery.refetch();
  }, [moviesQuery]);

  return {
    items,
    deckKey: moviesQuery.dataUpdatedAt,
    isLoading: moviesQuery.isLoading,
    isFetching: moviesQuery.isFetching,
    onVote,
    onQueueEmpty,
  };
}
