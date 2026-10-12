import { Env } from './env.type';

export const env: Env = {
  host: 'https://kuebello.netlify.app',
  hostPort: '',
  proxyPort: '',
  apiPrefix: 'api',
  apiVersion: 'v1',
  getApi: () => `${env.host + env.proxyPort}/${env.apiPrefix}/${env.apiVersion}`,
};
