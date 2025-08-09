import axios, { AxiosRequestConfig } from "axios";
import { ISocialUser } from "../interfaces/social-user.interface";
import { GrantType } from "../enums/grant-type.enum";
import { SocialAuthResponse } from "../interfaces/easy-social-auth-response.interface";

export abstract class AuthStrategy {
  constructor(
    protected readonly clientId: string,
    protected readonly clientSecret: string,
    protected readonly userInfoEndpoint: string,
    protected readonly tokenEndpoint: string,
    protected readonly authUrl: string,
    protected readonly grantType: GrantType = GrantType.AUTHORIZATION_CODE
  ) {}

  generateAuthUrl(
    redirectUri: string,
    scope?: string,
    responseType?: string,
    additionalParams: Record<string, string> = {}
  ): string {
    const url = new URL(this.authUrl);
    url.searchParams.set("client_id", this.clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", responseType ?? "code");
    if (scope) url.searchParams.set("scope", scope);
    Object.keys(additionalParams).forEach((param) => {
      url.searchParams.append(param, additionalParams[param]);
    });
    return url.toString();
  }

  protected async exchangeToken(
    params: Record<string, string>,
    useFormEncoding = true
  ): Promise<SocialAuthResponse<Record<string, any>>> {
    try {
      let body: any;
      let headers: Record<string, string> = {};

      if (useFormEncoding) {
        body = new URLSearchParams();
        for (const key in params) {
          body.append(key, params[key]);
        }
        headers = {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cache-Control": "no-cache",
        };
      } else {
        body = params; // plain JSON object
      }

      const { data } = await axios.post(this.tokenEndpoint, body, { headers });

      return { status: true, data: data };
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
    useFormEncoding?: boolean,
  ): Promise<SocialAuthResponse<Record<string, any>>> {
    const params = {
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: redirectUri,
      grant_type: this.grantType,
      ...additionalParams,
    };

    return await this.exchangeToken(params, useFormEncoding);
  }

  async refreshAccessToken(
    refreshToken: string,
    useFormEncoding?: boolean,
  ): Promise<SocialAuthResponse<string>> {
    const params = {
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: GrantType.REFRESH_TOKEN,
    };
    const response = await this.exchangeToken(params, useFormEncoding);
    if (response.status && response.data) {
      return { status: true, data: response.data.access_token };
    } else {
      return { status: false, error: response.error || "Failed to refresh token" };
    }
  }

  async exchangePasswordForToken(
    username: string,
    password: string
  ): Promise<SocialAuthResponse<Record<string, any>>> {
    const params = {
      username,
      password,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: GrantType.PASSWORD,
    };
    return this.exchangeToken(params);
  }

  abstract getUserData(
    accessToken: string
  ): Promise<SocialAuthResponse<ISocialUser>>;
}
