import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { YahooStrategy } from "../src/strategies/yahoo.strategy";
import { IYahooConfig } from "../src/interfaces/config.interface";

describe("YahooStrategy", () => {
  let yahooStrategy: YahooStrategy;
  let mock: MockAdapter;

  const mockConfig: IYahooConfig = {
    clientId: "client-id",
    clientSecret: "client-secret",
    tokenEndpoint: "https://api.login.yahoo.com/oauth2/get_token",
    userInfoEndpoint: "https://api.login.yahoo.com/openid/v1/userinfo",
    authUrl: "https://api.login.yahoo.com/oauth2/request_auth",
  };

  beforeAll(() => {
    yahooStrategy = new YahooStrategy(mockConfig);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it("should generate Yahoo auth URL", () => {
    const redirectUri = "http://localhost/callback";
    const authUrl = yahooStrategy.generateAuthUrl(
      redirectUri,
      "openid email profile",
      "code",
      { access_type: "offline", prompt: "consent" }
    );

    expect(authUrl).toContain(mockConfig.authUrl);
    expect(authUrl).toContain(
      `redirect_uri=${encodeURIComponent(redirectUri)}`
    );
    expect(authUrl).toContain("prompt=consent");
  });

  it("should exchange code for access token", async () => {
    const mockToken = "mock-access-token";
    mock.onPost(mockConfig.tokenEndpoint).reply(200, { access_token: mockToken });

    const result = await yahooStrategy.exchangeCodeForToken(
      "code123",
      "http://localhost/callback",
      {},
      true,
    );

    expect(result.status).toBe(true);
    expect(result.data).toEqual({ access_token: mockToken });
  });

  it("should refresh access token", async () => {
    const mockRefresh = "new-access-token";
    mock.onPost(mockConfig.tokenEndpoint).reply(200, { access_token: mockRefresh });

    const result = await yahooStrategy.refreshAccessToken(
      "mock-refresh-token",
      true,
      "http://localhost/callback",
    );

    expect(result.status).toBe(true);
    expect(result.data).toEqual("new-access-token");
  });

  it("should get user data", async () => {
    const mockUser = {
      sub: "123",
      email: "user@example.com",
      given_name: "John",
      family_name: "Doe",
      picture: "https://example.com/avatar.jpg",
      gender: "male",
      nickname: "johnny",
    };

    mock.onGet(mockConfig.userInfoEndpoint).reply(200, mockUser);

    const result = await yahooStrategy.getUserData("mock-access-token");
    expect(result.status).toBe(true);
    expect(result.data?.email).toBe(mockUser.email);
    expect(result.data?.firstName).toBe(mockUser.given_name);
  });

  it("should return error on user data failure", async () => {
    mock.onGet(mockConfig.userInfoEndpoint).reply(401, {
      error_description: "Invalid token",
    });

    const result = await yahooStrategy.getUserData("invalid-token");
    expect(result.status).toBe(false);
    expect(result.error).toBe("Invalid token");
  });
});
