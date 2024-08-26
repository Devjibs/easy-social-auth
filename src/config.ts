import { IFacebookConfig, IGoogleConfig, IInstagramConfig, ITwitterConfig } from './interfaces/config.interface';

export const config = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    tokenEndpoint: process.env.GOOGLE_TOKEN_ENDPOINT || 'https://oauth2.googleapis.com/token',
    userInfoEndpoint: process.env.GOOGLE_USER_INFO_ENDPOINT || 'https://www.googleapis.com/oauth2/v3/userinfo',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  } as IGoogleConfig,
  facebook: {
    clientId: process.env.FACEBOOK_APP_ID || '',
    clientSecret: process.env.FACEBOOK_APP_SECRET || '',
    tokenEndpoint: process.env.FACEBOOK_TOKEN_ENDPOINT || 'https://graph.facebook.com/v9.0/oauth/access_token',
    userInfoEndpoint: process.env.FACEBOOK_USER_INFO_ENDPOINT || 'https://graph.facebook.com/me?fields=id,name,email',
    authUrl: 'https://www.facebook.com/v9.0/dialog/oauth',
  } as IFacebookConfig,
  twitter: {
    clientId: process.env.TWITTER_CONSUMER_KEY || '',
    clientSecret: process.env.TWITTER_CONSUMER_SECRET || '',
    tokenEndpoint: process.env.TWITTER_TOKEN_ENDPOINT || 'https://api.twitter.com/oauth2/token',
    userInfoEndpoint: process.env.TWITTER_USER_INFO_ENDPOINT || 'https://api.twitter.com/2/account/verify_credentials.json',
    authUrl: 'https://api.twitter.com/oauth2/authorize',
  } as ITwitterConfig,
  instagram: {
    clientId: process.env.INSTAGRAM_CLIENT_ID || '',
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || '',
    tokenEndpoint: process.env.INSTAGRAM_ACCESS_TOKEN_URL || 'https://api.instagram.com/oauth/access_token',
    longLivedTokenEndpoint: process.env.INSTAGRAM_LONG_LIVED_ACCESS_TOKEN_URL || 'https://graph.instagram.com/access_token',
    refreshTokenEndpoint: process.env.INSTAGRAM_REFRESH_TOKEN_URL || 'https://graph.instagram.com/refresh_access_token',
    userInfoEndpoint: process.env.INSTAGRAM_USER_INFO_ENDPOINT || 'https://graph.instagram.com/me?fields=id,username,account_type',
    userMediaEndpoint: process.env.INSTAGRAM_USER_MEDIA_ENDPOINT || 'https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption',
    authUrl: 'https://api.instagram.com/oauth/authorize'
  } as IInstagramConfig
};