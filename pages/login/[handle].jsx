import { useEffect, useState } from 'react'
import { useAuthentication } from 'swrlit'
import { useRouter } from 'next/router'
import { handleToIdp } from '../../utils/uris'

export default function Login() {
  const router = useRouter()
  const { handle } = router.query
  const { info, login } = useAuthentication()
  const [loggingIn, setLoggingIn] = useState(false)
  useEffect(function logUserIn() {
    if (handle && !loggingIn && info) {
      if (info.isLoggedIn) {
        router.replace("/")
      } else {
        setLoggingIn(true)
        login({oidcIssuer: handleToIdp(handle), redirectUrl: window.location.href, clientName: "Mysilio Garden"})
      }
    }
  }, [login, info, handle])
  return (
    <div></div>
  )
}
