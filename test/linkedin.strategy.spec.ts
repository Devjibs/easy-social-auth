import { LinkedinStrategy } from '../src/strategies/linkedin.strategy';
import { ILinkedinConfig } from '../src/interfaces/config.interface';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('LinkedinStrategy', () => {
  let linkedinStrategy: LinkedinStrategy;
  let mock: MockAdapter;

  const mockConfig: ILinkedinConfig = {
    clientId: 'client-id',
    clientSecret: 'client-secret',
    tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken',
    userInfoEndpoint: 'https://api.linkedin.com/v2/me',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization'
  };

  beforeAll(() => {
    linkedinStrategy = new LinkedinStrategy(mockConfig);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should generate auth URL', () => {
    const authUrl = linkedinStrategy.generateAuthUrl('redirect-uri');
    expect(authUrl).toContain(mockConfig.authUrl);
  });

  it('should exchange code for token', async () => {
    const mockCode = 'mockCode';
    const mockTokenResponse = { access_token: "mockNewToken" };
    mock.onPost(mockConfig.tokenEndpoint).reply(200, mockTokenResponse);

    const response = await linkedinStrategy.exchangeCodeForToken(mockCode, 'redirect-uri');
    expect(response.status).toBe(true);
    expect(response.data).toBeDefined(Response);
  });

  it('should refresh access token', async () => {
    const mockRefreshToken = 'mockRefreshToken';
    const mockTokenResponse = { access_token: "mockNewToken" };
    mock.onPost(mockConfig.tokenEndpoint).reply(200, mockTokenResponse);

    const response = await linkedinStrategy.refreshAccessToken(mockRefreshToken);
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockTokenResponse);
  });

  it('should get user data', async () => {
    const mockToken = 'mockToken';
    const mockUserData = {
        localizedFirstName: "Bob", 
        localizedLastName: "Smith", 
        profilePicture: { displayImage: "urn:li:digitalmediaAsset:C4D00AAAAbBCDEFGhiJ" }
    };

    mock.onGet(mockConfig.userInfoEndpoint).reply(200, mockUserData);

    const response = await linkedinStrategy.getUserData(mockToken);
    expect(response.status).toBe(true);
    expect(response.data).toBeDefined();
  });
});
