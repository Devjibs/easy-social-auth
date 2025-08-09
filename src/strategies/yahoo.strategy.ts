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

  async refreshAccessToken(
    refreshToken: string,
    useFormEncoding?: boolean,
    redirectUri?: string,
  ): Promise<SocialAuthResponse<string>> {
    const params = {
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: GrantType.REFRESH_TOKEN,
      redirect_uri: redirectUri || "",
    };
    const response = await this.exchangeToken(params, useFormEncoding);
    if (response.status && response.data) {
      return { status: true, data: response.data.access_token };
    } else {
      return { status: false, error: response.error || "Failed to refresh token" };
    }
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
