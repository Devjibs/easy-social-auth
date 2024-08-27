import { IFacebookConfig, IGoogleConfig, ISpotifyConfig, ITwitterConfig } from './interfaces/config.interface';

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
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID || '',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
    tokenEndpoint: process.env.TWITTER_TOKEN_ENDPOINT || 'https://accounts.spotify.com/api/token',
    userInfoEndpoint: process.env.TWITTER_USER_INFO_ENDPOINT || 'https://api.spotify.com/v1/me',
    authUrl: 'https://accounts.spotify.com/authorize',
  } as ISpotifyConfig
};
