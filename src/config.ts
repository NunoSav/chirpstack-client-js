import { ClientOptions } from './client';

export interface ChirpstackConfig extends Partial<ClientOptions> {
  headers?: Record<string, string>;
}

export const chirpstackConfig: ChirpstackConfig = {};

//#region Methods
export function setConfigValues(config: ChirpstackConfig): void {
  if (config.apiKey && config.apiKey !== '') setAPIKey(config.apiKey);
  if (config.domain && config.domain !== '') setDomain(config.domain);
}

export function setAPIKey(key: string): void {
  // TODO: add validation

  chirpstackConfig.apiKey = key;
  setHeaders(key);
}

export function setDomain(domain: string): void {
  // TODO: add validation

  chirpstackConfig.domain = domain;
}

function setHeaders(apiKey: string): void {
  chirpstackConfig.headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Grpc-Metadata-Authorization': `Bearer ${apiKey}`,
  };
}
//#endregion
