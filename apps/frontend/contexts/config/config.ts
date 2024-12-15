import { AppConfig } from './types';

const { env } = process;

const GRAPHQL_URL = `${env.GRAPHQL_URL}`;

const config: AppConfig = {
  GRAPHQL_URL,
};

export default config;
