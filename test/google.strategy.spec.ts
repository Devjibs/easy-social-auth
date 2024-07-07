import { GoogleStrategy } from '../src/strategies/google.strategy';
import { IGoogleConfig } from '../src/interfaces/config.interface';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('GoogleStrategy', () => {
  let googleStrategy: GoogleStrategy;
  let mock: MockAdapter;

  const mockConfig: IGoogleConfig = {
    clientId: 'client-id',
    clientSecret: 'client-secret',
    redirectUri: 'redirect-uri',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    userInfoEndpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
    authUrl: 'https://accounts.google.com/o/oauth2/auth'
  };

  beforeAll(() => {
    googleStrategy = new GoogleStrategy(mockConfig);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should generate auth URL', () => {
    const authUrl = googleStrategy.generateAuthUrl();
    expect(authUrl).toContain(mockConfig.authUrl);
  });

  it('should exchange code for token', async () => {
    const mockCode = 'mockCode';
    const mockToken = 'mockToken';
    mock.onPost(mockConfig.tokenEndpoint).reply(200, { access_token: mockToken });

    const token = await googleStrategy.exchangeCodeForToken(mockCode);
    expect(token).toEqual(mockToken);
  });

  it('should get user data', async () => {
    const mockToken = 'mockToken';
    const mockUserData = { email: 'test@example.com', given_name: 'Test', family_name: 'User', picture: 'picture_url' };
    mock.onGet(mockConfig.userInfoEndpoint).reply(200, mockUserData);

    const userData = await googleStrategy.getUserData(mockToken);
    expect(userData).toEqual({
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      picture: 'picture_url'
    });
  });
});
