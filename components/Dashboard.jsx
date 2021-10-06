import { useMyProfile, useWebId, useLoggedIn, useAuthentication } from 'swrlit'
import WebMonetization from '../components/WebMonetization'
import Header from '../components/Header'
import { WorkspaceProvider } from '../contexts/WorkspaceContext'
import Notes from '../components/Notes'

export default function Dashboard() {
  const webId = useWebId()
  const { profile } = useMyProfile()
  const loggedIn = useLoggedIn()
  const {logout} = useAuthentication()

  return (
    <>
      <WebMonetization webId={webId} />
      <Header profile={profile} logout={logout} loggedIn={loggedIn}/>
      <div className="py-6 px-18">
        <WorkspaceProvider webId={webId} slug="default">
          <Notes webId={webId} />
        </WorkspaceProvider>
      </div>
    </>
  )
}