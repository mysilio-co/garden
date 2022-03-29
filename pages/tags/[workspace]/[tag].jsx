import { useState } from 'react'
import { useRouter } from 'next/router'
import { useWebId } from 'swrlit'
import { getUrl, getUrlAll, getThing } from '@inrupt/solid-client'

import { useWorkspace } from '../../../hooks/app'
import { useGarden } from '../../../hooks/concepts'
import { WorkspaceProvider } from "../../../contexts/WorkspaceContext"
import { US } from '../../../vocab'
import { tagNameToUrlSafeId } from '../../../utils/uris'
import LeftNavLayout from '../../../components/LeftNavLayout'
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
    <LeftNavLayout pageTitle={`Notes Tagged With "${tag}"`}>
      <div className="p-6">
        <WorkspaceProvider webId={webId} slug={workspaceSlug}>
          <Cards webId={webId} garden={tagged} workspaceSlug={workspaceSlug} />
        </WorkspaceProvider>
      </div>
    </LeftNavLayout>
  );
}
