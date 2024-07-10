import axios from 'axios';
import { ISocialUser } from '../interfaces/social-user.interface';
import { ITwitterConfig } from '../interfaces/config.interface';
import { SocialAuthResponse } from '../interfaces/easy-social-auth-response.interface';
import { AuthStrategy } from './easy-social-auth.strategy';
import { GrantType } from '../enums/grant-type.enum';

export class TwitterStrategy extends AuthStrategy {
  constructor(config: ITwitterConfig) {
    super(
      config.clientId,
      config.clientSecret,
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
      if (data) return {
        status: true,
        data: data
      };

      return { status: false, error: "Unable to retrieve user data" };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error_description || error.message };
    }
  }

  async requestToken(): Promise<SocialAuthResponse<string>> {
    try {
      const { data } = await axios.post(this.tokenEndpoint, null, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        params: {
          grant_type: GrantType.CLIENT_CREDENTIALS
        }
      });
      return { status: true, data: data?.access_token };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error_description || error.message };
    }
  }
}
