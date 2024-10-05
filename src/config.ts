import {
  IFacebookConfig,
  IGoogleConfig,
  ISpotifyConfig,
  IInstagramConfig,
  ITiktokConfig,
  ITwitterConfig,
  ILinkedinConfig,
} from "./interfaces/config.interface";

export const config = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    tokenEndpoint:
      process.env.GOOGLE_TOKEN_ENDPOINT ||
      "https://oauth2.googleapis.com/token",
    userInfoEndpoint:
      process.env.GOOGLE_USER_INFO_ENDPOINT ||
      "https://www.googleapis.com/oauth2/v3/userinfo",
    authUrl:
      process.env.GOOGLE_AUTH_URL ||
      "https://accounts.google.com/o/oauth2/v2/auth",
  } as IGoogleConfig,
  facebook: {
    clientId: process.env.FACEBOOK_APP_ID || "",
    clientSecret: process.env.FACEBOOK_APP_SECRET || "",
    tokenEndpoint:
      process.env.FACEBOOK_TOKEN_ENDPOINT ||
      "https://graph.facebook.com/v9.0/oauth/access_token",
    userInfoEndpoint:
      process.env.FACEBOOK_USER_INFO_ENDPOINT ||
      "https://graph.facebook.com/me?fields=id,name,email",
    authUrl:
      process.env.FACEBOOK_AUTH_URL ||
      "https://www.facebook.com/v9.0/dialog/oauth",
  } as IFacebookConfig,
  twitter: {
    clientId: process.env.TWITTER_CONSUMER_KEY || "",
    clientSecret: process.env.TWITTER_CONSUMER_SECRET || "",
    tokenEndpoint:
      process.env.TWITTER_TOKEN_ENDPOINT ||
      "https://api.twitter.com/oauth2/token",
    userInfoEndpoint:
      process.env.TWITTER_USER_INFO_ENDPOINT ||
      "https://api.twitter.com/2/account/verify_credentials.json",
    authUrl:
      process.env.TWITTER_AUTH_URL ||
      "https://api.twitter.com/oauth2/authorize",
  } as ITwitterConfig,
  instagram: {
    clientId: process.env.INSTAGRAM_CLIENT_ID || "",
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || "",
    tokenEndpoint:
      process.env.INSTAGRAM_ACCESS_TOKEN_URL ||
      "https://api.instagram.com/oauth/access_token",
    longLivedTokenEndpoint:
      process.env.INSTAGRAM_LONG_LIVED_ACCESS_TOKEN_URL ||
      "https://graph.instagram.com/access_token",
    refreshTokenEndpoint:
      process.env.INSTAGRAM_REFRESH_TOKEN_URL ||
      "https://graph.instagram.com/refresh_access_token",
    userInfoEndpoint:
      process.env.INSTAGRAM_USER_INFO_ENDPOINT ||
      "https://graph.instagram.com/me?fields=id,username,account_type",
    authUrl:
      process.env.INSTAGRAM_AUTH_URL ||
      "https://api.instagram.com/oauth/authorize",
  } as IInstagramConfig,
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID || "",
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
    tokenEndpoint:
      process.env.SPOTIFY_TOKEN_ENDPOINT ||
      "https://accounts.spotify.com/api/token",
    userInfoEndpoint:
      process.env.SPOTIFY_USER_INFO_ENDPOINT || "https://api.spotify.com/v1/me",
    authUrl:
      process.env.SPOTIFY_AUTH_URL || "https://accounts.spotify.com/authorize",
  } as ISpotifyConfig,
  tiktok: {
    clientId: process.env.TIKTOK_CLIENT_KEY || "",
    clientSecret: process.env.TIKTOK_CLIENT_SECRET || "",
    tokenEndpoint:
      process.env.TIKTOK_TOKEN_ENDPOINT ||
      "https://open.tiktokapis.com/v2/oauth/token/",
    userInfoEndpoint:
      process.env.TIKTOK_USER_INFO_ENDPOINT ||
      "https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name",
    authUrl:
      process.env.TIKTOK_AUTH_URL ||
      "https://www.tiktok.com/v2/auth/authorize/",
  } as ITiktokConfig,
  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_KEY || "",
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
    tokenEndpoint:
      process.env.LINKEDIN_TOKEN_ENDPOINT ||
      "https://www.linkedin.com/oauth/v2/accessToken",
    userInfoEndpoint:
      process.env.LINKEDIN_USER_INFO_ENDPOINT ||
      "https://api.linkedin.com/v2/me",
    authUrl:
      process.env.LINKEDIN_AUTH_URL ||
      "https://www.linkedin.com/oauth/v2/authorization",
  } as ILinkedinConfig,
};
