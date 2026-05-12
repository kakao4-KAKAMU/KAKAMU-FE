/** Domain types (User, Post, …) — expand per rule.md */
export type Brand<T, B extends string> = T & { readonly __brand: B };

export type {
  AuthSnsSignUpProvider,
  Email,
  FindPassword,
  Password,
  PasswordConfirm,
  RegisterUserRequest,
  ResetPassword,
  SignIn,
  SignUpSNS,
  User,
} from './auth';
