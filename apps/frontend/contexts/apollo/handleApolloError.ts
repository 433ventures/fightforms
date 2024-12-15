import { ApolloError } from '@apollo/client';

type ApolloErrorInfo = {
  message: string;
  status?: number;
};

const handleApolloError = (error: unknown): ApolloErrorInfo => {
  let status = 400;

  if (error instanceof ApolloError) {
    const messages: string[] = [];

    error.graphQLErrors.forEach((graphQLError) => {
      messages.push(graphQLError.message);
      if (
        graphQLError.extensions?.code &&
        graphQLError.extensions.status !== 200
      ) {
        status = Number(graphQLError.extensions.status);
      }
    });

    return {
      message: messages.join(', '),
      status,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status,
    };
  }

  return {
    message: String(error),
    status,
  };
};

export default handleApolloError;
