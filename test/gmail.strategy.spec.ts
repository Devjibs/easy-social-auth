import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { GmailStrategy } from "../src/strategies/gmail.strategy";
import { IGmailConfig } from "../src/interfaces/config.interface";

describe("GmailStrategy", () => {
  let gmailStrategy: GmailStrategy;
  let mock: MockAdapter;

  const mockConfig: IGmailConfig = {
    clientId: "client-id",
    clientSecret: "client-secret",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    userInfoEndpoint: "https://gmail.googleapis.com/gmail/v1/users/me/profile",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  };

  beforeEach(() => {
    gmailStrategy = new GmailStrategy(mockConfig);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it("should generate auth URL", () => {
    const redirectUri = "http://localhost/callback";
    const authUrl = gmailStrategy.generateAuthUrl(
      redirectUri,
      "openid email https://www.googleapis.com/auth/gmail.readonly",
      "code",
      { access_type: "offline", prompt: "consent" }
    );

    expect(authUrl).toContain(mockConfig.authUrl);
    expect(authUrl).toContain(`redirect_uri=${encodeURIComponent(redirectUri)}`);
    expect(authUrl).toContain("access_type=offline");
    expect(authUrl).toContain("prompt=consent");
  });

  it("should exchange code for access token", async () => {
    const mockCode = "mockCode";
    const redirectUri = "http://localhost/callback";
    const mockAccessToken = "ya29.mockAccessToken";

    mock
      .onPost(mockConfig.tokenEndpoint)
      .reply(200, { access_token: mockAccessToken });

    const result = await gmailStrategy.exchangeCodeForToken(mockCode, redirectUri);

    expect(result.status).toBe(true);
    expect(result.data).toBe(mockAccessToken);
  });

  it("should return error if token exchange fails", async () => {
    const mockCode = "badCode";
    const redirectUri = "http://localhost/callback";

    mock.onPost(mockConfig.tokenEndpoint).reply(400, {
      error_description: "Invalid authorization code",
    });

    const result = await gmailStrategy.exchangeCodeForToken(mockCode, redirectUri);
    expect(result.status).toBe(false);
    expect(result.error).toBe("Invalid authorization code");
  });

  it("should get user data", async () => {
    const accessToken = "ya29.mockAccessToken";
    const mockUser = {
      emailAddress: "user@example.com",
      messagesTotal: 100,
    };

    mock.onGet(mockConfig.userInfoEndpoint).reply(200, mockUser);

    const result = await gmailStrategy.getUserData(accessToken);
    expect(result.status).toBe(true);
    expect(result.data?.email).toBe(mockUser.emailAddress);
  });

  it("should return error if user data fails", async () => {
    const accessToken = "ya29.invalidToken";

    mock.onGet(mockConfig.userInfoEndpoint).reply(401, {
      error_description: "Invalid credentials",
    });

    const result = await gmailStrategy.getUserData(accessToken);
    expect(result.status).toBe(false);
    expect(result.error).toBe("Invalid credentials");
  });

  it("should refresh access token", async () => {
    const refreshToken = "mockRefreshToken";
    const newAccessToken = "ya29.newAccessToken";

    mock.onPost(mockConfig.tokenEndpoint).reply(200, { access_token: newAccessToken });

    const result = await gmailStrategy.refreshAccessToken(refreshToken);
    expect(result.status).toBe(true);
    expect(result.data.access_token).toBe(newAccessToken);
  });

  it("should return error if refresh fails", async () => {
    const refreshToken = "invalidRefreshToken";

    mock.onPost(mockConfig.tokenEndpoint).reply(400, {
      error_description: "Refresh token expired",
    });

    const result = await gmailStrategy.refreshAccessToken(refreshToken);
    expect(result.status).toBe(false);
    expect(result.error).toBe("Refresh token expired");
  });
});
