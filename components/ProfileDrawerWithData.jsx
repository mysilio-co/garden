import { useMyProfile, useLoggedIn, useAuthentication } from 'swrlit'

import { useConceptNames } from '../hooks/concepts'

import ProfileDrawer from './ProfileDrawer'

export default function ProfileDrawerWithData(props) {
  const loggedIn = useLoggedIn()
  const { logout } = useAuthentication()
  const conceptNames = useConceptNames()
  return (
    <ProfileDrawer
      loggedIn={loggedIn}
      logout={logout}
      conceptNames={conceptNames}
      {...props}
    />
  );
}