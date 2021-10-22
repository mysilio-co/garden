import { useWebId } from 'swrlit'
import WebMonetization from '../components/WebMonetization'
import HeaderWithData from '../components/HeaderWithData'
import { WorkspaceProvider } from '../contexts/WorkspaceContext'
import Cards from '../components/Cards';

export default function Dashboard() {
  const webId = useWebId()
  return (
    <>
      <WebMonetization webId={webId} />
      <HeaderWithData type="dashboard" />
      <div className="py-6 px-18">
        <WorkspaceProvider webId={webId} slug="default">
          <Cards webId={webId} />
        </WorkspaceProvider>
      </div>
    </>
  );
}