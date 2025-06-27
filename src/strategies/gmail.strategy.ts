import axios from "axios";
import { ISocialUser } from "../interfaces/social-user.interface";
import { IGmailConfig } from "../interfaces/config.interface";
import { SocialAuthResponse } from "../interfaces/easy-social-auth-response.interface";
import { AuthStrategy } from "./easy-social-auth.strategy";
import { GrantType } from "../enums/grant-type.enum";

export class GmailStrategy extends AuthStrategy {
  constructor(config: IGmailConfig) {
    super(
      config.clientId,
      config.clientSecret,
      config.userInfoEndpoint,
      config.tokenEndpoint,
      config.authUrl
    );
  }

  async exchangeCodeForToken(
    code: string,
    redirectUri: string,
    additionalParams: Record<string, string> = {}
  ): Promise<SocialAuthResponse<string>> {
    try {
      const form = new URLSearchParams();
      form.append("code", code);
      form.append("client_id", this.clientId);
      form.append("client_secret", this.clientSecret);
      form.append("redirect_uri", redirectUri);
      form.append("grant_type", GrantType.AUTHORIZATION_CODE);

      for (const key in additionalParams) {
        form.append(key, additionalParams[key]);
      }

      const { data } = await axios.post(this.tokenEndpoint, form, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      (this as any)._lastToken = data;

      return {
        status: true,
        data: data.access_token,
      };
    } catch (error: any) {
      return {
        status: false,
        error: error.response?.data?.error_description || error.message,
      };
    }
  }

  async getUserData(
    accessToken: string
  ): Promise<SocialAuthResponse<ISocialUser>> {
    try {
      const { data } = await axios.get(this.userInfoEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!data?.emailAddress) {
        return {
          status: false,
          error: "Unable to retrieve user email from Gmail API",
        };
      }

      const user: ISocialUser = {
        id: data.emailAddress,
        email: data.emailAddress,
        firstName: "",
        lastName: "",
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

  async refreshAccessToken(
    refreshToken: string
  ): Promise<SocialAuthResponse<any>> {
    try {
      const form = new URLSearchParams();
      form.append("client_id", this.clientId);
      form.append("client_secret", this.clientSecret);
      form.append("refresh_token", refreshToken);
      form.append("grant_type", GrantType.REFRESH_TOKEN);

      const { data } = await axios.post(this.tokenEndpoint, form, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      return { status: true, data };
    } catch (error: any) {
      return {
        status: false,
        error: error.response?.data?.error_description || error.message,
      };
    }
  }
}
