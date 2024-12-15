import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support';

// import getSessionFromHeaders from '@app/contexts/auth/server/getSessionFromHeaders';
import config from '@app/contexts/config/config';

const { getClient } = registerApolloClient(() => {
  const httpLink = new HttpLink({
    // this needs to be an absolute url, as relative urls cannot be used in SSR
    uri: config.GRAPHQL_URL,
    // you can disable result caching here if you want to
    // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
    fetchOptions: { cache: 'no-store' },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const authLink = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    // const session = await getSessionFromHeaders();
    // if (!session) {
    //   return {};
    // }

    return {
      headers: {
        ...headers,
        // authorization: session.accessToken
        //   ? `Bearer ${session.accessToken}`
        //   : '',
      },
    };
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
});

export default getClient;
