import { gql, useQuery } from "@apollo/client";
import router from "next/dist/client/router";
import React, { useEffect, useState } from "react";
// import { AuthCheck } from "../graphql/auth/auth.query";
// import { User, UserAuthIncludeOpts, UserRequestOpts } from "../graphql/models/user.model";
// import { USER_POST } from "../graphql/post/post.query";
// import { ME } from "../graphql/user/user.query";

const IS_AUTH = gql`
  query clientIsAuth {
    clientIsAuth @client
}
`

const protect = ({
  to = null,
  reverse = null
}: {
  to: null | string;
  reverse?: null | boolean;
}) => {

  const {data} = useQuery(IS_AUTH)

  const [isAuth, setIsAuth] = useState<null | boolean>(null);
  useEffect(()=>{
    if(data.clientIsAuth){
      setIsAuth(true)
      if(to && reverse){
        router.replace(to)  
      }
    }else{
      setIsAuth(false)
      if(to && !reverse){
        router.replace(to)
      }
    }
    console.log(data)
  },[data])
  return { isAuth };
};

export { protect };
