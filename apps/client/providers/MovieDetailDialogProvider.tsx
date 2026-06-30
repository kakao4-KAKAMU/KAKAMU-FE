import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { MovieDetailDialog } from '@/components/featured/movie';

type MovieDetailDialogContextValue = {
  open: (movieId: string) => void;
  close: () => void;
};

const MovieDetailDialogContext = createContext<MovieDetailDialogContextValue | null>(null);

export function MovieDetailDialogProvider({ children }: { children: ReactNode }) {
  const [movieId, setMovieId] = useState<string | null>(null);

  const open = useCallback((nextMovieId: string) => {
    setMovieId(nextMovieId);
  }, []);

  const close = useCallback(() => {
    setMovieId(null);
  }, []);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (!nextOpen) {
      setMovieId(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      open,
      close,
    }),
    [close, open],
  );

  return (
    <MovieDetailDialogContext.Provider value={value}>
      {children}
      <MovieDetailDialog
        open={movieId != null}
        onOpenChange={handleOpenChange}
        movieId={movieId}
      />
    </MovieDetailDialogContext.Provider>
  );
}

export function useMovieDetailDialog(): MovieDetailDialogContextValue {
  const context = useContext(MovieDetailDialogContext);
  if (!context) {
    throw new Error('useMovieDetailDialog must be used within MovieDetailDialogProvider');
  }
  return context;
}
