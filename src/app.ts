import { TwitterStrategy } from "./strategies/twitter.strategy";
import { config } from "./config"

const twitterStrategyInstance = new TwitterStrategy(config.twitter);
const url = twitterStrategyInstance.generateAuthUrl(
  "http://www.localhost:3000/oauth/twitter",
  "tweet.read users.read offline.access",
  "code",
  {
    state: "state",
    code_challenge: "challenge",
    code_challenge_method: "plain",
  }
);
console.log("URL: ", url);

async function userToken() {
  twitterStrategyInstance.exchangeCodeForToken(
    "c1pCMXlmclAxeUlqM29UeTRNVUdkc09mSVhnb0pqWTRGcXQ2QTJJV3hLdWh0OjE3MzIxNDE2MTgxNTI6MToxOmFjOjE",
    "http://www.localhost:3000/oauth/twitter",
    {
      code_verifier: "challenge"
    }
  )
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
}

userToken();
