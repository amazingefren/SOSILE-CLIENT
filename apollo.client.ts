import {
  ApolloClient,
  createHttpLink,
  from,
  gql,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const REFRESH_AUTH = gql`
  mutation refresh {
    AuthRefresh
  }
`;

const refreshAuth = () => {
  const token = window.localStorage.getItem('refresh_token')
  return client
    .mutate({ mutation: REFRESH_AUTH, context: { headers: { Authorization: token } } })
    .then(() => {
      return;
    });
};

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }) => {
      if (message === "Unauthorized") {
        console.log("UNAUTH1");
        refreshAuth()
          .then(() => {
            forward(operation);
          })
          .catch(() => {
            return;
          });
      }
      if (extensions?.code === "UNAUTHENTICATED") {
        console.log("UNAUTH2");
      }
    });
  }
});

const httpLink = new HttpLink({
  uri: "http://localhost:8000/graphql",
  credentials: "include",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, httpLink]),
});

export default client;
