import { SpotifyStrategy } from '../src/strategies/spotify.strategy';
import { ISpotifyConfig } from '../src/interfaces/config.interface';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('SpotifyStrategy', () => {
  let spotifyStrategy: SpotifyStrategy;
  let mock: MockAdapter;

  const mockConfig: ISpotifyConfig = {
    clientId: 'client-id',
    clientSecret: 'client-secret',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
    userInfoEndpoint: 'https://api.spotify.com/v1/me',
    authUrl: 'https://accounts.spotify.com/authorize',
  };

  beforeAll(() => {
    spotifyStrategy = new SpotifyStrategy(mockConfig);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should generate auth URL', () => {
    const authUrl = spotifyStrategy.generateAuthUrl('redirect-uri');
    expect(authUrl).toContain(mockConfig.authUrl);
  });

  it('should exchange code for token', async () => {
    const mockCode = 'mockCode';
    const mockToken = 'mockToken';
    mock.onPost(mockConfig.tokenEndpoint).reply(200, { access_token: mockToken });

    const response = await spotifyStrategy.exchangeCodeForToken(mockCode, 'redirect-uri');
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockToken);
  });

  it('should refresh access token', async () => {
    const mockRefreshToken = 'mockRefreshToken';
    const mockNewToken = 'mockNewToken';
    mock.onPost(mockConfig.tokenEndpoint).reply(200, { access_token: mockNewToken });

    const response = await spotifyStrategy.refreshAccessToken(mockRefreshToken);
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockNewToken);
  });

  it('should get user data', async () => {
    const mockToken = 'mockToken';
    const mockUserData = {
        display_name: "string",
        external_urls: { spotify: "string" },
        followers: { href: "string", total: 0 },
        href: "string",
        id: "string",
        images: [{ url: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228", height: 300, width: 300 }],
        type: "user",
        uri: "string"
    };
    
    mock.onGet(mockConfig.userInfoEndpoint).reply(200, mockUserData);

    const response = await spotifyStrategy.getUserData(mockToken);
    expect(response.status).toBe(true);
    expect(response.data).toBeDefined();
  });
});
