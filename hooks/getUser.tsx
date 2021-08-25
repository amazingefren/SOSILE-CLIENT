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
  const { data } = useQuery(GET_CACHED);
  const [getter, { data: userData }] = useLazyQuery(GET_CACHE_SAFE_USER);

  useEffect(() => {
    if (!data) {
      getter();
    }
  }, [data]);

  useEffect(() => {
    if (userData) {
      console.log(userData.whoAmI);
      isUserInVar(userData.whoAmI as CachedUser);
      setUser(userData.whoAmI as CachedUser);
    }
  }, [userData]);

  return { user };
};

export default cachedUser;
