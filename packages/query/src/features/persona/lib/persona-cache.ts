import type { QueryClient, QueryKey } from '@tanstack/react-query';
import type { Persona } from '@kakamu/types';

import { personaKeys } from '../../../shared/keys/persona.keys';
import { seedDetailCache } from '../../../shared/lib/normalize-list-cache';

export type PersonaDetailQuerySnapshot = [QueryKey, Persona | undefined][];

export function seedPersonaDetailCacheFromList(
  queryClient: QueryClient,
  personas: Persona[],
): void {
  seedDetailCache(queryClient, personas, (persona) => persona.id, personaKeys.detail);
}

export function setPersonaDetailCache(queryClient: QueryClient, persona: Persona): void {
  queryClient.setQueryData(personaKeys.detail(persona.id), persona);
}

export function removePersonaDetailCache(queryClient: QueryClient, personaId: string): void {
  queryClient.removeQueries({ queryKey: personaKeys.detail(personaId) });
}

export function patchPersonaDetailCache(
  queryClient: QueryClient,
  personaId: string,
  patch: (persona: Persona) => Persona,
): void {
  queryClient.setQueryData<Persona>(personaKeys.detail(personaId), (old) =>
    old ? patch(old) : old,
  );
}

export function snapshotPersonaDetail(
  queryClient: QueryClient,
  personaId: string,
): PersonaDetailQuerySnapshot {
  return queryClient.getQueriesData<Persona>({ queryKey: personaKeys.detail(personaId) });
}

export function restorePersonaDetails(
  queryClient: QueryClient,
  snapshots: PersonaDetailQuerySnapshot,
): void {
  for (const [queryKey, data] of snapshots) {
    queryClient.setQueryData(queryKey, data);
  }
}
