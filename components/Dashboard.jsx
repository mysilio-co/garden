import { useState } from 'react'
import { useWebId } from 'swrlit'

import WebMonetization from '../components/WebMonetization'
import HeaderWithData from '../components/HeaderWithData'
import LeftNavLayout from '../components/LeftNavLayout'
import { WorkspaceProvider } from '../contexts/WorkspaceContext'
import { useFilteredGarden } from '../hooks/concepts';
import Cards from '../components/Cards';
import ProfileDrawerWithData from './ProfileDrawerWithData'

export default function Dashboard() {
  const webId = useWebId();
  const workspaceSlug = 'default';
  const [search, setSearch] = useState('');
  const { garden } = useFilteredGarden(webId, workspaceSlug, search);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false)
  return (
    <LeftNavLayout pageName="Dashboard">
      <WebMonetization webId={webId} />
      <HeaderWithData
        type="dashboard"
        onSearch={(s) => {
          setSearch(s);
        }}
        setDrawerOpen={setProfileDrawerOpen}
        drawerOpen={profileDrawerOpen}
      />
      <div className="py-6 px-18">
        <WorkspaceProvider webId={webId} slug={workspaceSlug}>
          <Cards webId={webId} garden={garden} workspaceSlug={workspaceSlug} />
          <ProfileDrawerWithData isOpen={profileDrawerOpen} setIsOpen={setProfileDrawerOpen} webId={webId}/>
        </WorkspaceProvider>
      </div>
    </LeftNavLayout>
  );
}
