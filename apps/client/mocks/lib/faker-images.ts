import { faker } from '@faker-js/faker';

/** 프로필·페르소나 아바타 (personPortrait) */
export function mockProfileImageUrl(): string {
  return faker.image.personPortrait({ size: 256 });
}

/** 영화 포스터 (2:3 비율) */
export function mockPosterUrl(): string {
  return faker.image.urlPicsumPhotos({ width: 342, height: 513 });
}

/** 피드·업로드 등 일반 콘텐츠 이미지 */
export function mockContentImageUrl(): string {
  return faker.image.url({ width: 800, height: 600 });
}

const imageFieldGenerators: Record<string, () => string> = {
  profile_image_url: mockProfileImageUrl,
  profile_image: mockProfileImageUrl,
  poster_url: mockPosterUrl,
  image_url: mockContentImageUrl,
};

export function isImageUrlField(key: string): boolean {
  return key in imageFieldGenerators || key === 'image_urls';
}

export function mockImageUrlForField(key: string): string {
  return (imageFieldGenerators[key] ?? mockContentImageUrl)();
}
