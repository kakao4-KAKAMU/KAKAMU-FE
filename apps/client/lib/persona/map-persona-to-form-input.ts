import type { PersonaCreateFormInput } from '@kakamu/schema';
import type { Persona, PersonaUpdateRequest } from '@kakamu/types';

export function mapPersonaToFormInput(persona: Persona): PersonaCreateFormInput {
  return {
    name: persona.nickname ?? '',
    profile_image_url: persona.profile_image_url ?? '',
    selectedGenreIds: (persona.fav_genres ?? []).map((genre) => genre.id),
    selectedMovies: (persona.fav_movies ?? []).map((movie) => ({
      id: movie.id,
      name: movie.title,
      poster_url: movie.poster_url ?? undefined,
      release_date: movie.release_date ?? undefined,
    })),
    selectedPersons: (persona.fav_people ?? []).map((person) => ({
      id: person.id,
      name: person.name,
      job: person.job ?? undefined,
      profile_image: person.profile_image ?? undefined,
    })),
  };
}

export function mapPersonaFormInputToUpdateRequest(
  data: PersonaCreateFormInput,
  persona: Persona,
  profileImageUrl: string,
): PersonaUpdateRequest {
  const trimmedName = data.name.trim();
  const nickname = trimmedName === persona.nickname ? undefined : trimmedName;
  const profile_image_url =
    profileImageUrl === (persona.profile_image_url ?? '') ? undefined : profileImageUrl;

  return {
    nickname,
    profile_image_url,
    fav_movie_ids: data.selectedMovies.map((movie) => movie.id),
    fav_genre_ids: data.selectedGenreIds,
    fav_people_ids: data.selectedPersons.map((person) => person.id),
  };
}
