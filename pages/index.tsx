import React, { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import IndexStyle from '../styles/index/index.module.scss'
import Login from '../components/home/Login'
import { useQuery } from '@apollo/client'
import { AuthCheck } from '../graphql/auth/auth.query'
import router from 'next/dist/client/router'

const Index: NextPage = () => {
  const [isAuth, setIsAuth ] = useState<null|boolean>(null)
  useQuery(AuthCheck, {
    onError: (e) => {
      console.log(e);
      setIsAuth(false)
    },
    onCompleted: (data) => {
      if(data.AuthCheck === true){
        // redirect without history stack
        router.replace('/home')
      }
    },
  });

  return (
    <div className={IndexStyle.container}>
      <Head>
        <title>Sosile Client</title>
        <meta name="description" content="sosile-client" />
      </Head>

      {isAuth === false &&
      <main className={IndexStyle.main}>
        <div className={IndexStyle.mainLeft}>
        <h1>SOSILE</h1>
        </div>
          <div className={IndexStyle.mainRight}>
            <Login/>
            <div>
            Sign Up
            </div>
          </div>
      </main>
      }
    </div>
  )
}

export default Index
