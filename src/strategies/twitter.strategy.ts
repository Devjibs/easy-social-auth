import axios from 'axios';
import { ISocialUser } from '../interfaces/social-user.interface';
import { ITwitterConfig } from '../interfaces/config.interface';
import { SocialAuthResponse } from '../interfaces/easy-social-auth-response.interface';
import { AuthStrategy } from './easy-social-auth.strategy';
import { GrantType } from '../enums/grant-type.enum';

export class TwitterStrategy extends AuthStrategy {
  constructor(private config: ITwitterConfig) {
    super(
      config.clientId,
      config.clientSecret,
      config.userInfoEndpoint,
      config.tokenEndpoint,
      config.authUrl,
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

  async exchangeCodeForToken(
    code: string,
    redirectUri: string,
    additionalParams: Record<string, string> = {}
  ): Promise<SocialAuthResponse<string>> {
      try{
        const { data } = await axios.post(this.tokenEndpoint, null, {
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params: {
            grant_type: GrantType.AUTHORIZATION_CODE,
            code: code,
            redirect_uri: redirectUri,
            code_verifier: additionalParams?.code_verifier
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
          Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: {
          grant_type: GrantType.REFRESH_TOKEN,
          refresh_token: refreshToken,
        }
      });
      return { status: true, data: data };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error_description || error.message };
    }
  }

  async requestAppToken(scope: string, clientType?: string): Promise<SocialAuthResponse<string>> {
    try {
      const { data } = await axios.post(this.tokenEndpoint, null, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        params: {
          grant_type: GrantType.CLIENT_CREDENTIALS,
          client_secret: this.clientSecret,
          client_type: clientType || 'third_party_app',
          scope: scope,
        }
      });
      return { status: true, data: data };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error_description || error.message };
    }
  }

  async revokeAccessToken(token: string, token_type_hint?: string): Promise<SocialAuthResponse<any>> {
    try {
      const { data } = await axios.post(this.config.revokeAccessUrl, null, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        params: {
          token: token,
          token_type_hint: token_type_hint || "access_token",
        }
      });
      return { status: true, data: data };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error_description || error.message };
    }
  }
}
