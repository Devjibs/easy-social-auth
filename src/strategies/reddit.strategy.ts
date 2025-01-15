import axios from "axios";
import { IRedditConfig } from "../interfaces/config.interface";
import { SocialAuthResponse } from "../interfaces/easy-social-auth-response.interface";
import { ISocialUser } from "../interfaces/social-user.interface";
import { AuthStrategy } from "./easy-social-auth.strategy";
import { GrantType } from "../enums/grant-type.enum";

export class RedditStrategy extends AuthStrategy {
  constructor(config: IRedditConfig) {
    super(
      config.clientId,
      config.clientSecret,
      config.userInfoEndpoint,
      config.tokenEndpoint,
      config.authUrl
    );
  }

  private async postToTokenEndPoint(
    params: Record<string, string>
  ): Promise<SocialAuthResponse<any>> {
    try{
      const { data } = await axios.post(this.tokenEndpoint, null, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64'),
        },
        params,
      });

      if (data) return { status: true, data: data };

      return { status: false, error: "unable to retrieve token" };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error_description || error.message };
    }
  }

  async exchangeCodeForToken(
    code: string,
    redirectUri: string
  ): Promise<SocialAuthResponse<any>> {
    return this.postToTokenEndPoint({
      grant_type: GrantType.AUTHORIZATION_CODE,
      code: code,
      redirect_uri: redirectUri,
    })
  }

  async refreshAccessToken(refreshToken: string): Promise<SocialAuthResponse<string>> {
    return this.postToTokenEndPoint({
      grant_type: GrantType.REFRESH_TOKEN,
      refresh_token: refreshToken,
    })
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
