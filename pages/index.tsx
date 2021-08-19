import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import HomeStyles from '../styles/home/Home.module.scss'
import Login from '../components/home/Login'

const Home: NextPage = () => {
  return (
    <div className={HomeStyles.container}>
      <Head>
        <title>Sosile Client</title>
        <meta name="description" content="sosile-client" />
      </Head>

      <main className={HomeStyles.main}>
        <div className={HomeStyles.mainLeft}>
        <h1>SOSILE</h1>
        </div>
        <div className={HomeStyles.mainRight}>
          <Login/>
          <div>
          Sign Up
          </div>
        </div>
      </main>

      <footer className={HomeStyles.footer}>
        SOSILE AND FRIENDS
      </footer>
    </div>
  )
}

export default Home
