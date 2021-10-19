import { useMyProfile, useLoggedIn, useAuthentication } from 'swrlit'

import { useConceptNames } from '../hooks/concepts'

import Header from './Header'

export default function HeaderWithData(props) {
  const { profile } = useMyProfile()
  const loggedIn = useLoggedIn()
  const { logout } = useAuthentication()
  const conceptNames = useConceptNames()
  return (
    <Header profile={profile} loggedIn={loggedIn} logout={logout} conceptNames={conceptNames} {...props} />
  )
}