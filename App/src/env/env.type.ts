type Env = {
  host: string;
  hostPort: string;
  proxyPort: string;
  apiPrefix: string;
  apiVersion: string;
  getApi: () => string;
};

export type { Env };
