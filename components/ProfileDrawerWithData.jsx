import { useCallback } from 'react'
import {
  useProfile,
  useLoggedIn,
  useAuthentication,
} from 'swrlit/contexts/authentication'
import { useProfile } from 'swrlit/hooks/things'

import { useRouter } from 'next/router'

import { useConceptNames } from '../hooks/concepts'
import ProfileDrawer from './ProfileDrawer'

export default function ProfileDrawerWithData({ webId, ...props }) {
  const loggedIn = useLoggedIn()
  const { logout } = useAuthentication()
  const conceptNames = useConceptNames()
  const { profile, save: saveProfile } = useProfile(webId)
  const router = useRouter()
  const logoutAndRedirect = useCallback(() => {
    logout()
    router.push('/')
  }, [router, logout])
  return (
    <ProfileDrawer
      loggedIn={loggedIn}
      logout={logoutAndRedirect}
      conceptNames={conceptNames}
      profile={profile}
      saveProfile={saveProfile}
      {...props}
    />
  )
}
