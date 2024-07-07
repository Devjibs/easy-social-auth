import axios from 'axios';
import { ISocialUser } from '../interfaces/social-user.interface';
import { AuthStrategy } from './auth.strategy';
import { IGoogleConfig } from '../interfaces/config.interface';

export class GoogleStrategy extends AuthStrategy {
  constructor(config: IGoogleConfig) {
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
        id: data.sub,
        email: data.email,
        firstName: data.given_name,
        lastName: data.family_name,
        picture: data.picture,
      };
    } catch (error: any) {
      throw new Error(`Failed to get user data: ${error.response?.data?.error_description || error.message}`);
    }
  }
}
