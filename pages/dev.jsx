import { useState } from 'react'
import { useWebId } from 'swrlit/contexts/authentication'
import { useSpacesWithSetup } from 'garden-kit/hooks'
import { getSpaceAll, getPrivateFile, getPublicFile, getCompostFile, getNurseryFile } from 'garden-kit/spaces'

import { getSourceUrl } from '@inrupt/solid-client'
import { deleteResource } from '../utils/fetch'
import { Loader } from '../components/elements'

export default function DevConsolePage() {
  const [saving, setSaving] = useState(false)
  const webId = useWebId()
  const { spaces } = useSpacesWithSetup(webId)

  async function deleteSpaces() {
    setSaving(true)
    const saveResult = Promise.all([...getSpaceAll(spaces).map(
      function deleteSpace(space) {
        return Promise.all([
          deleteResource(getPrivateFile(space)),
          deleteResource(getPublicFile(space)),
          deleteResource(getCompostFile(space)),
          deleteResource(getNurseryFile(space)),
          deleteResource(getSourceUrl(spaces))
        ])
      }
    )])
    await saveResult
    setSaving(false)
    return saveResult
  }
  global.deleteSpaces = deleteSpaces



  return (
    <div>
      {saving ? (
        <Loader />
      ) : (
        <button className="btn-filled btn-md btn-square font-bold" onClick={deleteSpaces}>delete spaces</button>
      )}
    </div>
  )
}
