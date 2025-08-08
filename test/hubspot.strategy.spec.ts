import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { HubSpotStrategy } from "../src/strategies/hubspot.strategy";
import { IHubSpotConfig } from "../src/interfaces/config.interface";

describe("HubSpotStrategy", () => {
  let strategy: HubSpotStrategy;
  let mock: MockAdapter;

  const mockConfig: IHubSpotConfig = {
    clientId: "test-client-id",
    clientSecret: "test-client-secret",
    tokenEndpoint: "https://api.hubspot.com/oauth/v1/token",
    userInfoEndpoint: "https://api.hubspot.com/oauth/v1/access-tokens",
    authUrl: "https://app.hubspot.com/oauth/authorize",
  };

  beforeAll(() => {
    strategy = new HubSpotStrategy(mockConfig);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it("should generate auth URL", () => {
    const redirectUri = "http://localhost:3000/auth/hubspot/callback";
    const url = strategy.generateAuthUrl(
      redirectUri,
      "oauth crm.objects.contacts.read",
      "code",
      { state: "test-state" }
    );
    expect(url).toContain(mockConfig.authUrl);
    expect(url).toContain("client_id=test-client-id");
    expect(url).toContain("response_type=code");
    expect(url).toContain("state=test-state");
  });

  it("should exchange code for access token", async () => {
    const code = "test-code";
    const redirectUri = "http://localhost:3000/auth/hubspot/callback";
    const mockToken = {
      access_token: "hubspot-token",
      refresh_token: "refresh-token",
    };

    mock.onPost(mockConfig.tokenEndpoint).reply(200, mockToken);

    const result = await strategy.exchangeCodeForToken(code, redirectUri);
    expect(result.status).toBe(true);
    expect(result.data.access_token).toBe("hubspot-token");
  });

  it("should refresh access token", async () => {
    const refreshToken = "mock-refresh-token";
    const newToken = { access_token: "new-token" };

    mock.onPost(mockConfig.tokenEndpoint).reply(200, newToken);

    const result = await strategy.refreshAccessToken(refreshToken);
    expect(result.status).toBe(true);
    expect(result.data).toBe("new-token");
  });

  it("should get user data", async () => {
    const token = "hubspot-access-token";
    const userInfo = {
      user_id: 456789,
      user: "user@example.com",
      hub_id: 123456,
      hub_domain: "uricreative.com",
      scopes: ["oauth", "crm.objects.contacts.read"],
    };

    mock.onGet(`${mockConfig.userInfoEndpoint}/${token}`).reply(200, userInfo);

    const result = await strategy.getUserData(token);
    expect(result.status).toBe(true);
    expect(result.data?.email).toBe("user@example.com");
    expect(result.data?.additionalData?.hub_id).toBe(123456);
  });

  it("should handle failure in getUserData", async () => {
    const token = "bad-token";
    mock.onGet(`${mockConfig.userInfoEndpoint}/${token}`).reply(401, {
      error_description: "Invalid token",
    });

    const result = await strategy.getUserData(token);
    expect(result.status).toBe(false);
    expect(result.error).toBe("Invalid token");
  });
});
