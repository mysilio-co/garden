import { useProfile, useLoggedIn, useAuthentication } from 'swrlit'

import { useConceptNames } from '../hooks/concepts'

import ProfileDrawer from './ProfileDrawer'

export default function ProfileDrawerWithData({ webId, ...props }) {
  const loggedIn = useLoggedIn()
  const { logout } = useAuthentication()
  const conceptNames = useConceptNames()
  const { profile, save: saveProfile } = useProfile(webId)
  return (
    <ProfileDrawer
      loggedIn={loggedIn}
      logout={logout}
      conceptNames={conceptNames}
      profile={profile}
      saveProfile={saveProfile}
      {...props}
    />
  );
}