import axios from 'axios';
import { ISocialUser } from '../interfaces/social-user.interface';
import { ITiktokConfig } from '../interfaces/config.interface';
import { SocialAuthResponse } from '../interfaces/easy-social-auth-response.interface';
import { AuthStrategy } from './easy-social-auth.strategy';

export class TiktokStrategy extends AuthStrategy {
  constructor(private config: ITiktokConfig) {
    super(
      config.clientId,
      config.clientSecret,
      config.userInfoEndpoint,
      config.tokenEndpoint,
      config.authUrl
    );
  }

  async getUserData(accessToken: string): Promise<SocialAuthResponse<any>> {
    try {
      const { data } = await axios.get(this.userInfoEndpoint, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (data) return {
        status: true,
        data: data
      };

      return { status: false, error: "unable to retrieve user data" };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error_description || error.message };
    }
  }

  async getUserVideos(accessToken: string, cursor?: number, max_count?: number): Promise<SocialAuthResponse<any>> {
    try {
      const url = new URL(this.config.userVideosEndpoint);
      if (cursor) url.searchParams.set('cursor', cursor.toString());
      if (max_count) url.searchParams.set('max_count', max_count.toString());

      const { data } = await axios.get(url.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (data) return {
        status: true,
        data: data
      };

      return { status: false, error: "unable to retrieve user videos" };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error_description || error.message };
    }
  }
}
