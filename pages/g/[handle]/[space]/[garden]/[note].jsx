import { useRouter } from 'next/router'

import NotePageComponent from "../../../../../components/NotePage"
import { urlSafeIdToGardenUrl, handleToWebId } from "../../../../../utils/uris"

export default function NotePage() {
  const router = useRouter()
  const { query: { note, workspace, handle, garden } } = router
  const webId = handleToWebId(handle)
  const gardenUrl = garden && urlSafeIdToGardenUrl(garden);

  return (
      <NotePageComponent editorId="note-page-editor" webId={webId} workspaceSlug={workspace} slug={note} gardenUrl={gardenUrl} />
  )
}
