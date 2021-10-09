import { useWebId } from 'swrlit'
import WebMonetization from '../components/WebMonetization'
import HeaderWithData from '../components/HeaderWithData'
import { WorkspaceProvider } from '../contexts/WorkspaceContext'
import Notes from '../components/Notes'

export default function Dashboard() {
  const webId = useWebId()
  return (
    <>
      <WebMonetization webId={webId} />
      <HeaderWithData type="dashboard"/>
      <div className="py-6 px-18">
        <WorkspaceProvider webId={webId} slug="default">
          <Notes webId={webId} />
        </WorkspaceProvider>
      </div>
    </>
  )
}