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
  movies: {
    required: string;
  };
  persons: {
    required: string;
  };
};
