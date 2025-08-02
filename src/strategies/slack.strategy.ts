import axios from "axios";
import { ISocialUser } from "../interfaces/social-user.interface";
import { ISlackConfig } from "../interfaces/config.interface";
import { SocialAuthResponse } from "../interfaces/easy-social-auth-response.interface";
import { AuthStrategy } from "./easy-social-auth.strategy";

export class SlackStrategy extends AuthStrategy {
  private userId?: string;

  constructor(config: ISlackConfig) {
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
    redirectUri: string
  ): Promise<SocialAuthResponse<string>> {
    try {
      const params = new URLSearchParams();
      params.append("client_id", this.clientId);
      params.append("client_secret", this.clientSecret);
      params.append("code", code);
      params.append("redirect_uri", redirectUri);

      const { data } = await axios.post(this.tokenEndpoint, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!data || !data.ok) {
        return {
          status: false,
          error: data?.error || "Slack OAuth error",
        };
      }

      this.userId = data.authed_user?.id;
      const accessToken =
        data.authed_user?.access_token || data.access_token;

      return {
        status: true,
        data: accessToken,
      };
    } catch (error: any) {
      return {
        status: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  async getUserData(
    accessToken: string
  ): Promise<SocialAuthResponse<ISocialUser>> {
    try {
      let userId = this.userId;

      if (!userId) {
        const authTestResp = await axios.post(
          "https://slack.com/api/auth.test",
          undefined,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const authData = authTestResp.data;
        if (!authData.ok) {
          return {
            status: false,
            error: authData.error || "Failed to verify Slack token",
          };
        }
        userId = authData.user_id;
      }

      const userResp = await axios.get(this.userInfoEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: { user: userId },
      });

      const userData = userResp.data;
      if (!userData.ok) {
        return {
          status: false,
          error: userData.error || "Failed to fetch Slack user info",
        };
      }

      const user = userData.user;
      const profile = user.profile || {};

      const socialUser: ISocialUser = {
        id: user.id,
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        picture: profile.image_512 || profile.image_192,
        additionalData: userData,
      };

      return {
        status: true,
        data: socialUser,
      };
    } catch (error: any) {
      return {
        status: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }
}
