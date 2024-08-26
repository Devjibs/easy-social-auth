import axios from 'axios';
import { IInstagramConfig } from '../interfaces/config.interface';
import { SocialAuthResponse } from '../interfaces/easy-social-auth-response.interface';
import { AuthStrategy } from './easy-social-auth.strategy';
import { GrantType } from '../enums/grant-type.enum';
import { InstagramPaging } from '../interfaces/ig-paging.interface';

export class InstagramStrategy extends AuthStrategy {
    constructor(private config: IInstagramConfig) {
        super(
            config.clientId,
            config.clientSecret,
            config.userInfoEndpoint,
            config.tokenEndpoint,
            config.authUrl
        );
    }

    async exchangeTokenForLongLivedToken(accessToken: string): Promise<SocialAuthResponse<string>> {
        try {
            const url = new URL(this.config.longLivedTokenEndpoint);
            url.searchParams.set('grant_type', GrantType.INSTAGRAM_EXCHANGE_TOKEN);
            url.searchParams.set('access_token', accessToken);

            const { data } = await axios.get(url.toString());
            if (data) return { status: true, data: data?.access_token };

            return { status: false, error: "unable to exchange access token" };
        } catch (error: any) {
            return { status: false, error: error.response?.data?.error_description || error.message };
        }
    }

    async refreshAccessToken(accessToken: string): Promise<SocialAuthResponse<string>> {
        try {
            const url = new URL(this.config.refreshTokenEndpoint);
            url.searchParams.set('grant_type', GrantType.INSTAGRAM_REFRESH_TOKEN);
            url.searchParams.set('access_token', accessToken);

            const { data } = await axios.get(url.toString());
            if (data) return { status: true, data: data?.access_token };

            return { status: false, error: "unable to refresh access token" };
        } catch (error: any) {
            return { status: false, error: error.response?.data?.error_description || error.message };
        }
    }

    async getUserData(accessToken: string): Promise<SocialAuthResponse<any>> {
        try {
            const url = new URL(this.config.userInfoEndpoint);
            url.searchParams.set('access_token', accessToken);

            const { data } = await axios.get(url.toString());
            if (data) return { status: true, data: data };

            return { status: false, error: "unable to retrieve user data" };
        } catch (error: any) {
            return { status: false, error: error.response?.data?.error_description || error.message };
        }
    }

    async getUserMedia(accessToken: string, paging?: InstagramPaging): Promise<SocialAuthResponse<any>> {
        try {
            const url = new URL(this.config.userMediaEndpoint);
            url.searchParams.set('access_token', accessToken);
            if (paging && paging?.before) url.searchParams.set('before', paging.before);
            if (paging && paging?.after) url.searchParams.set('after', paging.after);
            if (paging && paging?.next) url.searchParams.set('next', paging.next);

            const { data } = await axios.get(url.toString());
            if (data) return { status: true, data: data };

            return { status: false, error: "unable to retrieve user media" };
        } catch (error: any) {
            return { status: false, error: error.response?.data?.error_description || error.message };
        }
    }
}
