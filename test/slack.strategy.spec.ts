import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { SlackStrategy } from '../src/strategies/slack.strategy';
import { ISlackConfig } from '../src/interfaces/config.interface';

describe('SlackStrategy', () => {
  let slackStrategy: SlackStrategy;
  let mock: MockAdapter;

  const mockConfig: ISlackConfig = {
    clientId: 'client-id',
    clientSecret: 'client-secret',
    tokenEndpoint: 'https://slack.com/api/oauth.v2.access',
    userInfoEndpoint: 'https://slack.com/api/users.identity',
    authUrl: 'https://slack.com/oauth/v2/authorize',
    revokeTokenUrl: 'https://slack.com/api/auth.revoke',
  }

  beforeEach(() => {
    slackStrategy = new SlackStrategy(mockConfig);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should generate auth URL', () => {
    const generatedUrl = slackStrategy.generateAuthUrl('redirect-uri');
    expect(generatedUrl).toContain(mockConfig.authUrl);
    expect(generatedUrl).toContain('client_id=' + mockConfig.clientId);
    expect(generatedUrl).toContain('redirect_uri=redirect-uri');
  });

  it('should exchange code for token', async () => {
    const mockCode = 'mockCode';
    const mockToken = { access_token: 'mockToken' };
    mock.onPost(mockConfig.tokenEndpoint).reply(200, mockToken);

    const response = await slackStrategy.exchangeCodeForToken(mockCode, 'redirect-uri');
    expect(response.status).toBe(true);
    expect(response.data).toEqual(mockToken);
  });

  it('should revoke token', async () => {
    const mockAccessToken = 'mockAccessToken';
    mock.onPost(mockConfig.revokeTokenUrl).reply(200, { ok: true, data: 'Token revoked successfully' });

    const response = await slackStrategy.revokeToken(mockAccessToken);
    expect(response.status).toBe(true);
    expect(response.data).toEqual('Token revoked successfully');
  });
});