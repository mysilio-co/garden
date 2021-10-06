import { useMyProfile, useLoggedIn, useAuthentication } from 'swrlit'
import Header from './Header'

export default function HeaderWithData(props) {
  const { profile } = useMyProfile()
  const loggedIn = useLoggedIn()
  const { logout } = useAuthentication()
  return (
    <Header profile={profile} loggedIn={loggedIn} logout={logout} {...props} />
  )
}