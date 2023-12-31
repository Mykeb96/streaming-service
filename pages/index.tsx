import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify, Hub, Auth } from 'aws-amplify';
import awsExports from '../aws_exports/aws-exports';
import { useEffect, useState } from 'react';

export default function Home() {

  Amplify.configure({...awsExports, ssr: true});

  const [userName, setUserName] = useState<string>('')

  async function isUserAuth() {
    try {
      await Auth.currentAuthenticatedUser();
      return true;
    } 
    catch {
      return false;
    }
  }

  isUserAuth()
    .then((res) => {
      if (res == true){
        window.location.replace("https://main.d176952duc25ab.amplifyapp.com/videos")
      }
    })
    .catch((err) => console.log(err))

    useEffect(() => {
      Auth.currentAuthenticatedUser()
      .then((res) => setUserName(res.username))
      .catch((err) => console.log(err))

      Hub.listen("auth", (data) => {
        if (data?.payload?.event === "signIn") {
          window.location.replace("https://main.d176952duc25ab.amplifyapp.com/videos")
        }
      });
    }, [])
    

  return (
    <>
      <Head>
        <title>Streaming Service</title>
        <meta name="description" content="Streaming Service created by Mykael Barnes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <Authenticator>
          {({ signOut, user }) => (
            <div>
              <main className={styles.user_login}>
                <span>{user?.username}</span>
                <button onClick={signOut}>Sign out</button>
              </main>
            </div>
          )} 
        </Authenticator>

      </main>
    </>
  )
}
