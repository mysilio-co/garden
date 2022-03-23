import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { useProfile, useWebId } from 'swrlit'

import { handleToWebId, profilePath } from "../../utils/uris"
import Cards from '../../components/Cards'
import WebMonetization from '../../components/WebMonetization'
import GardenHeader from '../../components/GardenHeader'
import LeftNavLayout from '../../components/LeftNavLayout'

import { WorkspaceProvider } from '../../contexts/WorkspaceContext'
import { useGarden } from '../../hooks/concepts'

export default function ProfilePage() {
  const router = useRouter()
  const { query: { handle } } = router
  const webId = handleToWebId(handle)
  const workspaceSlug = 'default';
  const { garden } = useGarden(webId, workspaceSlug);

  const { profile } = useProfile(webId)
  const myWebId = useWebId()
  const headerProps = useMemo(() => ({authorProfile: profile}), [profile])
  return (
    <LeftNavLayout pageName={myWebId ? `My Profile` : `${webId} Profile`} HeaderComponent={GardenHeader} headerProps={headerProps}>
      <WebMonetization webId={webId} />
      <div className="p-6">
        <WorkspaceProvider webId={webId} slug={workspaceSlug}>
          <Cards webId={webId} garden={garden} workspaceSlug={workspaceSlug} />
        </WorkspaceProvider>
      </div>
    </LeftNavLayout>
  );
}
