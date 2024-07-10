interface BaseConfig {
  clientId: string;
  clientSecret: string;
  tokenEndpoint: string;
  userInfoEndpoint: string;
  authUrl: string;
}

export interface IGoogleConfig extends BaseConfig {}
export interface IFacebookConfig extends BaseConfig {}
export interface ITwitterConfig extends BaseConfig {}
