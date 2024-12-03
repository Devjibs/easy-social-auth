import axios from 'axios';
import { ISocialUser } from '../interfaces/social-user.interface';
import { ILinkedinConfig } from '../interfaces/config.interface';
import { SocialAuthResponse } from '../interfaces/easy-social-auth-response.interface';
import { AuthStrategy } from './easy-social-auth.strategy';
import { GrantType } from '../enums/grant-type.enum';

export class LinkedinStrategy extends AuthStrategy {
  constructor(config: ILinkedinConfig) {
    super(
      config.clientId,
      config.clientSecret,
      config.userInfoEndpoint,
      config.tokenEndpoint,
      config.authUrl
    );
  }

  async exchangeToken(params: Record<string, string>): Promise<SocialAuthResponse<any>> {
    try {
      const form = new URLSearchParams();
      Object.keys(params).forEach((key) => { form.append(key, params[key]) });

      const { data } = await axios.post(this.tokenEndpoint, form, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cache-Control': 'no-cache' }
      });

      if (data) return { status: true, data: data };

      return { status: false, error: "unable to retrieve token" };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error_description || error.message };
    }
  }

  async exchangeCodeForToken(
    code: string,
    redirectUri: string,
  ): Promise<SocialAuthResponse<string>> {
    try{
        const { data } = await axios.post(this.tokenEndpoint, null, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params: {
            grant_type: GrantType.AUTHORIZATION_CODE,
            code: code,
            redirect_uri: redirectUri,
            client_id: this.clientId,
            client_secret: this.clientSecret,
          }
        });
        return { status: true, data: data };
      } catch (error: any) {
        return { status: false, error: error.response?.data?.error_description || error.message };
      }
  }

  async refreshAccessToken(refreshToken: string): Promise<SocialAuthResponse<string>> {
    try{
      const { data } = await axios.post(this.tokenEndpoint, null, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: {
          grant_type: GrantType.REFRESH_TOKEN,
          refresh_token: refreshToken,
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }
      });
      return { status: true, data: data };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error_description || error.message };
    }
  }

  async requestAppToken(): Promise<SocialAuthResponse<string>> {
    try {
      const { data } = await axios.post(this.tokenEndpoint, null, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        params: {
          grant_type: GrantType.CLIENT_CREDENTIALS,
          client_secret: this.clientSecret,
          client_id: this.clientId,
        }
      });
      return { status: true, data: data };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error_description || error.message };
    }
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

      return { status: false, error: "unable to retrieve user data" };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error_description || error.message || error.errors };
    }
  }
}
