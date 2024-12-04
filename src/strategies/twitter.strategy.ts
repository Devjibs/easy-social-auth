import axios from "axios";
import { ISocialUser } from "../interfaces/social-user.interface";
import { ITwitterConfig } from "../interfaces/config.interface";
import { SocialAuthResponse } from "../interfaces/easy-social-auth-response.interface";
import { AuthStrategy } from "./easy-social-auth.strategy";
import { GrantType } from "../enums/grant-type.enum";

export class TwitterStrategy extends AuthStrategy {
  constructor(private config: ITwitterConfig) {
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

      return { status: false, error: "Unable to retrieve user data" };
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
    additionalParams: Record<string, string> = {},
    clientType?: "PUBLIC" | "CONFIDENTIAL"
  ): Promise<SocialAuthResponse<any>> {
    try {
      let headers: Record<string, string> = {
        "Content-Type": "application/x-www-form-urlencoded",
      };
      let params: Record<string, string> = {
        grant_type: GrantType.AUTHORIZATION_CODE,
        code: code,
        redirect_uri: redirectUri,
        code_verifier: additionalParams?.code_verifier || "",
      };

      if (clientType === "CONFIDENTIAL") {
        if (!this.clientId || !this.clientSecret) {
          throw new Error(
            "Client ID or Client Secret is missing for confidential clients."
          );
        }
        headers["Authorization"] = `Basic ${Buffer.from(
          `${this.clientId}:${this.clientSecret}`
        ).toString("base64")}`;
      } else {
        params["client_id"] = this.clientId;
      }

      const body = new URLSearchParams(params).toString();
      const { data } = await axios.post(this.tokenEndpoint, body, { headers });
      return { 
        status: true,
        data: data,
      };
    } catch (error: any) {
      return {
        status: false,
        error: error.response?.data?.error_description || error.message,
      };
    }
  }

  async refreshAccessToken(
    refreshToken: string
  ): Promise<SocialAuthResponse<string>> {
    try {
      const { data } = await axios.post(this.tokenEndpoint, null, {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${this.clientId}:${this.clientSecret}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          grant_type: GrantType.REFRESH_TOKEN,
          refresh_token: refreshToken,
        },
      });
      return { 
        status: true,
        data: data,
      };
    } catch (error: any) {
      return {
        status: false,
        error: error.response?.data?.error_description || error.message,
      };
    }
  }

  async requestAppToken(
    scope: string,
    clientType?: string
  ): Promise<SocialAuthResponse<string>> {
    try {
      const { data } = await axios.post(this.tokenEndpoint, null, {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${this.clientId}:${this.clientSecret}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        params: {
          grant_type: GrantType.CLIENT_CREDENTIALS,
          client_secret: this.clientSecret,
          client_type: clientType || "third_party_app",
          scope: scope,
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

  async revokeAccessToken(
    token: string,
    token_type_hint?: string
  ): Promise<SocialAuthResponse<any>> {
    try {
      const { data } = await axios.post(this.config.revokeAccessUrl, null, {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${this.clientId}:${this.clientSecret}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        params: {
          token: token,
          token_type_hint: token_type_hint || "access_token",
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
}
