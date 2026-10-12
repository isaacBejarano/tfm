import { Env } from './env.type';

export const env: Env = {
  host: 'https://localhost',
  hostPort: ':4200',
  proxyPort: ':7247',
  apiPrefix: 'api',
  apiVersion: 'v1',
  getApi: () => `${env.host + env.proxyPort}/${env.apiPrefix}/${env.apiVersion}`,
};
