import { gql, useQuery } from "@apollo/client";
import router from "next/dist/client/router";
import { useEffect, useState } from "react";

const IS_AUTH = gql`
  query clientIsAuth {
    clientIsAuth @client
  }
`;

const protect = ({
  to = null,
  reverse = null,
}: {
  to: null | string;
  reverse?: null | boolean;
}) => {
  const { data } = useQuery(IS_AUTH);

  const [isAuth, setIsAuth] = useState<null | boolean>(null);
  useEffect(() => {
    if (data.clientIsAuth) {
      setIsAuth(true);
      if (to && reverse) {
        router.replace(to);
      }
    } else {
      setIsAuth(false);
      if (to && !reverse) {
        router.replace(to);
      }
    }
    console.log(data);
  }, [data]);
  return { isAuth };
};

export { protect };
