import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { OutlookStrategy } from "../src/strategies/outlook.strategy";
import { IOutlookConfig } from "../src/interfaces/config.interface";
import { ISocialUser } from "../src/interfaces/social-user.interface";

describe("OutlookStrategy", () => {
  let strategy: OutlookStrategy;
  let mock: MockAdapter;

  const mockConfig: IOutlookConfig = {
    clientId: "test-client-id",
    clientSecret: "test-client-secret",
    tokenEndpoint: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    userInfoEndpoint: "https://graph.microsoft.com/v1.0/me",
  };

  beforeEach(() => {
    strategy = new OutlookStrategy(mockConfig);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it("should generate auth URL correctly", () => {
    const redirectUri = "http://localhost/callback";
    const authUrl = strategy.generateAuthUrl(
      redirectUri,
      "openid email offline_access https://graph.microsoft.com/Mail.Send",
      "code",
      { prompt: "consent" }
    );

    expect(authUrl).toContain(mockConfig.authUrl);
    expect(authUrl).toContain(`client_id=${mockConfig.clientId}`);
    expect(authUrl).toContain(
      `redirect_uri=${encodeURIComponent(redirectUri)}`
    );
    expect(authUrl).toContain("prompt=consent");
    expect(authUrl).toContain("response_type=code");
  });

  it("should exchange code for token", async () => {
    const mockCode = "mockCode";
    const redirectUri = "http://localhost/callback";
    const tokenResponse = {
      access_token: "mockAccessToken",
      refresh_token: "mockRefreshToken",
      expires_in: 3600,
    };

    mock.onPost(mockConfig.tokenEndpoint).reply(200, tokenResponse);

    const result = await strategy.exchangeCodeForToken(mockCode, redirectUri, {
      scope: "offline_access https://graph.microsoft.com/Mail.Send",
    });


    expect(result.status).toBe(true);
    expect(result.data?.access_token).toBe("mockAccessToken");
    expect(result.data?.refresh_token).toBe("mockRefreshToken");
  });

  it("should return error if token exchange fails", async () => {
    mock.onPost(mockConfig.tokenEndpoint).reply(400, {
      error_description: "invalid_code",
    });

    const result = await strategy.exchangeCodeForToken(
      "invalidCode",
      "http://localhost/callback",
      {}
    );
    expect(result.status).toBe(false);
    expect(result.error).toBe("invalid_code");
  });

  it("should refresh access token", async () => {
    const token = {
      access_token: "newAccessToken",
      expires_in: 3600,
    };

    mock.onPost(mockConfig.tokenEndpoint).reply(200, token);

    const result = await strategy.refreshAccessToken("mockRefreshToken");
    expect(result.status).toBe(true);
    expect(result.data).toBe("newAccessToken");
  });

  it("should return error if refresh fails", async () => {
    mock.onPost(mockConfig.tokenEndpoint).reply(400, {
      error_description: "Refresh token expired",
    });

    const result = await strategy.refreshAccessToken("expiredRefreshToken");
    expect(result.status).toBe(false);
    expect(result.error).toBe("Refresh token expired");
  });

  it("should fetch user data successfully", async () => {
    const userProfile = {
      id: "1234",
      mail: "user@example.com",
      givenName: "John",
      surname: "Doe",
    };

    mock.onGet(mockConfig.userInfoEndpoint).reply(200, userProfile);

    const result = await strategy.getUserData("validAccessToken");
    expect(result.status).toBe(true);
    const user = result.data as ISocialUser;
    expect(user.email).toBe("user@example.com");
    expect(user.firstName).toBe("John");
    expect(user.lastName).toBe("Doe");
  });

  it("should return error if fetching user data fails", async () => {
    mock.onGet(mockConfig.userInfoEndpoint).reply(401, {
      error_description: "Invalid token",
    });

    const result = await strategy.getUserData("invalidToken");
    expect(result.status).toBe(false);
    expect(result.error).toBe("Invalid token");
  });
});
