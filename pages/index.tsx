import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Sosile Client</title>
        <meta name="description" content="sosile-client" />
      </Head>

      <main className={styles.main}>
        HELLO
      </main>

      <footer className={styles.footer}>
        SOSILE AND FRIENDS
      </footer>
    </div>
  )
}

export default Home
