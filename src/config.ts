import dotenv from 'dotenv';

dotenv.config();

export const config = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || '',
    tokenEndpoint: process.env.GOOGLE_TOKEN_ENDPOINT || 'https://oauth2.googleapis.com/token',
    userInfoEndpoint: process.env.GOOGLE_USER_INFO_ENDPOINT || 'https://www.googleapis.com/oauth2/v3/userinfo',
    authUrl: 'https://accounts.google.com/o/oauth2/auth',
  },
  facebook: {
    clientId: process.env.FACEBOOK_APP_ID || '',
    clientSecret: process.env.FACEBOOK_APP_SECRET || '',
    redirectUri: process.env.FACEBOOK_REDIRECT_URI || '',
    tokenEndpoint: process.env.FACEBOOK_TOKEN_ENDPOINT || 'https://graph.facebook.com/v9.0/oauth/access_token',
    userInfoEndpoint: process.env.FACEBOOK_USER_INFO_ENDPOINT || 'https://graph.facebook.com/me?fields=id,name,email',
    authUrl: 'https://www.facebook.com/v9.0/dialog/oauth',
  }
};
