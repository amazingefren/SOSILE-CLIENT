import { useQuery } from "@apollo/client";
import router from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import { AuthCheck } from "../graphql/auth/auth.query";

const protect = ({ to = null }: {to: null | string}) => {
  const [isAuth, setIsAuth] = useState<null | boolean>(null);

  useQuery(AuthCheck, {
    onError: ()=>{
      setIsAuth(false)
    },
    onCompleted: ()=>{
      setIsAuth(true)
    }
  })

  useEffect(()=>{
    if (to){
      if(isAuth == false){
        router.push(to)
      }
    }
  },[isAuth, to])

  return{isAuth}
};

export {protect}
