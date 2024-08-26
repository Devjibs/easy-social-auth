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
    userInfoEndpoint: 'https://graph.instagram.com/me?fields=id,username,account_type',
    userMediaEndpoint: 'https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption',
    authUrl: 'https://api.instagram.com/oauth/authorize'
  };

  beforeAll(() => {
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

  it('should exchange code for token', async () => {
    const mockCode = 'mockCode';
    const mockToken = 'mockToken';
    mock.onPost(mockConfig.tokenEndpoint).reply(200, { access_token: mockToken });

    const response = await instagramStrategy.exchangeCodeForToken(mockCode, 'redirect-uri');
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockToken);
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

  it('should get user media', async () => {
    const mockToken = 'mockToken';
    const mockMediaData = { data: [{
        id: "000000",
        media_type: "image/png",
        media_url: "www.image.com/image.png",
        username: "lordoftriton",
        timestamp: ""
    }], paging: { cursors: { after: "after_cursor", before: "before_cursor" }, next: "next" } };

    mock.onGet(new RegExp(mockConfig.userMediaEndpoint)).reply(200, mockMediaData);

    const response = await instagramStrategy.getUserMedia(mockToken, { before: mockMediaData.paging.cursors.before });
    expect(response.status).toBe(true);
    expect(response.data).toBeDefined();
  });
});
