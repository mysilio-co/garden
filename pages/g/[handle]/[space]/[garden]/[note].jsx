import { useRouter } from 'next/router'

import NotePageComponent from "../../../../../components/NotePage"
import { urlSafeIdToGardenUrl, handleToWebId } from "../../../../../utils/uris"

export default function NotePage() {
  const router = useRouter()
  const { query: { note, space, handle, garden } } = router
  const webId = handle && handleToWebId(handle)
  const gardenUrl = garden && urlSafeIdToGardenUrl(garden);

  return (
      <NotePageComponent editorId={`${gardenUrl}#${note}`} webId={webId} spaceSlug={space} slug={note} gardenUrl={gardenUrl} />

  )
}
