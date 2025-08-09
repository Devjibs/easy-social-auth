import axios from "axios";
import { ISocialUser } from "../interfaces/social-user.interface";
import { ILinkedinConfig } from "../interfaces/config.interface";
import { SocialAuthResponse } from "../interfaces/easy-social-auth-response.interface";
import { AuthStrategy } from "./easy-social-auth.strategy";

export class LinkedinStrategy extends AuthStrategy {
  constructor(config: ILinkedinConfig) {
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
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (data)
        return {
          status: true,
          data: data,
        };

      return { status: false, error: "unable to retrieve user data" };
    } catch (error: any) {
      return {
        status: false,
        error:
          error.response?.data?.error_description ||
          error.message ||
          error.errors,
      };
    }
  }
}
