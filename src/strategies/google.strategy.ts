import axios from 'axios';
import { ISocialUser } from '../interfaces/social-user.interface';
import { AuthStrategy } from './social-auth.strategy';
import { SocialAuthResponse } from '../interfaces/social-auth-response.interface';
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

  async getUserData(accessToken: string): Promise<SocialAuthResponse<ISocialUser>> {
    try {
      const { data } = await axios.get(this.userInfoEndpoint, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return {
        status: true,
        data: {
          id: data.sub,
          email: data.email,
          firstName: data.given_name,
          lastName: data.family_name,
          picture: data.picture,

          //return this if nor any of the above props
          additionalData: data
        }
      };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error_description || error.message };
    }
  }
}
