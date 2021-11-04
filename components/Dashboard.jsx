import { useState } from 'react'
import { useWebId } from 'swrlit'
import WebMonetization from '../components/WebMonetization'
import HeaderWithData from '../components/HeaderWithData'
import { WorkspaceProvider } from '../contexts/WorkspaceContext'
import { useFilteredGarden } from '../hooks/concepts';
import Cards from '../components/Cards';

export default function Dashboard() {
  const webId = useWebId();
  const workspaceSlug = 'default';
  const [search, setSearch] = useState('');
  const { garden } = useFilteredGarden(webId, workspaceSlug, search);

  return (
    <>
      <WebMonetization webId={webId} />
      <HeaderWithData
        type="dashboard"
        onSearch={(s) => {
          setSearch(s);
        }}
      />
      <div className="py-6 px-18">
        <WorkspaceProvider webId={webId} slug={workspaceSlug}>
          <Cards webId={webId} garden={garden} workspaceSlug={workspaceSlug} />
        </WorkspaceProvider>
      </div>
    </>
  );
}