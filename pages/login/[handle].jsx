import { useEffect, useState } from 'react'
import { useAuthentication } from 'swrlit'
import { useRouter } from 'next/router'
import { handleToIdp } from '../../utils/uris'

export default function Login() {
  const router = useRouter()
  const { handle } = router.query
  const { session, login } = useAuthentication()
  const [loggingIn, setLoggingIn] = useState(false)
  useEffect(function logUserIn() {
    if (handle && !loggingIn && session) {
      if (session.loggedIn) {
        router.replace("/")
      } else if (session) {
        setLoggingIn(true)
        login(handleToIdp(handle))
      }
    }
  }, [login, session, handle])
  return (
    <div></div>
  )
}
