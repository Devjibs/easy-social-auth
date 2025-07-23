import axios from 'axios';
import { ISocialUser } from '../interfaces/social-user.interface';
import { IGoogleConfig } from '../interfaces/config.interface';
import { SocialAuthResponse } from '../interfaces/easy-social-auth-response.interface';
import { AuthStrategy } from './easy-social-auth.strategy';
import { GrantType } from '../enums/grant-type.enum';

export class GoogleStrategy extends AuthStrategy {
  constructor(config: IGoogleConfig) {
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

      return { status: false, error: "unable to retrieve user data" };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error_description || error.message };
    }
  }

  async exchangeCodeForToken(
    code: string,
    redirectUri: string,
    additionalParams?: Record<string, string>
  ): Promise<SocialAuthResponse<string>> {
    const params = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: GrantType.AUTHORIZATION_CODE,
      ...additionalParams
    };
    return super.exchangeCodeForToken(
      code, redirectUri, params
    )
  }
}
