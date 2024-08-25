import { TiktokStrategy } from '../src/strategies/tiktok.strategy';
import { ITiktokConfig } from '../src/interfaces/config.interface';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('TiktokStrategy', () => {
  let tiktokStrategy: TiktokStrategy;
  let mock: MockAdapter;

  const mockConfig: ITiktokConfig = {
    clientId: 'client-id',
    clientSecret: 'client-secret',
    tokenEndpoint: 'https://open.tiktokapis.com/v2/oauth/token',
    userInfoEndpoint: 'https://open.tiktokapis.com/v2/user/info',
    authUrl: 'https://www.tiktok.com/v2/auth/authorize'
  };

  beforeAll(() => {
    tiktokStrategy = new TiktokStrategy(mockConfig);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should generate auth URL', () => {
    const authUrl = tiktokStrategy.generateAuthUrl('redirect-uri');
    expect(authUrl).toContain(mockConfig.authUrl);
  });

  it('should exchange code for token', async () => {
    const mockCode = 'mockCode';
    const mockToken = 'mockToken';
    mock.onPost(mockConfig.tokenEndpoint).reply(200, { access_token: mockToken });

    const response = await tiktokStrategy.exchangeCodeForToken(mockCode, 'redirect-uri');
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockToken);
  });

  it('should refresh access token', async () => {
    const mockRefreshToken = 'mockRefreshToken';
    const mockNewToken = 'mockNewToken';
    mock.onPost(mockConfig.tokenEndpoint).reply(200, { access_token: mockNewToken });

    const response = await tiktokStrategy.refreshAccessToken(mockRefreshToken);
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockNewToken);
  });

  it('should get user data', async () => {
    const mockToken = 'mockToken';
    const mockUserData = { 
        data: { user: {
            avatar_url: "https://p19-sign.tiktokcdn-us.com/tos-avt-0068-tx/b17f0e4b3a4f4a50993cf72cda8b88b8~c5_168x168.jpeg",
            open_id: "723f24d7-e717-40f8-a2b6-cb8464cd23b4",
            union_id: "c9c60f44-a68e-4f5d-84dd-ce22faeb0ba1",
            display_name: "lordoftriton",
            follower_count: 2,
            following_count: 5
        } }, 
        error: {
            code: "ok",
            message: "",
            log_id: "20220829194722CBE87ED59D524E727021"
        }
    };

    mock.onGet(mockConfig.userInfoEndpoint).reply(200, mockUserData);

    const response = await tiktokStrategy.getUserData(mockToken);
    expect(response.status).toBe(true);
    expect(response.data).toBeDefined();
  });
});
