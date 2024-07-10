import { TwitterStrategy } from '../src/strategies/twitter.strategy';
import { ITwitterConfig } from '../src/interfaces/config.interface';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('TwitterStrategy', () => {
  let twitterStrategy: TwitterStrategy;
  let mock: MockAdapter;

  const mockConfig: ITwitterConfig = {
    clientId: 'client-id',
    clientSecret: 'client-secret',
    tokenEndpoint: 'https://api.twitter.com/oauth2/token',
    userInfoEndpoint: 'https://api.twitter.com/2/account/verify_credentials.json',
    authUrl: 'https://api.twitter.com/oauth2/authorize'
  };

  beforeAll(() => {
    twitterStrategy = new TwitterStrategy(mockConfig);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should generate auth URL', () => {
    const authUrl = twitterStrategy.generateAuthUrl('redirect-uri');
    expect(authUrl).toContain(mockConfig.authUrl);
  });

  it('should exchange code for token', async () => {
    const mockCode = 'mockCode';
    const mockToken = 'mockToken';
    mock.onPost(mockConfig.tokenEndpoint).reply(200, { access_token: mockToken });

    const response = await twitterStrategy.exchangeCodeForToken(mockCode, 'redirect-uri');
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockToken);
  });

  it('should refresh access token', async () => {
    const mockRefreshToken = 'mockRefreshToken';
    const mockNewToken = 'mockNewToken';
    mock.onPost(mockConfig.tokenEndpoint).reply(200, { access_token: mockNewToken });

    const response = await twitterStrategy.refreshAccessToken(mockRefreshToken);
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockNewToken);
  });

  it('should exchange password for token', async () => {
    const mockUsername = 'username';
    const mockPassword = 'password';
    const mockToken = 'mockToken';
    mock.onPost(mockConfig.tokenEndpoint).reply(200, { access_token: mockToken });

    const response = await twitterStrategy.exchangePasswordForToken(mockUsername, mockPassword);
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockToken);
  });

  it('should get user data', async () => {
    const mockToken = 'mockToken';
    const mockUserData = { id: '1', name: 'Test User', email: 'test@example.com' };
    mock.onGet(mockConfig.userInfoEndpoint).reply(200, mockUserData);

    const response = await twitterStrategy.getUserData(mockToken);
    expect(response.status).toBe(true);
    expect(response.data).toBeDefined();
  });
});
