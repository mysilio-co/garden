import { useState } from 'react'
import { useRouter } from 'next/router'
import { useWebId } from 'swrlit'
import { getUrl, getThing } from '@inrupt/solid-client'

import { useCombinedWorkspaceIndexDataset } from '../../../hooks/concepts'
import { useWorkspace } from '../../../hooks/app'
import { WorkspaceProvider } from "../../../contexts/WorkspaceContext"
import { US } from '../../../vocab'
import { tagNameToUrlSafeId } from '../../../utils/uris'
import { conceptUrisTaggedWith } from '../../../model/concept'
import Nav from '../../../components/nav'
import HeaderWithData from '../../../components/HeaderWithData'
import ProfileDrawerWithData from '../../../components/ProfileDrawerWithData'
import CardsFromGarden from '../../../components/Cards'

export default function TagPage() {
  const router = useRouter()
  const { query: { tag, workspace: workspaceSlug } } = router
  const webId = useWebId()
  const { workspace } = useWorkspace(webId, workspaceSlug)
  const tagPrefix = workspace && getUrl(workspace, US.tagPrefix)
  const { index } = useCombinedWorkspaceIndexDataset(webId, workspaceSlug)
  const conceptUris = index && conceptUrisTaggedWith(index, `${tagPrefix}${tagNameToUrlSafeId(tag)}`)
  const concepts = conceptUris.map(uri => getThing(index, uri))
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false)

  return (
    <WorkspaceProvider webId={webId} slug={workspace}>
      <div className="page">
        <HeaderWithData
          setDrawerOpen={setProfileDrawerOpen}
          drawerOpen={profileDrawerOpen}
        />
        <div className="text-center py-6">
          <h1 className="text-4xl">notes tagged with #{tag}</h1>
          <CardsFromGarden webId={webId} garden={concepts} />
        </div>
      </div>
      <ProfileDrawerWithData isOpen={profileDrawerOpen} setIsOpen={setProfileDrawerOpen} webId={webId} />
    </WorkspaceProvider>
  );
}
