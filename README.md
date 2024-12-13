# Easy Social Auth

[![npm version](https://img.shields.io/npm/v/easy-social-auth)](https://www.npmjs.com/package/easy-social-auth)
[![npm downloads](https://img.shields.io/npm/dm/easy-social-auth)](https://www.npmjs.com/package/easy-social-auth)
[![GitHub issues](https://img.shields.io/github/issues/devjibs/easy-social-auth)](https://github.com/devjibs/easy-social-auth/issues)
[![GitHub stars](https://img.shields.io/github/stars/devjibs/easy-social-auth)](https://github.com/devjibs/easy-social-auth/stargazers)

## Supported Social Authentication Providers

<p align="left">
  <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google Logo" width="40" height="40">
  <img src="https://img.icons8.com/color/48/000000/facebook-new.png" alt="Facebook Logo" width="40" height="40">
  <img src="https://img.icons8.com/ios-filled/50/000000/x.png" alt="X Logo" width="40" height="35">
  <img src="https://img.icons8.com/fluency/48/000000/instagram-new.png" alt="Instagram Logo" width="40" height="40">
  <img src="https://img.icons8.com/fluency/48/000000/tiktok.png" alt="TikTok Logo" width="40" height="40">
  <img src="https://img.icons8.com/fluency/48/000000/spotify.png" alt="Spotify Logo" width="40" height="40">
  <img src="https://img.icons8.com/color/48/linkedin.png" alt="LinkedIn Logo" width="40" height="40">
</p>

A flexible, standalone package for social authentication using Google, Facebook, Instagram, Tiktok, Spotify, LinkedIn, and Twitter(X).

## Installation

```bash
npm install easy-social-auth
```

## Usage

Environment Variables

### Setup and Configuration
To get started, configure your environment variables. Each platform requires specific client IDs, secrets, and endpoints. Below is a template for the .env file:

```env

GOOGLE_AUTH_URL=https://google-auth-url
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_TOKEN_ENDPOINT=https://oauth2.googleapis.com/token
GOOGLE_USER_INFO_ENDPOINT=https://www.googleapis.com/oauth2/v2/userinfo

FACEBOOK_AUTH_URL=facebook-auth-url
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_TOKEN_ENDPOINT=https://graph.facebook.com/v9.0/oauth/access_token
FACEBOOK_USER_INFO_ENDPOINT=https://graph.facebook.com/me?fields=id,name,email

TWITTER_AUTH_URL=twitter-auth-url
TWITTER_CLIENT_ID=your-twitter-client-key
TWITTER_CLIENT_SECRET=your-twitter-client-secret
TWITTER_TOKEN_ENDPOINT=https://api.twitter.com/oauth2/token
TWITTER_USER_INFO_ENDPOINT=https://api.x.com/2/users/me
TWITTER_AUTH_URL=https://api.twitter.com/oauth2/authorize
TWITTER_REVOKE_ACCESS_URL=https://api.x.com/2/oauth2/revoke
OAUTH_1_0_ACCESS_TOKEN_URL=https://api.x.com/oauth/access_token
OAUTH_1_0_REQUEST_TOKEN_URL=https://api.x.com/oauth/request_token
TWITTER_OAUTH_1_0_URL=https://api.x.com/oauth/authorize
TWITTER_CONSUMER_KEY=your-consumer-key
TWITTER_CONSUMER_SECRET=your-consumer-secret

INSTAGRAM_AUTH_URL=instagram-auth-url
INSTAGRAM_CLIENT_ID=your-instagram-client-id
INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret
INSTAGRAM_ACCESS_TOKEN_URL=https://api.instagram.com/oauth/access_token
INSTAGRAM_LONG_LIVED_ACCESS_TOKEN_URL=https://graph.instagram.com/access_token
INSTAGRAM_REFRESH_TOKEN_URL=https://graph.instagram.com/refresh_access_token
INSTAGRAM_USER_INFO_ENDPOINT=https://graph.instagram.com/me?fields=id,username,account_type

SPOTIFY_AUTH_URL=spotify-auth-url
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
SPOTIFY_TOKEN_ENDPOINT=https://accounts.spotify.com/api/token
SPOTIFY_USER_INFO_ENDPOINT=https://api.spotify.com/v1/me

TIKTOK_AUTH_URL=tiktok-auth-url
TIKTOK_CLIENT_KEY=your-tiktok-client-key,
TIKTOK_CLIENT_SECRET=your-tiktok-client-secret
TIKTOK_TOKEN_ENDPOINT=https://open.tiktokapis.com/v2/oauth/token/
TIKTOK_USER_INFO_ENDPOINT=https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name

LINKEDIN_AUTH_URL=https://www.linkedin.com/oauth/v2/authorization
LINKEDIN_CLIENT_KEY=your-linkedin-client-key
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_TOKEN_ENDPOINT=https://www.linkedin.com/oauth/v2/accessToken
LINKEDIN_USER_INFO_ENDPOINT=https://api.linkedin.com/v2/userinfo
```
**Note: Ensure your redirect URIs are registered in the respective developer consoles.**

## Example

Usage
1. Initialize a Strategy
Import and configure a strategy with the required provider credentials:
```typescript
import { GoogleStrategy } from "easy-social-auth";

const googleStrategy = new GoogleStrategy({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authUrl: process.env.GOOGLE_AUTH_URL,
  tokenEndpoint: process.env.GOOGLE_TOKEN_ENDPOINT,
  userInfoEndpoint: process.env.GOOGLE_USER_INFO_ENDPOINT,
});

const authUrl = googleStrategy.generateAuthUrl("http://localhost:3000/auth/google");
console.log("Google Auth URL:", authUrl);
```

2. Exchange Code for Token
After the user is redirected back to your app:

```typescript
const tokenResponse = await googleStrategy.exchangeCodeForToken("code", "http://localhost:3000/auth/google");
if (tokenResponse.status) {
  console.log("Access Token:", tokenResponse.data);
}
```
3. Fetch User Data
Retrieve user information using the access token:

```typescript
const userData = await googleStrategy.getUserData(tokenResponse.data!);
if (userData.status) {
  console.log("User Data:", userData.data);
}
```
### Examples for each strategy

#### Google
```typescript
import { SocialAuthService } from 'easy-social-auth';

const socialAuthServiceGoogle = new SocialAuthService();

// Generate Auth URL
const googleAuthUrl = socialAuthServiceGoogle.googleStrategy.generateAuthUrl("http://localhost:3000/auth/google");
console.log("Google Auth URL:", googleAuthUrl);

// Exchange Code for Token
const googleTokenResponse = await socialAuthServiceGoogle.googleStrategy.exchangeCodeForToken("auth_code", "http://localhost:3000/auth/google");
console.log("Google Token Response:", googleTokenResponse);

// Fetch User Data
if (googleTokenResponse.status) {
  const userData = await googleStrategy.getUserData(googleTokenResponse.data!);
  console.log("Google User Data:", userData);
}
```

#### Facebook
```typescript
import { SocialAuthService } from 'easy-social-auth';

const socialAuthServiceFacebook = new SocialAuthService();

// Generate Auth URL
const facebookAuthUrl = socialAuthServiceFacebook.facebookStrategy.generateAuthUrl("http://localhost:3000/auth/facebook");
console.log("Facebook Auth URL:", facebookAuthUrl);

// Exchange Code for Token
const facebookTokenResponse = await socialAuthServiceFacebook.facebookStrategy.exchangeCodeForToken("auth_code", "http://localhost:3000/auth/facebook");
console.log("Facebook Token Response:", facebookTokenResponse);

// Fetch User Data
if (facebookTokenResponse.status) {
  const userData = await facebookStrategy.getUserData(facebookTokenResponse.data!);
  console.log("facebook User Data:", userData);
}
```
#### Instagram
```typescript
import { SocialAuthService } from 'easy-social-auth';

const socialAuthServiceInstagram = new SocialAuthService();

// Generate Auth URL
const instagramAuthUrl = socialAuthServiceInstagram.instagramStrategy.generateAuthUrl("http://localhost:3000/auth/instagram");
console.log("instagram Auth URL:", instagramAuthUrl);

// Exchange Code for Token
const instagramTokenResponse = await socialAuthServiceInstagram.instagramStrategy.exchangeCodeForToken("auth_code", "http://localhost:3000/auth/instagram");
console.log("Instagram Token Response:", instagramTokenResponse);

// Exchange token for long lined token
const instagramLongLivedTokenResponse = await socialAuthServiceInstagram.instagramStrategy.exchangeTokenforLongLivedToken(instagramTokenResponse.data);
console.log("Instagram Token Response:", instagramLongLivedTokenResponse);

// Refresh Access Token
const refreshedInstagramToken = await socialAuthServiceInstagram.instagramStrategy.refreshAccessToken(instagramTokenResponse.data);
console.log("Instagram Refresh Token Response:", instagramRefreshedToken);

// Fetch User Data
if (instagramTokenResponse.status) {
  const userData = await instagramStrategy.getUserData(instagramTokenResponse.data!);
  console.log("Instagram User Data:", userData);
}
```

#### LinkedIn
```typescript
import { SocialAuthService } from 'easy-social-auth';

const socialAuthServiceLinkedIn = new SocialAuthService();

// Generate Auth URL
const linkedinAuthUrl = socialAuthServiceLinkedin.linkedinStrategy.generateAuthUrl("http://localhost:3000/auth/linkedin");
console.log("Linkedin Auth URL:", linkedinAuthUrl);

// Exchange Code for Token
const linkedinTokenResponse = await socialAuthServiceLinkedin.linkedinStrategy.exchangeCodeForToken("auth_code", "http://localhost:3000/auth/linkedin");
console.log("Linkedin Token Response:", linkedinTokenResponse);

// Request App Token
const linkedinAppToken = await socialAuthServiceLinkedin.linkedinStrategy.requestAppToken();
console.log("Linkedin App Token Response:", linkedinAppToken);

// Fetch User Data
if (linkedinTokenResponse.status) {
  const userData = await linkedinStrategy.getUserData(linkedinTokenResponse.data!);
  console.log("Linkedin User Data:", userData);
}
```

#### Spotify
```typescript
import { SocialAuthService } from 'easy-social-auth';

const socialAuthServiceSpotify = new SocialAuthService();

// Generate Auth URL
const spotifyAuthUrl = socialAuthServiceSpotify.spotifyStrategy.generateAuthUrl("http://localhost:3000/auth/spotify");
console.log("Spotify Auth URL:", spotifyAuthUrl);

// Exchange Code for Token
const spotifyTokenResponse = await socialAuthServiceSpotify.spotifyStrategy.exchangeCodeForToken("auth_code", "http://localhost:3000/auth/spotify");
console.log("Spotify Token Response:", spotifyTokenResponse);

// Refresh Access Token
const refreshedSpotifyToken = await socialAuthServiceSpotify.spotifyStrategy.refreshAccessToken(spotifyTokenResponse.data.refreshToken);
console.log("Spotify Refresh Token Response:", spotifyRefreshedToken);

// Fetch User Data
if (spotifyTokenResponse.status) {
  const userData = await spotifyStrategy.getUserData(spotifyTokenResponse.data!);
  console.log("Spotify User Data:", userData);
}
```

#### Tiktok
```typescript
import { SocialAuthService } from 'easy-social-auth';

const socialAuthServiceTiktok = new SocialAuthService();

// Generate Auth URL
const tiktokAuthUrl = socialAuthServiceTiktok.tiktokStrategy.generateAuthUrl("http://localhost:3000/auth/tiktok");
console.log("Tiktok Auth URL:", tiktokAuthUrl);

// Exchange Code for Token
const tiktokTokenResponse = await socialAuthServiceTiktok.tiktokStrategy.exchangeCodeForToken("auth_code", "http://localhost:3000/auth/tiktok");
console.log("Tiktok Token Response:", tiktokTokenResponse);

// Refresh Access Token
const refreshedTiktokToken = await socialAuthServiceTiktok.tiktokStrategy.refreshAccessToken(tiktokTokenResponse.data.refreshToken);
console.log("Tiktok Refresh Token Response:", tiktokRefreshedToken);

// Fetch User Data
if (tiktokTokenResponse.status) {
  const userData = await tiktokStrategy.getUserData(tiktokTokenResponse.data!);
  console.log("Tiktok User Data:", userData);
}
```

#### Twitter
```typescript
import { SocialAuthService } from 'easy-social-auth';

const socialAuthServiceTwitter = new SocialAuthService();

// Generate Auth URL
const twitterAuthUrl = socialAuthServiceTwitter.twitterStrategy.generateAuthUrl("http://localhost:3000/auth/twitter");
console.log("Twitter Auth URL:", twitterAuthUrl);

// Exchange Code for Token
const twitterTokenResponse = await socialAuthServiceTwitter.twitterStrategy.exchangeCodeForToken("auth_code", "http://localhost:3000/auth/twitter");
console.log("Twitter Token Response:", twitterTokenResponse);

// Refresh Access Token
const refreshedTwitterToken = await socialAuthServiceTwitter.twitterStrategy.refreshAccessToken(twitterTokenResponse.data.refreshToken);
console.log("Twitter Refresh Token Response:", twitterRefreshedToken);

// Request App Token
const twitterAppToken = await socialAuthServiceTwitter.twitterStrategy.requestAppToken(
  "scope",
  "client_type (optional)",
);
console.log("Twitter App Token Response:", twitterAppToken);

// Revoke Access Token
const revokeTwitterTokenResponse = await socialAuthServiceTwitter.twitterStrategy.revokeToken(
  "token",
  "token_type_hint (optional (refresh_token || access_token))",
);
console.log("Twitter Revoke Token Response:", revokeTwitterTokenResponse);

// Fetch User Data
if (twitterTokenResponse.status) {
  const userData = await twitterStrategy.getUserData(twitterTokenResponse.data!);
  console.log("Twitter User Data:", userData);
}
```

### Example with Multiple Strategies

```typescript
import { GoogleStrategy, FacebookStrategy } from "easy-social-auth";

const googleStrategy = new GoogleStrategy({...});
const facebookStrategy = new FacebookStrategy({...});

// Authenticate with Google
const googleAuthUrl = googleStrategy.generateAuthUrl("http://localhost:3000/auth/google");
console.log("Google Auth URL:", googleAuthUrl);

// Authenticate with Facebook
const fbAuthUrl = facebookStrategy.generateAuthUrl("http://localhost:3000/auth/facebook");
console.log("Facebook Auth URL:", fbAuthUrl);
```

### Example with Custom Config

```typescript
import { LinkedinStrategy, ILinkedinConfig } from "easy-social-auth";

const customConfig: ILinkedinConfig = {
  clientId: YOUR_LINKEDIN_CLIENT_ID,
  clientSecret: YOUR_LINKEDIN_CLIENT_SECRET,
  tokenEndpoint: "https://www.linkedin.com/oauth/v2/accessToken",
  userInfoEndpoint: "https://api.linkedin.com/v2/userinfo",
  authUrl: "https://www.linkedin.com/oauth/v2/authorization",
} 

linkedinStrategy = new LinkedinStrategy(customConfig);
// Generate Auth URL
const linkedinAuthUrl = linkedinStrategy.generateAuthUrl("http://localhost:3000/auth/linkedin");
console.log("Linkedin Auth URL:", linkedinAuthUrl);

// Exchange Code for Token
const linkedinTokenResponse = await linkedinStrategy.exchangeCodeForToken("auth_code", "http://localhost:3000/auth/linkedin");
console.log("Linkedin Token Response:", linkedinTokenResponse);

// Request App Token
const linkedinAppToken = await linkedinStrategy.requestAppToken();
console.log("Linkedin App Token Response:", linkedinAppToken);

// Fetch User Data
if (linkedinTokenResponse.status) {
  const userData = await linkedinStrategy.getUserData(linkedinTokenResponse.data!);
  console.log("Linkedin User Data:", userData);
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

### Troubleshooting
Invalid Redirect URI: Ensure the redirect URI matches the one configured in the provider console.
Token Errors: Verify the client ID, secret, and token endpoint.

### Contributing
Feel free to open issues or contribute improvements via pull requests on GitHub.

### End