import { useRouter } from 'next/router'
import { useWebId } from 'swrlit'

import ConceptPage from "../../../../components/ConceptPage"
import { handleToWebId } from "../../../../utils/uris"
import { WorkspaceProvider } from "../../../../contexts/WorkspaceContext"

export default function NotePage(){
  const router = useRouter()
  const { query: { name, workspace, handle } } = router
  const webId = handleToWebId(handle)

  return (
    <WorkspaceProvider webId={webId} slug={workspace}>
      <ConceptPage webId={webId} workspaceSlug={workspace} slug={name}/>
    </WorkspaceProvider>
  )
}
