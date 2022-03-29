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
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="monetization" content="$ilp.uphold.com/DYPhbXPmDa2P" key="monetization" />
        <title>Mysilio Garden</title>
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
  ) : (
    <AuthenticationProvider onSessionRestore={url => router.replace(url)}>
      <RenderAfterAuthed>
        <MyApp pageProps={pageProps} {...rest} />
      </RenderAfterAuthed>
    </AuthenticationProvider >
  )
}

export default AuthedApp
