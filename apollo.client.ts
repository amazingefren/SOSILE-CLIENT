import {
  ApolloClient,
  gql,
  HttpLink,
  InMemoryCache,
  Observable,
  from,
  fromPromise,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const REFRESH_AUTH = gql`
  mutation refresh {
    AuthRefresh
  }
`;

const refreshAuth = async () => {
  const token = window.localStorage.getItem("refresh_token") || "";
  console.log('[refreshAuth]: triggered')
  await client
    .mutate({
      mutation: REFRESH_AUTH,
      context: { headers: { Authorization: token } },
    })
    .then(() => {
      console.log("ok");
      return;
    });
};

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      let authTrigger = false
      // CAUTION: EXTREMELY DELICATE
      // having forward(operation) INSIDE
      // of a map/foreach/etc will cause 
      // the observer to trigger even if not
      // requested, in this case I have opted instead
      // just have a trigger to execute the promise observer
      // ultimately allowing me to asynchronous(ly) 
      // reset the authentication cookie via my own resolver
      for (let i =0; i < graphQLErrors.length; i++ ){
        if (graphQLErrors[i].message === "Unauthorized"){
          authTrigger = true
        }
      }
      if (authTrigger) {
        console.log("[ErrorLink]: Triggered Authentication");
        return fromPromise(
          refreshAuth()
            .then(() => {
              console.log("[refreshAuth]: Promise Catched");
              return forward(operation);
            })
            .catch((error) => {
              console.log("Error", error);
              return;
            })
        )
        // THIS MIGHT STILL BE NEEDED
          /* .filter((value) => {
            return Boolean(value);
          }) */
          .flatMap(() => {
            return forward(operation);
          });
      }
    }
  }
);

const httpLink = new HttpLink({
  uri: "http://localhost:8000/graphql",
  credentials: "include",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, httpLink]),
});

export default client;
