import dynamic from 'next/dynamic'
import 'tippy.js/dist/tippy.css';
import "cropperjs/dist/cropper.css";
import '../styles/index.css'
import Head from 'next/head'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { SWRConfig } from 'swr'

const LoginVerifier = dynamic(
  () => import('../components/LoginVerifier'),
  {ssr: false}
)
const AuthenticatedSolidApp = dynamic(
  () => import('../components/AuthenticatedSolidApp'))

function MyApp({ Component, pageProps }) {

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



function AuthedApp(props) {
  const { pageProps, ...rest } = props
  const { statusCode } = pageProps
  // if we try to render auth around the 404 it triggers an infinite redirect loop,
  // I think because the 404 is a special static page in Next.js? to avoid this, don't render
  // auth around the 404 page
  return (statusCode == 404) ? (
    <MyApp pageProps={pageProps} {...rest} />
  ) : (
    <AuthenticatedSolidApp AppComponent={MyApp} appProps={props} />
  )
}

export default AuthedApp
