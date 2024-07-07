export interface ISocialUser<T = any> {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  additionalData?: T;
}
