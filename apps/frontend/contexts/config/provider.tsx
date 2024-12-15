'use client';

import React from 'react';
import { AppConfig } from './types';
import AppConfigContext from './index';

type Props = React.PropsWithChildren<{
  config: AppConfig;
}>;

const AppConfigContextProvider: React.FC<Props> = ({ config, children }) => (
  <AppConfigContext.Provider value={config}>
    {children}
  </AppConfigContext.Provider>
);

export default AppConfigContextProvider;
