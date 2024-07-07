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
    redirectUri: 'redirect-uri',
    tokenEndpoint: 'https://graph.facebook.com/v9.0/oauth/access_token',
    userInfoEndpoint: 'https://graph.facebook.com/me?fields=id,name,email',
    authUrl: 'https://www.facebook.com/v9.0/dialog/oauth'
  };

  beforeAll(() => {
    facebookStrategy = new FacebookStrategy(mockConfig);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should generate auth URL', () => {
    const authUrl = facebookStrategy.generateAuthUrl();
    expect(authUrl).toContain(mockConfig.authUrl);
  });

  it('should exchange code for token', async () => {
    const mockCode = 'mockCode';
    const mockToken = 'mockToken';
    mock.onPost(mockConfig.tokenEndpoint).reply(200, { access_token: mockToken });

    const token = await facebookStrategy.exchangeCodeForToken(mockCode);
    expect(token).toEqual(mockToken);
  });

  it('should get user data', async () => {
    const mockToken = 'mockToken';
    const mockUserData = { email: 'test@example.com', first_name: 'Test', last_name: 'User', picture: { data: { url: 'picture_url' } } };
    mock.onGet(mockConfig.userInfoEndpoint).reply(200, mockUserData);

    const userData = await facebookStrategy.getUserData(mockToken);
    expect(userData).toEqual({
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      picture: 'picture_url'
    });
  });
});
