import { AuthService } from '../src/auth.service';
import { AuthType } from '../src/enums/auth-type.enum';
import { config } from '../src/config';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import dotenv from 'dotenv';

dotenv.config();

describe('AuthService', () => {
  let authService: AuthService;
  let mock: MockAdapter;

  beforeAll(() => {
    authService = new AuthService(config.google, config.facebook);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should generate Google auth URL', () => {
    const authUrl = authService.generateAuthUrl(AuthType.GOOGLE);
    expect(authUrl).toContain(config.google.authUrl);
  });

  it('should generate Facebook auth URL', () => {
    const authUrl = authService.generateAuthUrl(AuthType.FACEBOOK);
    expect(authUrl).toContain(config.facebook.authUrl);
  });

  it('should exchange code for Google token', async () => {
    const mockCode = 'mockCode';
    const mockToken = 'mockToken';
    mock.onPost(config.google.tokenEndpoint).reply(200, { access_token: mockToken });

    const token = await authService.exchangeCodeForToken(AuthType.GOOGLE, mockCode);
    expect(token).toEqual(mockToken);
  });

  it('should exchange code for Facebook token', async () => {
    const mockCode = 'mockCode';
    const mockToken = 'mockToken';
    mock.onPost(config.facebook.tokenEndpoint).reply(200, { access_token: mockToken });

    const token = await authService.exchangeCodeForToken(AuthType.FACEBOOK, mockCode);
    expect(token).toEqual(mockToken);
  });

  it('should refresh Google access token', async () => {
    const mockRefreshToken = 'mockRefreshToken';
    const mockNewToken = 'mockNewToken';
    mock.onPost(config.google.tokenEndpoint).reply(200, { access_token: mockNewToken });

    const newToken = await authService.refreshAccessToken(AuthType.GOOGLE, mockRefreshToken);
    expect(newToken).toEqual(mockNewToken);
  });

  it('should refresh Facebook access token', async () => {
    const mockRefreshToken = 'mockRefreshToken';
    const mockNewToken = 'mockNewToken';
    mock.onPost(config.facebook.tokenEndpoint).reply(200, { access_token: mockNewToken });

    const newToken = await authService.refreshAccessToken(AuthType.FACEBOOK, mockRefreshToken);
    expect(newToken).toEqual(mockNewToken);
  });

  it('should exchange password for Google token', async () => {
    const mockUsername = 'username';
    const mockPassword = 'password';
    const mockToken = 'mockToken';
    mock.onPost(config.google.tokenEndpoint).reply(200, { access_token: mockToken });

    const token = await authService.exchangePasswordForToken(AuthType.GOOGLE, mockUsername, mockPassword);
    expect(token).toEqual(mockToken);
  });

  it('should exchange password for Facebook token', async () => {
    const mockUsername = 'username';
    const mockPassword = 'password';
    const mockToken = 'mockToken';
    mock.onPost(config.facebook.tokenEndpoint).reply(200, { access_token: mockToken });

    const token = await authService.exchangePasswordForToken(AuthType.FACEBOOK, mockUsername, mockPassword);
    expect(token).toEqual(mockToken);
  });

  it('should get Google user data', async () => {
    const mockToken = 'mockToken';
    const mockUserData = { sub: '1', email: 'test@example.com', given_name: 'Test', family_name: 'User', picture: 'picture_url' };
    mock.onGet(config.google.userInfoEndpoint).reply(200, mockUserData);

    const userData = await authService.getUserData(AuthType.GOOGLE, mockToken);
    expect(userData).toEqual({
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      picture: 'picture_url'
    });
  });

  it('should get Facebook user data', async () => {
    const mockToken = 'mockToken';
    const mockUserData = { id: '1', email: 'test@example.com', first_name: 'Test', last_name: 'User', picture: { data: { url: 'picture_url' } } };
    mock.onGet(config.facebook.userInfoEndpoint).reply(200, mockUserData);

    const userData = await authService.getUserData(AuthType.FACEBOOK, mockToken);
    expect(userData).toEqual({
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      picture: 'picture_url'
    });
  });
});
