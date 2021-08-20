import { gql, useQuery } from "@apollo/client";
import router from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import { AuthCheck } from "../graphql/auth/auth.query";
import { User, UserAuthIncludeOpts, UserRequestOpts } from "../graphql/models/user.model";
import { USER_POST } from "../graphql/post/post.query";
import { ME } from "../graphql/user/user.query";

const protect = ({
  to = null,
  user = null,
}: {
  to: null | string;
  user: null | {fields: UserRequestOpts};
}) => {
  const [isAuth, setIsAuth] = useState<null | boolean>(null);
  const [User, setUser] = useState<null | User>(null);

  if (user) {
    useQuery(ME(user.fields), {
      onError: () => {
        setIsAuth(false);
      },
      onCompleted: (data) => {
        setUser(data.whoAmI);
        setIsAuth(true);
      },
    });
  } else {
    useQuery(AuthCheck, {
      onError: () => {
        setIsAuth(false);
      },
      onCompleted: () => {
        setIsAuth(true);
      },
    });
  }

  useEffect(() => {
    if (to) {
      if (isAuth == false) {
        router.push(to);
      }
    }
  }, [isAuth, to, User]);

  return { isAuth, user: User };
};

export { protect };
