import React from 'react';
import { AppConfig } from './types';

const AppConfigContext = React.createContext<AppConfig>({
  GRAPHQL_URL: '',
});

export default AppConfigContext;
