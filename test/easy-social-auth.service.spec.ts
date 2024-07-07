import { SocialAuthService } from '../src/easy-social-auth.service';
import { AuthType } from '../src/enums/auth-type.enum';
import { config } from '../src/config';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import dotenv from 'dotenv';

dotenv.config();

describe('SocialAuthService', () => {
  let socialAuthService: SocialAuthService;
  let mock: MockAdapter;

  beforeAll(() => {
    socialAuthService = new SocialAuthService(config.google, config.facebook);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should generate Google auth URL', () => {
    const authUrl = socialAuthService.generateAuthUrl(AuthType.GOOGLE);
    expect(authUrl).toContain(config.google.authUrl);
  });

  it('should generate Facebook auth URL', () => {
    const authUrl = socialAuthService.generateAuthUrl(AuthType.FACEBOOK);
    expect(authUrl).toContain(config.facebook.authUrl);
  });

  it('should exchange code for Google token', async () => {
    const mockCode = 'mockCode';
    const mockToken = 'mockToken';
    mock.onPost(config.google.tokenEndpoint).reply(200, { access_token: mockToken });

    const response = await socialAuthService.exchangeCodeForToken(AuthType.GOOGLE, mockCode);
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockToken);
  });

  it('should exchange code for Facebook token', async () => {
    const mockCode = 'mockCode';
    const mockToken = 'mockToken';
    mock.onPost(config.facebook.tokenEndpoint).reply(200, { access_token: mockToken });

    const response = await socialAuthService.exchangeCodeForToken(AuthType.FACEBOOK, mockCode);
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockToken);
  });

  it('should refresh Google access token', async () => {
    const mockRefreshToken = 'mockRefreshToken';
    const mockNewToken = 'mockNewToken';
    mock.onPost(config.google.tokenEndpoint).reply(200, { access_token: mockNewToken });

    const response = await socialAuthService.refreshAccessToken(AuthType.GOOGLE, mockRefreshToken);
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockNewToken);
  });

  it('should refresh Facebook access token', async () => {
    const mockRefreshToken = 'mockRefreshToken';
    const mockNewToken = 'mockNewToken';
    mock.onPost(config.facebook.tokenEndpoint).reply(200, { access_token: mockNewToken });

    const response = await socialAuthService.refreshAccessToken(AuthType.FACEBOOK, mockRefreshToken);
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockNewToken);
  });

  it('should exchange password for Google token', async () => {
    const mockUsername = 'username';
    const mockPassword = 'password';
    const mockToken = 'mockToken';
    mock.onPost(config.google.tokenEndpoint).reply(200, { access_token: mockToken });

    const response = await socialAuthService.exchangePasswordForToken(AuthType.GOOGLE, mockUsername, mockPassword);
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockToken);
  });

  it('should exchange password for Facebook token', async () => {
    const mockUsername = 'username';
    const mockPassword = 'password';
    const mockToken = 'mockToken';
    mock.onPost(config.facebook.tokenEndpoint).reply(200, { access_token: mockToken });

    const response = await socialAuthService.exchangePasswordForToken(AuthType.FACEBOOK, mockUsername, mockPassword);
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockToken);
  });

  it('should get Google user data', async () => {
    const mockToken = 'mockToken';
    const mockUserData = { sub: '1', email: 'test@example.com', given_name: 'Test', family_name: 'User', picture: 'picture_url' };
    mock.onGet(config.google.userInfoEndpoint).reply(200, mockUserData);

    const response = await socialAuthService.getUserData(AuthType.GOOGLE, mockToken);
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

  it('should get Facebook user data', async () => {
    const mockToken = 'mockToken';
    const mockUserData = { id: '1', email: 'test@example.com', first_name: 'Test', last_name: 'User', picture: { data: { url: 'picture_url' } } };
    mock.onGet(config.facebook.userInfoEndpoint).reply(200, mockUserData);

    const response = await socialAuthService.getUserData(AuthType.FACEBOOK, mockToken);
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
