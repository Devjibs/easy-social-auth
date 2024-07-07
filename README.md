# Social Auth

A flexible, standalone package for social authentication using Google and Facebook.

## Installation

```bash
npm install social-auth
```

## Usage
Environment Variables

```env
npm install social-auth
Create a .env file with the following variables:

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
import { config } from 'social-auth/config';
import dotenv from 'dotenv';

dotenv.config();

const authService = new AuthService(config.google, config.facebook, config.twitter);

async function authenticateWithGoogle(code: string) {
  try {
    const user = await authService.authenticate(AuthType.GOOGLE, code);
    console.log(user);
  } catch (error) {
    console.error(error);
  }
}

async function authenticateWithFacebook(code: string) {
  try {
    const user = await authService.authenticate(AuthType.FACEBOOK, code);
    console.log(user);
  } catch (error) {
    console.error(error);
  }
}
```


## API
generateAuthUrl(authType: AuthType, state?: string, scope?: string): string
Generates the authorization URL for the specified authentication type.

exchangeCodeForToken(authType: AuthType, code: string, verifier?: string): Promise<string>
Exchanges an authorization code for an access token.

getUserData(authType: AuthType, accessToken: string, accessTokenSecret?: string): Promise<SocialUser>
Retrieves user data for the specified authentication type using the access token.

License
MIT