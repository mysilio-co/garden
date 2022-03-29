import { useState, useMemo } from 'react'
import { useWebId } from 'swrlit'

import WebMonetization from '../components/WebMonetization'
import GardenHeader from './GardenHeader'
import LeftNavLayout from '../components/LeftNavLayout'
import { WorkspaceProvider } from '../contexts/WorkspaceContext'
import { useFilteredGarden } from '../hooks/concepts';
import Cards from '../components/Cards';

export default function Dashboard() {
  const webId = useWebId();
  const workspaceSlug = 'default';
  const [search, setSearch] = useState('');
  const { garden } = useFilteredGarden(webId, workspaceSlug, search);
  const headerProps = useMemo(() => ({
    onSearch: setSearch,
    type: 'dashboard'
  }), [setSearch])
  return (
    <LeftNavLayout pageName="Dashboard" HeaderComponent={GardenHeader} headerProps={headerProps} >
      <WebMonetization webId={webId} />
      <div className="p-6">
        <WorkspaceProvider webId={webId} slug={workspaceSlug}>
          <Cards webId={webId} garden={garden} workspaceSlug={workspaceSlug} />
        </WorkspaceProvider>
      </div>
    </LeftNavLayout>
  );
}
