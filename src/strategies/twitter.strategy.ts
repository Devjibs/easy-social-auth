import axios from "axios";
import { ISocialUser } from "../interfaces/social-user.interface";
import { ITwitterConfig } from "../interfaces/config.interface";
import { SocialAuthResponse } from "../interfaces/easy-social-auth-response.interface";
import { AuthStrategy } from "./easy-social-auth.strategy";
import { GrantType } from "../enums/grant-type.enum";
import crypto from "crypto";
import { TokenTypeEnum } from "../enums/token-type.enum";

export class TwitterStrategy extends AuthStrategy {
  constructor(private readonly config: ITwitterConfig) {
    super(
      config.clientId,
      config.clientSecret,
      config.userInfoEndpoint,
      config.tokenEndpoint,
      config.authUrl
    );
  }

  // ======= OAuth 2.0 Methods (Unchanged) =======

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
          client_type: clientType ?? "third_party_app",
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
    token_type_hint?: TokenTypeEnum
  ): Promise<SocialAuthResponse<any>> {
    try {
      const { data } = await axios.post(
        this.config.revokeTokenUrl ?? "https://api.x.com/2/oauth2/revoke",
        null,
        {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${this.clientId}:${this.clientSecret}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        params: {
          token: token,
          token_type_hint: token_type_hint ?? TokenTypeEnum.ACCESS_TOKEN,
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

  // ======= New OAuth 1.0a Methods =======

  async getRequestOAuth_1_0_Token(
    callbackUrl: string
  ): Promise<SocialAuthResponse<any>> {
    try {
      const params = {
        oauth_callback: callbackUrl,
        oauth_consumer_key: this.config.apiKey,
        oauth_nonce: this.generateNonce(),
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: this.generateTimestamp(),
        oauth_version: "1.0",
      };

      const signature = this.generateSignature(
        "POST",
        this.config.OAuth_1_0_RequestTokenUrl,
        params
      );

      const response = await axios.post(this.config.OAuth_1_0_RequestTokenUrl, null, {
        headers: {
          Authorization: this.buildAuthHeader({
            ...params,
            oauth_signature: signature,
          }),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = new URLSearchParams(response.data);
      return {
        status: true,
        data: {
          oauth_token: data.get("oauth_token"),
          oauth_token_secret: data.get("oauth_token_secret"),
        },
      };
    } catch (error: any) {
      return {
        status: false,
        error: error.response?.data || error.message,
      };
    }
  }

  getAuthorizationUrl(oauthToken: string): string {
    return `${this.config.OAuth_1_0_AuthUrl}?oauth_token=${oauthToken}`;
  }

  async getOAuth_1_0_AccessToken(
    oauthToken: string,
    oauthVerifier: string
  ): Promise<SocialAuthResponse<any>> {
    try {
      const params = {
        oauth_consumer_key: this.clientId,
        oauth_token: oauthToken,
        oauth_nonce: this.generateNonce(),
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: this.generateTimestamp(),
        oauth_verifier: oauthVerifier,
        oauth_version: "1.0",
      };

      const signature = this.generateSignature(
        "POST",
        this.config.OAuth_1_0_AccessTokenUrl,
        params
      );

      const response = await axios.post(this.config.OAuth_1_0_AccessTokenUrl, null, {
        headers: {
          Authorization: this.buildAuthHeader({
            ...params,
            oauth_signature: signature,
          }),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = new URLSearchParams(response.data);
      return {
        status: true,
        data: {
          oauth_token: data.get("oauth_token"),
          oauth_token_secret: data.get("oauth_token_secret"),
        },
      };
    } catch (error: any) {
      return {
        status: false,
        error: error.response?.data || error.message,
      };
    }
  }

  private buildAuthHeader(params: Record<string, string>): string {
    return (
      "OAuth " +
      Object.entries(params)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}="${encodeURIComponent(value)}"`
        )
        .join(", ")
    );
  }

  private generateNonce(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private generateTimestamp(): string {
    return Math.floor(Date.now() / 1000).toString();
  }

  private generateSignature(
    method: string,
    url: string,
    params: Record<string, string>
  ): string {
    const sortedParams = Object.keys(params)
      .sort((a, b) => a.localeCompare(b))
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");

    const baseString = `${method.toUpperCase()}&${encodeURIComponent(
      url
    )}&${encodeURIComponent(sortedParams)}`;

    const signingKey = `${encodeURIComponent(this.config.consumerSecret)}&`;

    return crypto
      .createHmac("sha1", signingKey)
      .update(baseString)
      .digest("base64");
  }
}
