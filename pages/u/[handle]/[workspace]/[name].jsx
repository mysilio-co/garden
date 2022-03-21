import { useRouter } from 'next/router'

import ConceptPageComponent from "../../../../components/ConceptPage"
import { handleToWebId } from "../../../../utils/uris"
import { WorkspaceProvider } from "../../../../contexts/WorkspaceContext"
import LeftNavLayout from "../../../../components/LeftNavLayout"

export default function ConceptPage() {
  const router = useRouter()
  const { query: { name, workspace, handle } } = router
  const webId = handleToWebId(handle)

  return (
    <LeftNavLayout pageName={`${workspace} Home`}>
      <WorkspaceProvider webId={webId} slug={workspace}>
        <ConceptPageComponent webId={webId} workspaceSlug={workspace} slug={name} />
      </WorkspaceProvider>
    </LeftNavLayout>
  )
}
