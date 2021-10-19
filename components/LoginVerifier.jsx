import { useEffect } from 'react'
import { useWorkspace } from '../hooks/app'
import { useAuthentication, useWebId, useLoggedIn } from 'swrlit'


function LoggedInStateVerifier(){
  const { logout } = useAuthentication()
  const webId = useWebId()
  const { error } = useWorkspace(webId, "default", "private")
  useEffect(function () {
    if (error && (error.statusCode == 401)) {
      logout()
    }
  }, [error && error.statusCode])
  return (
    <></>
  )
}

export default function LoginVerifier() {
  const loggedIn = useLoggedIn()
  if (loggedIn) {
    return <LoggedInStateVerifier/>
  } else {
    return <></>
  }
}