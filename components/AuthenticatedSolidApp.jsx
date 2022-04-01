import { AuthenticationProvider, useAuthentication } from 'swrlit'
import { useRouter } from 'next/router'

function RenderAfterAuthed({ children }) {
  const { info } = useAuthentication()

  return info ? (
    <>
      {children}
    </>
  ) : (<></>)
}

export default function AuthenticatedSolidApp({ AppComponent, appProps }) {
  const { pageProps, ...rest } = appProps
  const router = useRouter()
  return (
    <AuthenticationProvider onSessionRestore={url => router.replace(url)}>
      <RenderAfterAuthed>
        <AppComponent pageProps={pageProps} {...rest} />
      </RenderAfterAuthed>
    </AuthenticationProvider >
  )
}