import axios, { AxiosRequestConfig } from "axios";
import { IRedditConfig } from "../interfaces/config.interface";
import { SocialAuthResponse } from "../interfaces/easy-social-auth-response.interface";
import { ISocialUser } from "../interfaces/social-user.interface";
import { AuthStrategy } from "./easy-social-auth.strategy";
import { GrantType } from "../enums/grant-type.enum";

export class RedditStrategy extends AuthStrategy {
  constructor(config: IRedditConfig) {
    super(
      config.clientId,
      config.clientSecret,
      config.userInfoEndpoint,
      config.tokenEndpoint,
      config.authUrl
    );
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
        'Authorization': 'Basic ' + Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64'),
      }
      return this.makeRequest({
        method: "post",
        url: this.tokenEndpoint,
        headers: headers,
        params: params,
      });
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
