import { TwitterStrategy } from "../src/strategies/twitter.strategy";
import { ITwitterConfig } from "../src/interfaces/config.interface";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

describe("TwitterStrategy", () => {
  let twitterStrategy: TwitterStrategy;
  let mock: MockAdapter;

  const mockConfig: ITwitterConfig = {
    clientId: "client-id",
    clientSecret: "client-secret",
    tokenEndpoint: "https://api.x.com/2/oauth2/token",
    userInfoEndpoint: "https://api.x.com/1.1/account/verify_credentials.json",
    authUrl: "https://api.x.com/oauth/authorize",
    revokeTokenUrl: "https://api.x.com/2/oauth2/revoke",
    OAuth_1_0_AccessTokenUrl: "https://api.x.com/oauth/access_token",
    OAuth_1_0_AuthUrl: "https://api.x.com/oauth/authorize",
    OAuth_1_0_RequestTokenUrl: "https://api.x.com/oauth/request_token",
    apiKey: "api-key",
    consumerSecret: "consumer-secret",
  };

  beforeAll(() => {
    twitterStrategy = new TwitterStrategy(mockConfig);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  // OAuth 2.0 Tests
  it("should generate auth URL (OAuth 2.0)", () => {
    const authUrl = twitterStrategy.generateAuthUrl("redirect-uri");
    expect(authUrl).toContain(mockConfig.authUrl);
  });

  it("should exchange code for token (OAuth 2.0)", async () => {
    const mockCode = "mockCode";
    const mockToken = "mockToken";
    mock
      .onPost(mockConfig.tokenEndpoint)
      .reply(200, { access_token: mockToken });

    const response = await twitterStrategy.exchangeCodeForToken(
      mockCode,
      "redirect-uri"
    );
    expect(response.status).toBe(true);
    expect(response.data.access_token).toEqual(mockToken);
  });

  it("should exchange code for token", async () => {
    const mockCode = "mockCode";
    const mockToken = "mockToken";
    const receivedMockToken = { access_token: "mockToken" };
    mock
      .onPost(mockConfig.tokenEndpoint)
      .reply(200, { access_token: mockToken });

    const response = await twitterStrategy.exchangeCodeForToken(
      mockCode,
      "redirect-uri"
    );
    expect(response.status).toBe(true);
    expect(response.data).toEqual(receivedMockToken);
  });

  it("should get user data (OAuth 2.0)", async () => {
    const mockToken = "mockToken";
    const mockUserData = { id: "1", name: "Test User" };
    mock.onGet(mockConfig.userInfoEndpoint).reply(200, mockUserData);

    const response = await twitterStrategy.getUserData(mockToken);
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockUserData);
  });

  // OAuth 1.0a Tests
  it("should get request token (OAuth 1.0a)", async () => {
    const callbackUrl = "https://example.com/callback";
    const mockToken = "mockRequestToken";
    const mockTokenSecret = "mockTokenSecret";
    mock
      .onPost(mockConfig.OAuth_1_0_RequestTokenUrl)
      .reply(
        200,
        `oauth_token=${mockToken}&oauth_token_secret=${mockTokenSecret}&oauth_callback_confirmed=true`
      );

    const response = await twitterStrategy.getRequestOAuth_1_0_Token(
      callbackUrl
    );
    expect(response.status).toBe(true);
    expect(response.data.oauth_token).toEqual(mockToken);
    expect(response.data.oauth_token_secret).toEqual(mockTokenSecret);
  });

  it("should generate authorization URL (OAuth 1.0a)", () => {
    const oauthToken = "mockRequestToken";
    const authUrl = twitterStrategy.getAuthorizationUrl(oauthToken);
    expect(authUrl).toBe(`${mockConfig.authUrl}?oauth_token=${oauthToken}`);
  });

  it("should exchange request token for access token (OAuth 1.0a)", async () => {
    const mockToken = "mockAccessToken";
    const mockTokenSecret = "mockAccessTokenSecret";
    const oauthToken = "mockRequestToken";
    const oauthVerifier = "mockVerifier";

    mock
      .onPost(mockConfig.OAuth_1_0_AccessTokenUrl)
      .reply(
        200,
        `oauth_token=${mockToken}&oauth_token_secret=${mockTokenSecret}`
      );

    const response = await twitterStrategy.getOAuth_1_0_AccessToken(
      oauthToken,
      oauthVerifier
    );
    expect(response.status).toBe(true);
    expect(response.data.oauth_token).toEqual(mockToken);
    expect(response.data.oauth_token_secret).toEqual(mockTokenSecret);
  });
});
