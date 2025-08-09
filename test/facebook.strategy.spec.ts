import { FacebookStrategy } from '../src/strategies/facebook.strategy';
import { IFacebookConfig } from '../src/interfaces/config.interface';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('FacebookStrategy', () => {
  let facebookStrategy: FacebookStrategy;
  let mock: MockAdapter;

  const mockConfig: IFacebookConfig = {
    clientId: 'client-id',
    clientSecret: 'client-secret',
    tokenEndpoint: 'https://graph.facebook.com/v9.0/oauth/access_token',
    userInfoEndpoint: 'https://graph.facebook.com/me?fields=id,name,email',
    authUrl: 'https://www.facebook.com/v9.0/dialog/oauth'
  };

  beforeEach(() => {
    facebookStrategy = new FacebookStrategy(mockConfig);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should generate auth URL', () => {
    const authUrl = facebookStrategy.generateAuthUrl('redirect-uri');
    expect(authUrl).toContain(mockConfig.authUrl);
  });

  it('should exchange code for token', async () => {
    const mockCode = 'mockCode';
    const mockToken = { access_token: 'mockToken' }
    mock.onPost(mockConfig.tokenEndpoint).reply(200, mockToken);

    const response = await facebookStrategy.exchangeCodeForToken(mockCode, 'redirect-uri');
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockToken);
  });

  it('should refresh access token', async () => {
    const mockRefreshToken = 'mockRefreshToken';
    const mockNewToken = 'mockNewToken';
    mock.onPost(mockConfig.tokenEndpoint).reply(200, { access_token: mockNewToken });

    const response = await facebookStrategy.refreshAccessToken(mockRefreshToken);
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockNewToken);
  });

  it('should exchange password for token', async () => {
    const mockUsername = 'username';
    const mockPassword = 'password';
    const mockToken = { access_token: 'mockToken' }
    mock.onPost(mockConfig.tokenEndpoint).reply(200, mockToken);

    const response = await facebookStrategy.exchangePasswordForToken(mockUsername, mockPassword);
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockToken);
  });

  it('should get user data', async () => {
    const mockToken = 'mockToken';
    const mockUserData = { id: '1', email: 'test@example.com', first_name: 'Test', last_name: 'User', picture: { data: { url: 'picture_url' } } };
    mock.onGet(mockConfig.userInfoEndpoint).reply(200, mockUserData);

    const response = await facebookStrategy.getUserData(mockToken);
    expect(response.status).toBe(true);
    expect(response.data).toBeDefined();
  });
});
