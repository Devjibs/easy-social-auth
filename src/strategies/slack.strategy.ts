import axios from "axios";
import { ISlackConfig } from "../interfaces/config.interface";
import { SocialAuthResponse } from "../interfaces/easy-social-auth-response.interface";
import { AuthStrategy } from "./easy-social-auth.strategy";

export class SlackStrategy extends AuthStrategy {
  constructor(private readonly config: ISlackConfig) {
    super(
      config.clientId,
      config.clientSecret,
      config.userInfoEndpoint,
      config.tokenEndpoint,
      config.authUrl,
    );
  }

  async getUserData(accessToken: string): Promise<SocialAuthResponse<any>> {
    try {
      const { data } = await axios.get(this.userInfoEndpoint, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (data) return { status: true, data };
      return { status: false, error: "unable to retrieve user data" };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error || error.message };
    }
  }

  async revokeToken(accessToken: string): Promise<SocialAuthResponse<any>> {
    try {
      const { data } = await axios.post(
        this.config.revokeTokenUrl ?? "https://slack.com/api/auth.revoke",
        null,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      if (data.ok) return { status: true, data: "Token revoked successfully" };
      return { status: false, error: "Failed to revoke token" };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error || error.message };
    }
  }
}