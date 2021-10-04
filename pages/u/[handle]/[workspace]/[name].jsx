import { useRouter } from 'next/router'
import { useWebId } from 'swrlit'

import ConceptEditor from "../../../../components/ConceptEditor"
import { handleToWebId } from "../../../../utils/uris"
import { WorkspaceProvider } from "../../../../contexts/WorkspaceContext"

export default function NotePage(){
  const router = useRouter()
  const { query: { name, workspace, handle } } = router
  const webId = handleToWebId(handle)

  return (
    <WorkspaceProvider webId={webId} slug={workspace}>
      <ConceptEditor webId={webId} workspaceSlug={workspace} slug={name}/>
    </WorkspaceProvider>
  )
}
