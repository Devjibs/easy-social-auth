import axios from 'axios';
import { ISpotifyConfig } from '../interfaces/config.interface';
import { SocialAuthResponse } from '../interfaces/easy-social-auth-response.interface';
import { AuthStrategy } from './easy-social-auth.strategy';
import { GrantType } from '../enums/grant-type.enum';

export class SpotifyStrategy extends AuthStrategy {
  constructor(config: ISpotifyConfig) {
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
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded', 'Cache-Control': 'no-cache',
          'Authorization': 'Basic ' + Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64')
        }
      });

      if (data) return { status: true, data: data };

      return { status: false, error: "unable to retrieve token" };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error_description || error.message };
    }
  }

  async exchangeCodeForToken(code: string, redirectUri: string): Promise<SocialAuthResponse<any>> {
    return await this.exchangeToken({
      grant_type: GrantType.AUTHORIZATION_CODE,
      redirect_uri: redirectUri,
      code
    });
  }

  async refreshAccessToken(refreshToken: string): Promise<SocialAuthResponse<any>> {
    return await this.exchangeToken({
      grant_type: GrantType.REFRESH_TOKEN,
      refresh_token: refreshToken
    });
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
}
