import axios from "axios";
import { AuthStrategy } from "./easy-social-auth.strategy";
import { ISocialUser } from "../interfaces/social-user.interface";
import { IHubSpotConfig } from "../interfaces/config.interface";
import { SocialAuthResponse } from "../interfaces/easy-social-auth-response.interface";
import { GrantType } from "../enums/grant-type.enum";

export class HubSpotStrategy extends AuthStrategy {
  constructor(config: IHubSpotConfig) {
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
      const { data } = await axios.get(
        `${this.userInfoEndpoint}/${accessToken}`
      );

      const user: ISocialUser = {
        id: data.user_id?.toString(),
        email: data.user,
        firstName: "",
        lastName: "",
        additionalData: {
          hub_id: data.hub_id,
          hub_domain: data.hub_domain,
          scopes: data.scopes,
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
