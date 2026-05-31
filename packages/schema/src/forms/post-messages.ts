export type PostFormValidationMessages = {
  title: {
    required: string;
    max: string;
  };
  content: {
    required: string;
    max: string;
  };
  imageUrls: {
    max: string;
  };
};
