import axios from "axios";
import { ISocialUser } from "../interfaces/social-user.interface";
import { IYahooConfig } from "../interfaces/config.interface";
import { SocialAuthResponse } from "../interfaces/easy-social-auth-response.interface";
import { AuthStrategy } from "./easy-social-auth.strategy";
import { GrantType } from "../enums/grant-type.enum";

export class YahooStrategy extends AuthStrategy {
  constructor(config: IYahooConfig) {
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
        },
      });

      return { status: true, data: data };
    } catch (error: any) {
      return {
        status: false,
        error: error.response?.data?.error_description || error.message,
      };
    }
  }

  async exchangeCodeForToken(
    code: string,
    redirectUri: string
  ): Promise<SocialAuthResponse<any>> {
    return await this.exchangeToken({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: redirectUri,
      code,
      grant_type: GrantType.AUTHORIZATION_CODE,
    });
  }

  async refreshAccessToken(
    refreshToken: string,
    redirectUri?: string
  ): Promise<SocialAuthResponse<any>> {
    return await this.exchangeToken({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: GrantType.REFRESH_TOKEN,
      refresh_token: refreshToken,
      redirect_uri: redirectUri as string,
    });
  }

  async getUserData(
    accessToken: string
  ): Promise<SocialAuthResponse<ISocialUser>> {
    try {
      const { data } = await axios.get(this.userInfoEndpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const user: ISocialUser = {
        id: data.sub,
        email: data.email,
        firstName: data.given_name || "",
        lastName: data.family_name || "",
        picture: data.picture || "",
        additionalData: {
          gender: data.gender,
          nickname: data.nickname,
        },
      };

      return { status: true, data: user };
    } catch (error: any) {
      return {
        status: false,
        error: error.response?.data?.error_description || error.message,
      };
    }
  }
}
