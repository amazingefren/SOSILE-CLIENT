import { gql, useQuery } from "@apollo/client";
import router from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import { AuthCheck } from "../graphql/auth/auth.query";
import { User } from "../graphql/models/user.model";
import { ME } from "../graphql/user/user.query";

const protect = ({
  to = null,
  user = null,
}: {
  to: null | string;
  user: null | boolean;
}) => {
  const [isAuth, setIsAuth] = useState<null | boolean>(null);
  const [User, setUser] = useState<null | User>(null);

  if (user) {
    useQuery(
      gql`
        ${ME({}, { id: true, username: true })}
      `,
      {
        onError: () => {
          setIsAuth(false)
        },
        onCompleted:(data)=>{
          setIsAuth(true)
          setUser(data.whoAmI)
        }
      }
    );
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

  return { isAuth, user:User };
};

export { protect };
