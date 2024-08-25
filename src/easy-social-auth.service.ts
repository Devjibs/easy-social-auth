import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { TwitterStrategy } from './strategies/twitter.strategy';
import { config } from './config';
import { TiktokStrategy } from './strategies/tiktok.strategy';

export class SocialAuthService {
  public googleStrategy?: GoogleStrategy;
  public facebookStrategy?: FacebookStrategy;
  public twitterStrategy?: TwitterStrategy;
  public tiktokStrategy?: TiktokStrategy;

  constructor() {
    if (config.google) this.googleStrategy = new GoogleStrategy(config.google);
    if (config.facebook) this.facebookStrategy = new FacebookStrategy(config.facebook);
    if (config.twitter) this.twitterStrategy = new TwitterStrategy(config.twitter);
    if (config.tiktok) this.tiktokStrategy = new TiktokStrategy(config.tiktok);
  }
}
