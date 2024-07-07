import axios from 'axios';
import { ISocialUser } from '../interfaces/social-user.interface';
import { AuthStrategy } from './auth.strategy';
import { IFacebookConfig } from '../interfaces/config.interface';

export class FacebookStrategy extends AuthStrategy {
  constructor(config: IFacebookConfig) {
    super(
      config.clientId,
      config.clientSecret,
      config.redirectUri,
      config.userInfoEndpoint,
      config.tokenEndpoint,
      config.authUrl
    );
  }

  async getUserData(accessToken: string): Promise<ISocialUser> {
    try {
      const { data } = await axios.get(this.userInfoEndpoint, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        picture: data.picture.data.url,
      };
    } catch (error: any) {
      throw new Error(`Failed to get user data: ${error.response?.data?.error_description || error.message}`);
    }
  }
}
