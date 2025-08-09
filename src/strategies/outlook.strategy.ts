import axios from "axios";
import { AuthStrategy } from "./easy-social-auth.strategy";
import { ISocialUser } from "../interfaces/social-user.interface";
import { IOutlookConfig } from "../interfaces/config.interface";
import { SocialAuthResponse } from "../interfaces/easy-social-auth-response.interface";

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
