import { useEffect } from 'react'
import 'tippy.js/dist/tippy.css';
import "cropperjs/dist/cropper.css";
import '../styles/index.css'
import { AuthenticationProvider, useAuthentication } from 'swrlit'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { SWRConfig } from 'swr'
import { useFathom } from '../hooks/fathom'
import LoginVerifier from '../components/LoginVerifier'

function RenderAfterAuthed({ children }) {
  const { info } = useAuthentication()

  return info ? (
    <>
      {children}
    </>
  ) : (<></>)
}


function MyApp({ Component, pageProps }) {
  const router = useRouter()
  // disable to debug issues in staging
  useFathom()

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=optional"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet" />
        {/* Temporary Logo Wordmark Font */}
        <link href="https://fonts.googleapis.com/css2?family=Bellota:wght@700&display=swap" rel="stylesheet" />
        <meta name="monetization" content="$ilp.uphold.com/DYPhbXPmDa2P" />
      </Head>
      <SWRConfig value={{ shouldRetryOnError: false }}>
        <DndProvider backend={HTML5Backend}>
          <>
            <LoginVerifier />
            <Component {...pageProps} />
          </>
        </DndProvider>
      </SWRConfig>
    </>
  )
}

function AuthedApp({ pageProps, ...rest }) {
  const { statusCode } = pageProps
  const router = useRouter()
  // if we try to render auth around the 404 it triggers an infinite redirect loop,
  // I think because the 404 is a special static page in Next.js? to avoid this, don't render
  // auth around the 404 page
  return (statusCode == 404) ? (
    <MyApp pageProps={pageProps} {...rest} />
  ): (
      <AuthenticationProvider onSessionRestore = {url => router.replace(url)}>
        <RenderAfterAuthed>
          <MyApp pageProps={pageProps} {...rest} />
        </RenderAfterAuthed>
    </AuthenticationProvider >
  )
}

export default AuthedApp
