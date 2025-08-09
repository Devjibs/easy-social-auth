import { InstagramStrategy } from '../src/strategies/instagram.strategy';
import { IInstagramConfig } from '../src/interfaces/config.interface';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('InstagramStrategy', () => {
  let instagramStrategy: InstagramStrategy;
  let mock: MockAdapter;

  const mockConfig: IInstagramConfig = {
    clientId: 'client-id',
    clientSecret: 'client-secret',
    tokenEndpoint: 'https://api.instagram.com/oauth/access_token',
    longLivedTokenEndpoint:'https://graph.instagram.com/access_token',
    refreshTokenEndpoint: 'https://graph.instagram.com/refresh_access_token',
    userInfoEndpoint: 'https://graph.instagram.com/me',
    authUrl: 'https://api.instagram.com/oauth/authorize'
  };

  beforeEach(() => {
    instagramStrategy = new InstagramStrategy(mockConfig);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should generate auth URL', () => {
    const authUrl = instagramStrategy.generateAuthUrl('redirect-uri');
    expect(authUrl).toContain(mockConfig.authUrl);
  });

  it('should refresh access token', async () => {
    const mockNewToken = 'mockNewToken';
    mock.onGet(new RegExp(mockConfig.refreshTokenEndpoint)).reply(200, { access_token: mockNewToken });

    const response = await instagramStrategy.refreshAccessToken(mockNewToken);
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockNewToken);
  });

  it('should get user data', async () => {
    const mockToken = 'mockToken';
    const mockUserData = { id: '1', username: 'lordoftriton' };

    mock.onGet(new RegExp(mockConfig.userInfoEndpoint)).reply(200, mockUserData);

    const response = await instagramStrategy.getUserData(mockToken);
    expect(response.status).toBe(true);
    expect(response.data).toBeDefined();
  });
});
