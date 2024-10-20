export class ResetPasswordDTO {
  token: string; // This is the token sent in the reset link
  newPassword: string;
}
