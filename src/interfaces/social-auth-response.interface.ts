export interface SocialAuthResponse<T = any> {
  status: boolean;
  data?: T;
  error?: string;
}
