# Social Auth

A flexible, standalone package for social authentication using Google and Facebook.

## Installation

```bash
npm install social-auth
```

## Usage
Environment Variables

### Create a .env file with the following variables:
```env

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=your-google-redirect-uri
GOOGLE_TOKEN_ENDPOINT=https://oauth2.googleapis.com/token
GOOGLE_USER_INFO_ENDPOINT=https://www.googleapis.com/oauth2/v3/userinfo

FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_REDIRECT_URI=your-facebook-redirect-uri
FACEBOOK_TOKEN_ENDPOINT=https://graph.facebook.com/v9.0/oauth/access_token
FACEBOOK_USER_INFO_ENDPOINT=https://graph.facebook.com/me?fields=id,name,email
```

## Example

```typescript
import { AuthService } from 'social-auth';
import { AuthType } from 'social-auth/enums/auth-type.enum';
import { AuthService } from 'social-auth';
import { AuthType } from 'social-auth/enums/auth-type.enum';
import { config } from 'social-auth/config';
import dotenv from 'dotenv';

dotenv.config();

const authService = new AuthService(config.google, config.facebook);

async function authenticateWithGoogle(code: string) {
  try {
    const user = await authService.authenticate(AuthType.GOOGLE, code);
    console.log(user);
  } catch (error) {
    console.error(`Google authentication failed: ${error.message}`);
  }
}

async function authenticateWithFacebook(code: string) {
  try {
    const user = await authService.authenticate(AuthType.FACEBOOK, code);
    console.log(user);
  } catch (error) {
    console.error(`Facebook authentication failed: ${error.message}`);
  }
}

async function refreshGoogleToken(refreshToken: string) {
  try {
    const newToken = await authService.refreshAccessToken(AuthType.GOOGLE, refreshToken);
    console.log(`New Google Access Token: ${newToken}`);
  } catch (error) {
    console.error(`Google token refresh failed: ${error.message}`);
  }
}

async function authenticateWithPassword(authType: AuthType, username: string, password: string) {
  try {
    const token = await authService.exchangePasswordForToken(authType, username, password);
    console.log(`Access Token: ${token}`);
  } catch (error) {
    console.error(`${AuthType[authType]} password authentication failed: ${error.message}`);
  }
}

```


## API
`generateAuthUrl(authType: AuthType, state?: string, scope?: string): string`
Generates the authorization URL for the specified authentication type.

Parameters:
    `authType` (`AuthType`): The type of authentication (e.g., `AuthType.GOOGLE`, `AuthType.FACEBOOK`).
    `state` (`string`, optional): An optional state parameter to include in the URL.
    `scope` (`string`, optional): An optional scope parameter to include in the URL.
Returns:
    `string`: The generated authorization URL.

    
`exchangeCodeForToken(authType: AuthType, code: string, additionalParams?: Record<string, string>): Promise<string>`
Exchanges an authorization code for an access token.

Parameters:
    `authType` (`AuthType`): The type of authentication (e.g., `AuthType.GOOGLE`, `AuthType.FACEBOOK`).
    `code` (`string`): The authorization code received from the authentication provider.
    `additionalParams` (`Record<string, string>`, optional): Additional parameters for the token exchange request.
Returns:
    `Promise<string>`: A promise that resolves to the access token.


`refreshAccessToken(authType: AuthType, refreshToken: string): Promise<string>`
Refreshes an access token using a refresh token.

Parameters:
    `authType` (`AuthType`): The type of authentication (e.g., `AuthType.GOOGLE`, `AuthType.FACEBOOK`).
    `refreshToken` (`string`): The refresh token received from the authentication provider.
Returns:
    `Promise<string>`: A promise that resolves to the new access token.


`exchangePasswordForToken(authType: AuthType, username: string, password: string): Promise<string>`
Exchanges a username and password for an access token.

Parameters:
    `authType` (`AuthType`): The type of authentication (e.g., `AuthType.GOOGLE`, `AuthType.FACEBOOK`).
    `username` (`string`): The username.
    `password` (`string`): The password.
Returns:
    `Promise<string>`: A promise that resolves to the access token.



`getUserData(authType: AuthType, accessToken: string, accessTokenSecret?: string): Promise<ISocialUser>`
Retrieves user data for the specified authentication type using the access token.

Parameters:
    `authType` (`AuthType`): The type of authentication (e.g., `AuthType.GOOGLE`, `AuthType.FACEBOOK`).
    `accessToken` (`string`): The access token received from the authentication provider.

Returns:
    `Promise<ISocialUser>`: A promise that resolves to the user data.


### Example:

```typescript
async function getGoogleUserData(accessToken: string) {
  try {
    const userData = await authService.getUserData(AuthType.GOOGLE, accessToken);
    console.log(`Google User Data: ${JSON.stringify(userData)}`);
  } catch (error) {
    console.error(`Failed to get user data: ${error.message}`);
  }
}

async function getFacebookUserData(accessToken: string) {
  try {
    const userData = await authService.getUserData(AuthType.FACEBOOK, accessToken);
    console.log(`Facebook User Data: ${JSON.stringify(userData)}`);
  } catch (error) {
    console.error(`Failed to get user data: ${error.message}`);
  }
}
```

This documentation now includes the additional grant types (`refresh_token` and `password`) and examples on how to use them, ensuring the package is flexible and robust for various authentication scenarios.

