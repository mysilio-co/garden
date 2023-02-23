import { useEffect } from 'react'
import { useSpace, useGarden } from 'garden-kit/hooks'
import { HomeSpaceSlug, getPrivateFile } from 'garden-kit/spaces'
import {
  useAuthentication,
  useWebId,
  useLoggedIn,
} from 'swrlit/contexts/authentication'

function LoggedInStateVerifier() {
  const { logout } = useAuthentication()
  const webId = useWebId()
  const { space } = useSpace(webId, HomeSpaceSlug)
  const privateGardenUrl = space && getPrivateFile(space)
  const { error } = useGarden(privateGardenUrl, webId)
  useEffect(
    function () {
      if (error && error.statusCode == 401) {
        logout()
      }
    },
    [error && error.statusCode]
  )
  return <></>
}

export default function LoginVerifier() {
  const loggedIn = useLoggedIn()
  if (loggedIn) {
    return <LoggedInStateVerifier />
  } else {
    return <></>
  }
}
