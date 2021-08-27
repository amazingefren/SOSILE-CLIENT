import { InMemoryCache, makeVar } from "@apollo/client";
import { CachedUser } from "./graphql/user/user.model";

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
export const isUserInVar = makeVar<CachedUser | null>(null);

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        clientIsAuth: {
          read() {
            return isAuthInVar();
          },
        },
        clientUser: {
          read() {
            return isUserInVar();
          },
        },
      },
    },
  },
});
