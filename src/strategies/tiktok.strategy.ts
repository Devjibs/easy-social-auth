import axios from "axios";
import { ISocialUser } from "../interfaces/social-user.interface";
import { ITiktokConfig } from "../interfaces/config.interface";
import { SocialAuthResponse } from "../interfaces/easy-social-auth-response.interface";
import { AuthStrategy } from "./easy-social-auth.strategy";
import { GrantType } from "../enums/grant-type.enum";

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

  async exchangeToken(
    params: Record<string, string>
  ): Promise<SocialAuthResponse<any>> {
    try {
      const form = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        form.append(key, params[key]);
      });

      const { data } = await axios.post(this.tokenEndpoint, form, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cache-Control": "no-cache",
        },
      });

      if (data) return { status: true, data: data };

      return { status: false, error: "unable to retrieve token" };
    } catch (error: any) {
      return {
        status: false,
        error: error.response?.data?.error_description || error.message,
      };
    }
  }

  generateAuthUrl(redirectUri: string, scope?: string): string {
    const csrfState = Math.random().toString(36).substring(2);

    let url = this.authUrl;

    url += `?client_key=${this.clientId}`;
    url += `&scope=${scope}`;
    url += "&response_type=code";
    url += `&redirect_uri=${redirectUri}`;
    url += "&state=" + csrfState;

    return url;
  }

  async exchangeCodeForToken(
    code: string,
    redirectUri: string
  ): Promise<SocialAuthResponse<any>> {
    return await this.exchangeToken({
      client_key: this.clientId,
      client_secret: this.clientSecret,
      grant_type: GrantType.AUTHORIZATION_CODE,
      redirect_uri: redirectUri,
      code,
    });
  }

  async refreshAccessToken(
    refreshToken: string
  ): Promise<SocialAuthResponse<any>> {
    return await this.exchangeToken({
      client_key: this.clientId,
      client_secret: this.clientSecret,
      grant_type: GrantType.REFRESH_TOKEN,
      refresh_token: refreshToken,
    });
  }

  async getUserData(accessToken: string): Promise<SocialAuthResponse<any>> {
    try {
      const { data } = await axios.get(this.userInfoEndpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (data)
        return {
          status: true,
          data: data?.data?.user,
        };

      return { status: false, error: "unable to retrieve user data" };
    } catch (error: any) {
      console.log(error.response.data);
      return {
        status: false,
        error: error.response?.data?.error_description || error.message,
      };
    }
  }
}
