# Easy Social Auth

[![npm version](https://img.shields.io/npm/v/easy-social-auth)](https://www.npmjs.com/package/easy-social-auth)
[![npm downloads](https://img.shields.io/npm/dm/easy-social-auth)](https://www.npmjs.com/package/easy-social-auth)
[![GitHub issues](https://img.shields.io/github/issues/devjibs/easy-social-auth)](https://github.com/devjibs/easy-social-auth/issues)
[![GitHub stars](https://img.shields.io/github/stars/devjibs/easy-social-auth)](https://github.com/devjibs/easy-social-auth/stargazers)

A flexible, standalone package for social authentication using Google and Facebook.

## Installation

```bash
npm install easy-social-auth
```

## Usage
Environment Variables

### Create a .env file with the following variables:
```env

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_TOKEN_ENDPOINT=https://oauth2.googleapis.com/token
GOOGLE_USER_INFO_ENDPOINT=https://www.googleapis.com/oauth2/v2/userinfo

FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_TOKEN_ENDPOINT=https://graph.facebook.com/v9.0/oauth/access_token
FACEBOOK_USER_INFO_ENDPOINT=https://graph.facebook.com/me?fields=id,name,email

TWITTER_CONSUMER_KEY=your-twitter-consumer-key
TWITTER_CONSUMER_SECRET=your-twitter-consumer-secret
TWITTER_TOKEN_ENDPOINT=https://api.twitter.com/oauth2/token
TWITTER_USER_INFO_ENDPOINT=https://api.twitter.com/2/account/verify_credentials.json
TWITTER_AUTH_URL=https://api.twitter.com/oauth2/authorize
```

## Example

```typescript
import { SocialAuthService } from 'easy-social-auth';
import { IGoogleConfig, IFacebookConfig } from 'easy-social-auth/interfaces/config.interface';

// only the Google strategy will initialize if only it's env values are provided
const socialAuthService = new SocialAuthService();

if (socialAuthService.googleStrategy) {
  const googleAuthUrl = socialAuthService.googleStrategy.generateAuthUrl('your-google-redirect-uri');
  console.log('Google Auth URL:', googleAuthUrl);

  async function authenticateWithGoogle(code: string) {
    const tokenResponse = await socialAuthService.googleStrategy.exchangeCodeForToken(code, 'your-google-redirect-uri');
    if (tokenResponse.status) {
      const userData = await socialAuthService.googleStrategy.getUserData(tokenResponse.data!);
      console.log('Google User Data:', userData);
    } else {
      console.error('Google Token Exchange Error:', tokenResponse.error);
    }
  }
}

// only the Facebook strategy will initialize if only it's env values are provided
const socialAuthServiceFacebook = new SocialAuthService();

if (socialAuthServiceFacebook.facebookStrategy) {
  const facebookAuthUrl = socialAuthServiceFacebook.facebookStrategy.generateAuthUrl('your-facebook-redirect-uri');
  console.log('Facebook Auth URL:', facebookAuthUrl);

  async function authenticateWithFacebook(code: string) {
    const tokenResponse = await socialAuthServiceFacebook.facebookStrategy.exchangeCodeForToken(code, 'your-facebook-redirect-uri');
    if (tokenResponse.status) {
      const userData = await socialAuthServiceFacebook.facebookStrategy.getUserData(tokenResponse.data!);
      console.log('Facebook User Data:', userData);
    } else {
      console.error('Facebook Token Exchange Error:', tokenResponse.error);
    }
  }
}

// only the Twitter strategy will initialize if only its env values are provided
const socialAuthServiceTwitter = new SocialAuthService();

if (socialAuthServiceTwitter.twitterStrategy) {
  const twitterAuthUrl = socialAuthServiceTwitter.twitterStrategy.generateAuthUrl('your-twitter-redirect-uri');
  console.log('Twitter Auth URL:', twitterAuthUrl);

  async function authenticateWithTwitter() {
    const tokenResponse = await socialAuthServiceTwitter.twitterStrategy.requestToken();
    if (tokenResponse.status) {
      const userData = await socialAuthServiceTwitter.twitterStrategy.getUserData(tokenResponse.data!);
      console.log('Twitter User Data:', userData);
    } else {
      console.error('Twitter Token Request Error:', tokenResponse.error);
    }
  }
}

```


## API
### Generate Auth Url
`generateAuthUrl(redirectUri: string, scope?: string): string`
Generates the authorization URL for the specified authentication type.

Parameters:
    `redirectUri` (`string`): The redirect URI for the authentication.
    `scope` (`string`, optional): An optional scope parameter to include in the URL.

Returns:
    `string`: The generated authorization URL.


### Exchange Code for Token
`exchangeCodeForToken(code: string, redirectUri: string, additionalParams?: Record<string, string>): Promise<SocialAuthResponse<string>>`
Exchanges an authorization code for an access token.

Parameters:
    `code` (`string`): The authorization code received from the authentication provider.
    `redirectUri` (`string`): The redirect URI used in the authentication request.
    `additionalParams` (`Record<string, string>`, optional): Additional parameters for the token exchange request.

Returns:
    `Promise<SocialAuthResponse<string>>`: A promise that resolves to the `SocialAuthResponse` containing the access token.


### Refresh Access Token
`refreshAccessToken(refreshToken: string): Promise<SocialAuthResponse<string>>`
Refreshes an access token using a refresh token.

Parameters:
    `refreshToken` (`string`): The refresh token received from the authentication provider.

Returns:
    `Promise<SocialAuthResponse<string>>`: A promise that resolves to the `SocialAuthResponse` containing the new access token.


### Exchange Password for Token
`exchangePasswordForToken(username: string, password: string): Promise<SocialAuthResponse<string>>`
Exchanges a username and password for an access token.

Parameters:
    `username` (`string`): The username.
    `password` (`string`): The password.

Returns:
    `Promise<SocialAuthResponse<string>>`: A promise that resolves to the `SocialAuthResponse` containing the access token.


### Get User Data
`getUserData(accessToken: string): Promise<SocialAuthResponse<ISocialUser>>`
Retrieves user data for the specified authentication type using the access token.

Parameters:
    `accessToken` (`string`): The access token received from the authentication provider.

Returns:
    `Promise<SocialAuthResponse<ISocialUser>>`: A promise that resolves to the `SocialAuthResponse` containing the user data.



### End
