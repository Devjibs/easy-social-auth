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
export interface IInstagramConfig extends BaseConfig {
  refreshTokenEndpoint: string;
  longLivedTokenEndpoint: string;
}
export interface ISpotifyConfig extends BaseConfig {}
export interface ITiktokConfig extends BaseConfig {}
export interface ILinkedinConfig extends BaseConfig {}
