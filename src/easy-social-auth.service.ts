import { GoogleStrategy } from "./strategies/google.strategy";
import { FacebookStrategy } from "./strategies/facebook.strategy";
import { TwitterStrategy } from "./strategies/twitter.strategy";
import { InstagramStrategy } from "./strategies/instagram.strategy";
import { TiktokStrategy } from "./strategies/tiktok.strategy";
import { SpotifyStrategy } from "./strategies/spotify.strategy";
import { LinkedinStrategy } from "./strategies/linkedin.strategy";
import { config } from "./config";
import { RedditStrategy } from "./strategies/reddit.strategy";
import { GmailStrategy } from "./strategies/gmail.strategy";
import { SlackStrategy } from "./strategies/slack.strategy";

export class SocialAuthService {
  public googleStrategy?: GoogleStrategy;
  public facebookStrategy?: FacebookStrategy;
  public twitterStrategy?: TwitterStrategy;
  public instagramStrategy?: InstagramStrategy;
  public spotifyStrategy?: SpotifyStrategy;
  public tiktokStrategy?: TiktokStrategy;
  public linkedinStrategy?: LinkedinStrategy;
  public redditStrategy?: RedditStrategy;
  public gmailStrategy?: GmailStrategy;
  public slackStrategy?: SlackStrategy;

  constructor() {
    if (config.google) this.googleStrategy = new GoogleStrategy(config.google);
    if (config.facebook)
      this.facebookStrategy = new FacebookStrategy(config.facebook);
    if (config.twitter)
      this.twitterStrategy = new TwitterStrategy(config.twitter);
    if (config.instagram)
      this.instagramStrategy = new InstagramStrategy(config.instagram);
    if (config.spotify)
      this.spotifyStrategy = new SpotifyStrategy(config.spotify);
    if (config.tiktok) this.tiktokStrategy = new TiktokStrategy(config.tiktok);
    if (config.linkedin)
      this.linkedinStrategy = new LinkedinStrategy(config.linkedin);
    if (config.reddit) this.redditStrategy = new RedditStrategy(config.reddit);
    if (config.gmail) this.gmailStrategy = new GmailStrategy(config.gmail);
    if (config.slack) {
      this.slackStrategy = new SlackStrategy(config.slack);
    }
  }
}
