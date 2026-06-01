export const IMAGE_UPLOAD_TYPES = ['feed', 'profile'] as const;

export type ImageUploadType = (typeof IMAGE_UPLOAD_TYPES)[number];

export type ImageUploadResponse = {
  image_url: string;
};
