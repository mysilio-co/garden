import { useRouter } from 'next/router'

import ConceptPageComponent from "../../../../components/ConceptPage"
import { handleToWebId } from "../../../../utils/uris"
import { WorkspaceProvider } from "../../../../contexts/WorkspaceContext"

export default function ConceptPage() {
  const router = useRouter()
  const { query: { name, workspace, handle } } = router
  const webId = handleToWebId(handle)

  return (
      <ConceptPageComponent webId={webId} workspaceSlug={workspace} slug={name} />
  )
}
