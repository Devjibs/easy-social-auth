import axios, { AxiosRequestConfig } from "axios";
import { IRedditConfig } from "../interfaces/config.interface";
import { SocialAuthResponse } from "../interfaces/easy-social-auth-response.interface";
import { ISocialUser } from "../interfaces/social-user.interface";
import { AuthStrategy } from "./easy-social-auth.strategy";
import { GrantType } from "../enums/grant-type.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";

export class RedditStrategy extends AuthStrategy {
  constructor(private readonly config: IRedditConfig) {
    super(
      config.clientId,
      config.clientSecret,
      config.userInfoEndpoint,
      config.tokenEndpoint,
      config.authUrl
    );
  }

  private get clientAuthorizationHeader(): Record<string, string> {
    const credentials = Buffer.from(
      `${this.clientId}:${this.clientSecret}`
    ).toString("base64");
    return {
      Authorization: `Basic ${credentials}`,
    };
  }

  private async makeRequest<T>(
    requestConfig: AxiosRequestConfig
  ): Promise<SocialAuthResponse<T>> {
    try {
      const { data } = await axios(requestConfig);
      if (data) return { status: true, data: data };

      return { status: false, error: "No response data received." };
    } catch (error: any) {
      return {
        status: false,
        error: error.response?.data?.error_description || error.message,
      };
    }
  }


  private async postToTokenEndPoint(
    params: Record<string, string>
  ): Promise<SocialAuthResponse<any>> {
      const  headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...this.clientAuthorizationHeader,
      }
      return this.makeRequest({
        method: "post",
        url: this.tokenEndpoint,
        headers: headers,
        params: params,
      });
  }

  async requestAppToken(): Promise<SocialAuthResponse<string>> {
    return this.postToTokenEndPoint({
      grant_type: GrantType.CLIENT_CREDENTIALS,
    })
  }

  async exchangeCodeForToken(
    code: string,
    redirectUri: string
  ): Promise<SocialAuthResponse<any>> {
    return this.postToTokenEndPoint({
      grant_type: GrantType.AUTHORIZATION_CODE,
      code: code,
      redirect_uri: redirectUri,
    })
  }

  async refreshAccessToken(refreshToken: string): Promise<SocialAuthResponse<string>> {
    return this.postToTokenEndPoint({
      grant_type: GrantType.REFRESH_TOKEN,
      refresh_token: refreshToken,
    })
  }

  async revokeToken(
    token: string,
    tokenType?: TokenTypeEnum,
  ): Promise<SocialAuthResponse<string>> {
    this.makeRequest({
      method: "post",
      url: this.config.revokeTokenUrl ?? "https://www.reddit.com/api/v1/revoke_token",
      headers: this.clientAuthorizationHeader,
      params: {
        token: token,
        token_type_hint: tokenType ?? TokenTypeEnum.ACCESS_TOKEN
      } 
    })

    return {
      status: true,
      data: "Token revoked successfully",
    }
  }

  async getUserData(accessToken: string): Promise<SocialAuthResponse<ISocialUser>> {
      const headers = { 
        Authorization: `Bearer ${accessToken}` 
      }
      return this.makeRequest({
        method: "get",
        url: this.userInfoEndpoint,
        headers: headers,
      });
  }
}
