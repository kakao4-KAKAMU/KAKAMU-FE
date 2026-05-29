export type PersonaFormValidationMessages = {
  name: {
    required: string;
    min: string;
    max: string;
  };
  description: {
    required: string;
    min: string;
    max: string;
  };
  profileImageUrl: {
    invalid: string;
  };
  genres: {
    required: string;
    max: string;
  };
  movies: {
    required: string;
  };
  persons: {
    required: string;
  };
};
