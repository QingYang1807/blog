import { fetch as nodeFetch } from 'node-fetch';

global.fetch = (url: string, init?: RequestInit) => {
  return nodeFetch(url, {
    ...init,
    timeout: 30000, // 30 秒超时
    headers: {
      ...init?.headers,
    },
  });
}; 