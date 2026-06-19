export type Genre = {
  id: string;
  name: string;
};

export type GenreListResponse = {
  status?: string;
  genres: Genre[];
};
