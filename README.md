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
import { SocialAuthService } from 'social-auth';
import { AuthType } from 'social-auth/enums/auth-type.enum';
import { config } from 'social-auth/config';
import dotenv from 'dotenv';

dotenv.config();

const authService = new SocialAuthService(config.google, config.facebook);

async function authenticateWithGoogle(code: string) {
  try {
    const response = await authService.exchangeCodeForToken(AuthType.GOOGLE, code);
    if (response.status) {
      const userData = await authService.getUserData(AuthType.GOOGLE, response.data!);
      console.log(userData);
    } else {
      console.error(response.error);
    }
  } catch (error) {
    console.error(`Google authentication failed: ${error.message}`);
  }
}

async function authenticateWithFacebook(code: string) {
  try {
    const response = await authService.exchangeCodeForToken(AuthType.FACEBOOK, code);
    if (response.status) {
      const userData = await authService.getUserData(AuthType.FACEBOOK, response.data!);
      console.log(userData);
    } else {
      console.error(response.error);
    }
  } catch (error) {
    console.error(`Facebook authentication failed: ${error.message}`);
  }
}

async function refreshGoogleToken(refreshToken: string) {
  try {
    const response = await authService.refreshAccessToken(AuthType.GOOGLE, refreshToken);
    if (response.status) {
      console.log(`New Google Access Token: ${response.data}`);
    } else {
      console.error(response.error);
    }
  } catch (error) {
    console.error(`Google token refresh failed: ${error.message}`);
  }
}

async function authenticateWithPassword(authType: AuthType, username: string, password: string) {
  try {
    const response = await authService.exchangePasswordForToken(authType, username, password);
    if (response.status) {
      console.log(`Access Token: ${response.data}`);
    } else {
      console.error(response.error);
    }
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

    
`exchangeCodeForToken(authType: AuthType, code: string, additionalParams?: Record<string, string>): Promise<SocialAuthResponse<string>>`
Exchanges an authorization code for an access token.

Parameters:
    `authType` (`AuthType`): The type of authentication (e.g., `AuthType.GOOGLE`, `AuthType.FACEBOOK`).
    `code` (`string`): The authorization code received from the authentication provider.
    `additionalParams` (`Record<string, string>`, optional): Additional parameters for the token exchange request.
Returns:
    `Promise<SocialAuthResponse<string>>`: A promise that resolves to the `SocialAuthResponse` containing the access token.


`refreshAccessToken(authType: AuthType, refreshToken: string): Promise<SocialAuthResponse<string>>`
Refreshes an access token using a refresh token.

Parameters:
    `authType` (`AuthType`): The type of authentication (e.g., `AuthType.GOOGLE`, `AuthType.FACEBOOK`).
    `refreshToken` (`string`): The refresh token received from the authentication provider.
Returns:
    `Promise<SocialAuthResponse<string>>`: A promise that resolves to the `SocialAuthResponse` containing the new access token.


`exchangePasswordForToken(authType: AuthType, username: string, password: string): Promise<SocialAuthResponse<string>>`
Exchanges a username and password for an access token.

Parameters:
    `authType` (`AuthType`): The type of authentication (e.g., `AuthType.GOOGLE`, `AuthType.FACEBOOK`).
    `username` (`string`): The username.
    `password` (`string`): The password.
Returns:
    `Promise<SocialAuthResponse<string>>`: A promise that resolves to the `SocialAuthResponse` containing the access token.



`getUserData(authType: AuthType, accessToken: string, accessTokenSecret?: string): Promise<SocialAuthResponse<ISocialUser>>`
Retrieves user data for the specified authentication type using the access token.

Parameters:
    `authType` (`AuthType`): The type of authentication (e.g., `AuthType.GOOGLE`, `AuthType.FACEBOOK`).
    `accessToken` (`string`): The access token received from the authentication provider.

Returns:
    `Promise<SocialAuthResponse<ISocialUser>>`: A promise that resolves to the `SocialAuthResponse` containing the user data.


### Example:

```typescript
async function getGoogleUserData(accessToken: string) {
  try {
    const response = await authService.getUserData(AuthType.GOOGLE, accessToken);
    if (response.status) {
      console.log(`Google User Data: ${JSON.stringify(response.data)}`);
    } else {
      console.error(response.error);
    }
  } catch (error) {
    console.error(`Failed to get user data: ${error.message}`);
  }
}

async function getFacebookUserData(accessToken: string) {
  try {
    const response = await authService.getUserData(AuthType.FACEBOOK, accessToken);
    if (response.status) {
      console.log(`Facebook User Data: ${JSON.stringify(response.data)}`);
    } else {
      console.error(response.error);
    }
  } catch (error) {
    console.error(`Failed to get user data: ${error.message}`);
  }
}

```

### End