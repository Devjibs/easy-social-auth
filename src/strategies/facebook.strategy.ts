import axios from 'axios';
import { ISocialUser } from '../interfaces/social-user.interface';
import { AuthStrategy } from './easy-social-auth.strategy';
import { SocialAuthResponse } from '../interfaces/easy-social-auth-response.interface';
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

  async getUserData(accessToken: string): Promise<SocialAuthResponse<ISocialUser>> {
    try {
      const { data } = await axios.get(this.userInfoEndpoint, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return {
        status: true,
        data: {
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          picture: data.picture.data.url,
          additionalData: data
        }
      };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error_description || error.message };
    }
  }
}
