import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { getSession, signIn, useSession } from "next-auth/react";
import styles from "../styles/Home.module.css";
import Router from "next/router";


const Home: NextPage = () => {

  const { data: session } = useSession()

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>Hello {session?.user?.name}</div>
        <button type="button" onClick={() => Router.push('/order')}>Create test order </button>

      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export async function getServerSideProps({ req }: any) {
  let session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false
      }
    }
  }

  return {
    props: { session }
  }

}

export default Home;