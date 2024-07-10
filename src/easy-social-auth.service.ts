import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { config } from './config';

export class SocialAuthService {
  public googleStrategy?: GoogleStrategy;
  public facebookStrategy?: FacebookStrategy;

  constructor() {
    if(config.google) this.googleStrategy = new GoogleStrategy(config.google);
    if(config.facebook)this.facebookStrategy = new FacebookStrategy(config.facebook);
  }
}
