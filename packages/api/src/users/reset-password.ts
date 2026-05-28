import type { PhoneVerificationRequest, ResetPasswordRequest } from '@kakamu/types';
import type { ApiClient } from '../client';

/** `POST .../users/local/phone-verification` */
export async function postUserPhoneVerification(client: ApiClient, body: PhoneVerificationRequest): Promise<void> {
  await client.post('users/local/phone-verification', { json: body });
}

/** `POST .../users/local/reset-password` */
export async function postUserResetPassword(client: ApiClient, body: ResetPasswordRequest): Promise<void> {
  await client.post('users/local/reset-password', { json: body });
}
