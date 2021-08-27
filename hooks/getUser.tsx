import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { isUserInVar } from "../apollo.cache";
import { CachedUser } from "../graphql/user/user.model";

const GET_CACHED = gql`
  query clientUser {
    clientUser @client
  }
`;

const GET_CACHE_SAFE_USER = gql`
  query getUserForCache {
    whoAmI {
      id
      username
      displayName
      email
      _count {
        followers
        following
      }
    }
  }
`;

const cachedUser = (): { user: CachedUser | null } => {
  const [user, setUser] = useState<CachedUser | null>(null);
  useQuery(GET_CACHED, {
    onCompleted: (d) => {
      if (d.clientUser) {
        setUser(d.clientUser);
      } else {
        getter();
      }
    },
    onError: () => {
      console.log("HELLO?");
    },
  });

  const [getter] = useLazyQuery(GET_CACHE_SAFE_USER, {
    onCompleted: (data) => {
      setUser(data.whoAmI as CachedUser);
      isUserInVar(data.whoAmI as CachedUser);
    },
  });

  return { user };
};

export default cachedUser;
