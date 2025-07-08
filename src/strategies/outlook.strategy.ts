import axios from "axios";
import { AuthStrategy } from "./easy-social-auth.strategy";
import { ISocialUser } from "../interfaces/social-user.interface";
import { IOutlookConfig } from "../interfaces/config.interface";
import { SocialAuthResponse } from "../interfaces/easy-social-auth-response.interface";
import { GrantType } from "../enums/grant-type.enum";

export class OutlookStrategy extends AuthStrategy {
  constructor(config: IOutlookConfig) {
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
    redirectUri: string,
    additionalParams: Record<string, string>
  ): Promise<SocialAuthResponse<any>> {
    return await this.exchangeToken({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: GrantType.AUTHORIZATION_CODE,
      ...additionalParams,
    });
  }

  async refreshAccessToken(
    refreshToken: string
  ): Promise<SocialAuthResponse<any>> {
    return await this.exchangeToken({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: GrantType.REFRESH_TOKEN,
      refresh_token: refreshToken,
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
        id: data.id,
        email: data.mail || data.userPrincipalName,
        firstName: data.givenName || "",
        lastName: data.surname || "",
        picture: "",
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
