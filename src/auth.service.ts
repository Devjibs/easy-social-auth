import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { AuthType } from './enums/auth-type.enum';
import { IGoogleConfig, IFacebookConfig } from './interfaces/config.interface';
import { ISocialUser } from './interfaces/social-user.interface';

export class AuthService {
  private googleStrategy: GoogleStrategy;
  private facebookStrategy: FacebookStrategy;

  constructor(googleConfig: IGoogleConfig, facebookConfig: IFacebookConfig) {
    this.googleStrategy = new GoogleStrategy(googleConfig);
    this.facebookStrategy = new FacebookStrategy(facebookConfig);
  }

  generateAuthUrl(authType: AuthType, state?: string, scope?: string): string {
    switch (authType) {
      case AuthType.GOOGLE:
        return this.googleStrategy.generateAuthUrl(state, scope);
      case AuthType.FACEBOOK:
        return this.facebookStrategy.generateAuthUrl(state, scope);
      default:
        throw new Error('Unsupported auth type');
    }
  }

  exchangeCodeForToken(authType: AuthType, code: string, additionalParams?: Record<string, string>): Promise<string> {
    switch (authType) {
      case AuthType.GOOGLE:
        return this.googleStrategy.exchangeCodeForToken(code, additionalParams);
      case AuthType.FACEBOOK:
        return this.facebookStrategy.exchangeCodeForToken(code, additionalParams);
      default:
        throw new Error('Unsupported auth type');
    }
  }

  refreshAccessToken(authType: AuthType, refreshToken: string): Promise<string> {
    switch (authType) {
      case AuthType.GOOGLE:
        return this.googleStrategy.refreshAccessToken(refreshToken);
      case AuthType.FACEBOOK:
        return this.facebookStrategy.refreshAccessToken(refreshToken);
      default:
        throw new Error('Unsupported auth type');
    }
  }

  exchangePasswordForToken(authType: AuthType, username: string, password: string): Promise<string> {
    switch (authType) {
      case AuthType.GOOGLE:
        return this.googleStrategy.exchangePasswordForToken(username, password);
      case AuthType.FACEBOOK:
        return this.facebookStrategy.exchangePasswordForToken(username, password);
      default:
        throw new Error('Unsupported auth type');
    }
  }

  getUserData(authType: AuthType, accessToken: string, accessTokenSecret?: string): Promise<ISocialUser> {
    switch (authType) {
      case AuthType.GOOGLE:
        return this.googleStrategy.getUserData(accessToken);
      case AuthType.FACEBOOK:
        return this.facebookStrategy.getUserData(accessToken);
      default:
        throw new Error('Unsupported auth type');
    }
  }
}
