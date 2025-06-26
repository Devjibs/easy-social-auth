import axios from "axios";
import { ISocialUser } from "../interfaces/social-user.interface";
import { IGmailConfig } from "../interfaces/config.interface";
import { SocialAuthResponse } from "../interfaces/easy-social-auth-response.interface";
import { AuthStrategy } from "./easy-social-auth.strategy";

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

      return { status: true, data: data };
    } catch (error: any) {
      return {
        status: false,
        error: error.response?.data?.error_description || error.message,
      };
    }
  }
}
