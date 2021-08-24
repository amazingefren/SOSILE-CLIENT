import { gql, InMemoryCache, makeVar, useQuery } from "@apollo/client";

const checkToken = (): boolean => {
  let tokenBool = false;
  if (typeof window !== "undefined") {
    window.localStorage.getItem("refresh_token")
      ? (tokenBool = true)
      : (tokenBool = false);
  }
  return tokenBool;
};

export const isAuthInVar = makeVar<boolean>(checkToken());

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        clientIsAuth: {
          read() {
            return isAuthInVar();
          },
        },
      },
    },
  },
});
