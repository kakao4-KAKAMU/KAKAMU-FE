import type { PostWriteFormInput } from '@kakamu/schema';
import type { PostItem, PostCreateRequest } from '@kakamu/types';

export const POST_WRITE_DEFAULT_VALUES: PostWriteFormInput = {
  title: '',
  content: '',
  selectedMovies: [],
  image_urls: [],
  is_spoiler: false,
};

export function mapPostItemToWriteFormInput(post: PostItem): PostWriteFormInput {
  return {
    title: post.title,
    content: post.content,
    selectedMovies: post.movies.map((movie) => ({
      id: movie.id,
      name: movie.title,
      release_date: movie.release_date,
      poster_url: movie.poster_url,
    })),
    image_urls: post.image_urls,
    is_spoiler: post.is_spoiler,
  };
}

export function mapWriteFormInputToRequestBody(values: PostWriteFormInput): PostCreateRequest {
  return {
    title: values.title.trim(),
    content: values.content.trim(),
    movie_ids: values.selectedMovies.map((movie) => movie.id),
    image_urls: values.image_urls,
    is_spoiler: values.is_spoiler,
  };
}
