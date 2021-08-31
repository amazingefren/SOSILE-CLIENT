import { ApolloClient, gql, HttpLink, from, fromPromise } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { cache, isAuthInVar } from "./apollo.cache";

const REFRESH_AUTH = gql`
  mutation refresh {
    AuthRefresh
  }
`;

export const typeDefs = gql`
  extend type Query {
    clientIsAuth: Boolean!
    clientUser: CachedUser!
  }
`;

const refreshAuth = async () => {
  const token = window.localStorage.getItem("refresh_token") || "";
  console.log("[refreshAuth]: triggered");
  await client
    .mutate({
      mutation: REFRESH_AUTH,
      context: { headers: { Authorization: token } },
    })
    .then(({ data }) => {
      if (data.AuthRefresh) {
        console.log(data);
        console.log("ok");
        return;
      } else if (!data.AuthRefresh) {
        window.localStorage.removeItem("refresh_token");
        isAuthInVar(false);
        throw new Error("[AuthRefresh] Returned False");
      }
    });
};

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    // console.log(graphQLErrors)
    let authTrigger = false;
    // CAUTION: EXTREMELY DELICATE
    // having forward(operation) INSIDE
    // of a map/foreach/etc will cause
    // the observer to trigger even if not
    // requested, in this case I have opted instead
    // just have a trigger to execute the promise observer
    // ultimately allowing me to asynchronous(ly)
    // reset the authentication cookie via my own resolver
    for (let i = 0; i < graphQLErrors.length; i++) {
      if (graphQLErrors[i].message === "Unauthorized") {
        authTrigger = true;
      }
    }
    if (authTrigger) {
      console.log("[ErrorLink]: Triggered Authentication");
      return (
        fromPromise(
          refreshAuth()
            .then(() => {
              console.log("[refreshAuth]: Promise Catched");
              isAuthInVar(true);
              return forward(operation);
            })
            .catch((error) => {
              console.log("Error", error);
              console.log("hello?");
              window.localStorage.removeItem("refresh_token");
              isAuthInVar(false);
              return;
            })
        )
          // THIS MIGHT STILL BE NEEDED
          /* .filter((value) => {
            return Boolean(value);
          }) */
          .flatMap(() => {
            return forward(operation);
          })
      );
    }
  }
});

const httpLink = new HttpLink({
  uri: "http://localhost:8000/graphql",
  credentials: "include",
});

const client = new ApolloClient({
  cache,
  link: from([errorLink, httpLink]),
  typeDefs,
});

export default client;
