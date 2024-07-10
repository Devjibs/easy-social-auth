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
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    userInfoEndpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth'
  };

  beforeAll(() => {
    googleStrategy = new GoogleStrategy(mockConfig);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should generate auth URL', () => {
    const authUrl = googleStrategy.generateAuthUrl('redirect-uri');
    expect(authUrl).toContain(mockConfig.authUrl);
  });

  it('should exchange code for token', async () => {
    const mockCode = 'mockCode';
    const mockToken = 'mockToken';
    mock.onPost(mockConfig.tokenEndpoint).reply(200, { access_token: mockToken });

    const response = await googleStrategy.exchangeCodeForToken(mockCode, 'redirect-uri');
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockToken);
  });

  it('should refresh access token', async () => {
    const mockRefreshToken = 'mockRefreshToken';
    const mockNewToken = 'mockNewToken';
    mock.onPost(mockConfig.tokenEndpoint).reply(200, { access_token: mockNewToken });

    const response = await googleStrategy.refreshAccessToken(mockRefreshToken);
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockNewToken);
  });

  it('should exchange password for token', async () => {
    const mockUsername = 'username';
    const mockPassword = 'password';
    const mockToken = 'mockToken';
    mock.onPost(mockConfig.tokenEndpoint).reply(200, { access_token: mockToken });

    const response = await googleStrategy.exchangePasswordForToken(mockUsername, mockPassword);
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockToken);
  });

  it('should get user data', async () => {
    const mockToken = 'mockToken';
    const mockUserData = { sub: '1', email: 'test@example.com', given_name: 'Test', family_name: 'User', picture: 'picture_url' };
    mock.onGet(mockConfig.userInfoEndpoint).reply(200, mockUserData);

    const response = await googleStrategy.getUserData(mockToken);
    expect(response.status).toBe(true);
    expect(response.data).toEqual({
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      picture: 'picture_url',
      additionalData: mockUserData
    });
  });
});
