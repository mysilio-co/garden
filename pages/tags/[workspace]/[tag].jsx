import { useState } from 'react'
import { useRouter } from 'next/router'
import { useWebId } from 'swrlit'
import { getUrl, getUrlAll, getThing } from '@inrupt/solid-client'

import { useCombinedWorkspaceIndexDataset } from '../../../hooks/concepts'
import { useWorkspace } from '../../../hooks/app'
import { useGarden } from '../../../hooks/concepts'
import { WorkspaceProvider } from "../../../contexts/WorkspaceContext"
import { US } from '../../../vocab'
import { tagNameToUrlSafeId } from '../../../utils/uris'
import { conceptUrisTaggedWith } from '../../../model/concept'
import Nav from '../../../components/nav'
import HeaderWithData from '../../../components/HeaderWithData'
import ProfileDrawerWithData from '../../../components/ProfileDrawerWithData'
import Cards from '../../../components/Cards'

export default function TagPage() {
  const router = useRouter()
  const { query: { tag, workspace: workspaceSlug } } = router
  const webId = useWebId()
  const { workspace } = useWorkspace(webId, workspaceSlug)
  const tagPrefix = workspace && getUrl(workspace, US.tagPrefix)
  const namespacedTag = tagPrefix && tag && `${tagPrefix}${tagNameToUrlSafeId(tag)}`

  const { garden } = useGarden(webId, workspaceSlug)
  // TODO: is there a model function for this?
  const tagged = garden && garden.filter(g => {
    const tags = getUrlAll(g, US.tagged)
    return (tags.indexOf(namespacedTag) >= 0)
  })
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false)

  return (
    <>
      <HeaderWithData
        setDrawerOpen={setProfileDrawerOpen}
        drawerOpen={profileDrawerOpen}
      />
      <div className="py-6 px-18">
        <WorkspaceProvider webId={webId} slug={workspaceSlug}>
          <div className="text-center">
            <h1 className="text-2xl mb-4">notes tagged with #{tag}</h1>
            <Cards webId={webId} garden={tagged} workspaceSlug={workspaceSlug} />
          </div>
          <ProfileDrawerWithData isOpen={profileDrawerOpen} setIsOpen={setProfileDrawerOpen} webId={webId} />
        </WorkspaceProvider>
      </div>
    </>
  );
}
