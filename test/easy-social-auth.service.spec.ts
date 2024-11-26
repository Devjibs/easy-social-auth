import { SocialAuthService } from '../src/easy-social-auth.service';
import { IGoogleConfig, IFacebookConfig, ITwitterConfig } from '../src/interfaces/config.interface';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('SocialAuthService', () => {
  let socialAuthService: SocialAuthService;
  let mock: MockAdapter;

  const googleConfig: IGoogleConfig = {
    clientId: 'client-id',
    clientSecret: 'client-secret',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    userInfoEndpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth'
  };

  const facebookConfig: IFacebookConfig = {
    clientId: 'client-id',
    clientSecret: 'client-secret',
    tokenEndpoint: 'https://graph.facebook.com/v9.0/oauth/access_token',
    userInfoEndpoint: 'https://graph.facebook.com/me?fields=id,name,email',
    authUrl: 'https://www.facebook.com/v9.0/dialog/oauth'
  };

  const twitterConfig: ITwitterConfig = {
    clientId: 'client-id',
    clientSecret: 'client-secret',
    tokenEndpoint: 'https://api.twitter.com/oauth2/token',
    userInfoEndpoint: 'https://api.twitter.com/2/account/verify_credentials.json',
    authUrl: 'https://api.twitter.com/oauth2/authorize',
    revokeAccessUrl: 'https://api.x.com/2/oauth2/revoke'
  };

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should instantiate Google strategy if config is provided', () => {
    socialAuthService = new SocialAuthService();
    expect(socialAuthService.googleStrategy).toBeDefined();
  });

  it('should instantiate Facebook strategy if config is provided', () => {
    socialAuthService = new SocialAuthService();
    expect(socialAuthService.facebookStrategy).toBeDefined();
  });

  it('should instantiate Twitter strategy if config is provided', () => {
    socialAuthService = new SocialAuthService();
    expect(socialAuthService.twitterStrategy).toBeDefined();
  });

  it('should generate Google auth URL', () => {
    socialAuthService = new SocialAuthService();
    if (socialAuthService.googleStrategy) {
      const authUrl = socialAuthService.googleStrategy.generateAuthUrl('redirect_uri');
      expect(authUrl).toContain(googleConfig.authUrl);
    }
  });

  it('should generate Facebook auth URL', () => {
    socialAuthService = new SocialAuthService();
    if (socialAuthService.facebookStrategy) {
      const authUrl = socialAuthService.facebookStrategy.generateAuthUrl('redirect_uri');
      expect(authUrl).toContain(facebookConfig.authUrl);
    }
  });

  it('should generate Twitter auth URL', () => {
    socialAuthService = new SocialAuthService();
    if (socialAuthService.twitterStrategy) {
      const authUrl = socialAuthService.twitterStrategy.generateAuthUrl('redirect_uri');
      expect(authUrl).toContain(twitterConfig.authUrl);
    }
  });

  it('should exchange code for Google token', async () => {
    socialAuthService = new SocialAuthService();
    if (socialAuthService.googleStrategy) {
      const mockCode = 'mockCode';
      const mockToken = 'mockToken';
      mock.onPost(googleConfig.tokenEndpoint).reply(200, { access_token: mockToken });

      const response = await socialAuthService.googleStrategy.exchangeCodeForToken(mockCode, 'redirect_uri');
      expect(response.status).toBe(true);
      expect(response.data).toEqual(mockToken);
    }
  });

  it('should exchange code for Facebook token', async () => {
    socialAuthService = new SocialAuthService();
    if (socialAuthService.facebookStrategy) {
      const mockCode = 'mockCode';
      const mockToken = 'mockToken';
      mock.onPost(facebookConfig.tokenEndpoint).reply(200, { access_token: mockToken });

      const response = await socialAuthService.facebookStrategy.exchangeCodeForToken(mockCode, 'redirect_uri');
      expect(response.status).toBe(true);
      expect(response.data).toEqual(mockToken);
    }
  });

  it('should exchange code for Twitter token', async () => {
    socialAuthService = new SocialAuthService();
    if (socialAuthService.twitterStrategy) {
      const mockCode = 'mockCode';
      const mockToken = 'mockToken';
      mock.onPost(twitterConfig.tokenEndpoint).reply(200, { access_token: mockToken });

      const response = await socialAuthService.twitterStrategy.exchangeCodeForToken(mockCode, 'redirect_uri');
      expect(response.status).toBe(true);
      expect(response.data).toEqual(mockToken);
    }
  });

  it('should refresh Google access token', async () => {
    socialAuthService = new SocialAuthService();
    if (socialAuthService.googleStrategy) {
      const mockRefreshToken = 'mockRefreshToken';
      const mockNewToken = 'mockNewToken';
      mock.onPost(googleConfig.tokenEndpoint).reply(200, { access_token: mockNewToken });

      const response = await socialAuthService.googleStrategy.refreshAccessToken(mockRefreshToken);
      expect(response.status).toBe(true);
      expect(response.data).toEqual(mockNewToken);
    }
  });

  it('should refresh Facebook access token', async () => {
    socialAuthService = new SocialAuthService();
    if (socialAuthService.facebookStrategy) {
      const mockRefreshToken = 'mockRefreshToken';
      const mockNewToken = 'mockNewToken';
      mock.onPost(facebookConfig.tokenEndpoint).reply(200, { access_token: mockNewToken });

      const response = await socialAuthService.facebookStrategy.refreshAccessToken(mockRefreshToken);
      expect(response.status).toBe(true);
      expect(response.data).toEqual(mockNewToken);
    }
  });

  it('should refresh Twitter access token', async () => {
    socialAuthService = new SocialAuthService();
    if (socialAuthService.twitterStrategy) {
      const mockRefreshToken = 'mockRefreshToken';
      const mockNewToken = 'mockNewToken';
      mock.onPost(twitterConfig.tokenEndpoint).reply(200, { access_token: mockNewToken });

      const response = await socialAuthService.twitterStrategy.refreshAccessToken(mockRefreshToken);
      expect(response.status).toBe(true);
      expect(response.data).toEqual(mockNewToken);
    }
  });

  it('should get Google user data', async () => {
    socialAuthService = new SocialAuthService();
    if (socialAuthService.googleStrategy) {
      const mockToken = 'mockToken';
      const mockUserData = { sub: '1', email: 'test@example.com', given_name: 'Test', family_name: 'User', picture: 'picture_url' };
      mock.onGet(googleConfig.userInfoEndpoint).reply(200, mockUserData);

      const response = await socialAuthService.googleStrategy.getUserData(mockToken);
      expect(response.status).toBe(true);
      expect(response.data).toBeDefined();
    }
  });

  it('should get Facebook user data', async () => {
    socialAuthService = new SocialAuthService();
    if (socialAuthService.facebookStrategy) {
      const mockToken = 'mockToken';
      const mockUserData = { id: '1', email: 'test@example.com', first_name: 'Test', last_name: 'User', picture: { data: { url: 'picture_url' } } };
      mock.onGet(facebookConfig.userInfoEndpoint).reply(200, mockUserData);

      const response = await socialAuthService.facebookStrategy.getUserData(mockToken);
      expect(response.status).toBe(true);
      expect(response.data).toBeDefined();
    }
  });

  it('should get Twitter user data', async () => {
    socialAuthService = new SocialAuthService();
    if (socialAuthService.twitterStrategy) {
      const mockToken = 'mockToken';
      const mockUserData = { id: '1', name: 'Test User', email: 'test@example.com' };
      mock.onGet(twitterConfig.userInfoEndpoint).reply(200, mockUserData);

      const response = await socialAuthService.twitterStrategy.getUserData(mockToken);
      expect(response.status).toBe(true);
      expect(response.data).toBeDefined();
    }
  });
});
