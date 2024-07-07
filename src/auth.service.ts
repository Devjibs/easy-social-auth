import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { ISocialUser } from './interfaces/social-user.interface';
import { AuthType } from './enums/auth-type.enum';
import { IGoogleConfig, IFacebookConfig } from './interfaces/config.interface';

export class AuthService {
  private googleStrategy?: GoogleStrategy;
  private facebookStrategy?: FacebookStrategy;

  constructor(
    googleConfig?: IGoogleConfig,
    facebookConfig?: IFacebookConfig
  ) {
    if (googleConfig) {
      this.googleStrategy = new GoogleStrategy(googleConfig);
    }
    if (facebookConfig) {
      this.facebookStrategy = new FacebookStrategy(facebookConfig);
    }
  }

  generateAuthUrl(authType: AuthType, state?: string, scope?: string): string {
    switch (authType) {
      case AuthType.GOOGLE:
        if (!this.googleStrategy) throw new Error('Google strategy not configured');
        return this.googleStrategy.generateAuthUrl(state, scope);
      case AuthType.FACEBOOK:
        if (!this.facebookStrategy) throw new Error('Facebook strategy not configured');
        return this.facebookStrategy.generateAuthUrl(state, scope);
      default:
        throw new Error('Unsupported authentication type');
    }
  }

  async exchangeCodeForToken(authType: AuthType, code: string): Promise<string> {
    switch (authType) {
      case AuthType.GOOGLE:
        if (!this.googleStrategy) throw new Error('Google strategy not configured');
        return this.googleStrategy.exchangeCodeForToken(code);
      case AuthType.FACEBOOK:
        if (!this.facebookStrategy) throw new Error('Facebook strategy not configured');
        return this.facebookStrategy.exchangeCodeForToken(code);
      default:
        throw new Error('Unsupported authentication type');
    }
  }

  async getUserData(authType: AuthType, accessToken: string): Promise<ISocialUser> {
    switch (authType) {
      case AuthType.GOOGLE:
        if (!this.googleStrategy) throw new Error('Google strategy not configured');
        return this.googleStrategy.getUserData(accessToken);
      case AuthType.FACEBOOK:
        if (!this.facebookStrategy) throw new Error('Facebook strategy not configured');
        return this.facebookStrategy.getUserData(accessToken);
      default:
        throw new Error('Unsupported authentication type');
    }
  }
}
