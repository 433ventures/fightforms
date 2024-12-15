'use client';

import React, { useContext } from 'react';
import { ApolloLink, HttpLink, split, Operation } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { createClient as createWsClient } from 'graphql-ws';
import {
  ApolloNextAppProvider,
  InMemoryCache as NextSSRInMemoryCache,
  ApolloClient as NextSSRApolloClient,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support';

import AppConfigContext from '../config';
// import getSessionFromCookiesOnClient from '../auth/client/getSessionFromCookies';

const makeClient = (uri: string) => () => {
  const httpLink = new HttpLink({
    // this needs to be an absolute url, as relative urls cannot be used in SSR
    uri,
    fetchOptions: { cache: 'no-store' },
  });

  const wsLink = new GraphQLWsLink(
    createWsClient({
      url: uri.replace(/http/, 'ws'),
      keepAlive: 60,
      // connectionParams: () => {
      //   const session = getSessionFromCookiesOnClient();
      //
      //   if (!session) {
      //     return {};
      //   }
      //
      //   return {
      //     authToken: session.accessToken,
      //   };
      // },
    }),
  );

  const httpLinkWithSsrSupport =
    typeof window === 'undefined'
      ? ApolloLink.from([
          // in a SSR environment, if you use multipart features like
          // @defer, you need to decide how to handle these.
          // This strips all interfaces with a `@defer` directive from your queries.
          new SSRMultipartLink({
            stripDefer: true,
          }),
          httpLink,
        ])
      : httpLink;

  const authLink = setContext(async (_, { headers }) => {
    // const session = await getSessionFromCookiesOnClient();
    // if (!session) {
    //   return {};
    // }

    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        // authorization: session.accessToken
        //   ? `Bearer ${session.accessToken}`
        //   : '',
      },
    };
  });

  const isSubscription = ({ query }: Operation) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  };

  const splitLink = split(
    isSubscription,
    wsLink,
    authLink.concat(httpLinkWithSsrSupport),
  );

  return new NextSSRApolloClient({
    // use the `NextSSRInMemoryCache`, not the normal `InMemoryCache`
    cache: new NextSSRInMemoryCache(),
    link: splitLink,
  });
};

// you need to create a component to wrap your app in
const ApolloProvider = ({ children }: React.PropsWithChildren) => {
  const { GRAPHQL_URL } = useContext(AppConfigContext);
  return (
    <ApolloNextAppProvider makeClient={makeClient(GRAPHQL_URL)}>
      {children}
    </ApolloNextAppProvider>
  );
};

export default ApolloProvider;
