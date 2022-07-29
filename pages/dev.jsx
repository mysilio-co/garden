import { useWebId } from 'swrlit/contexts/authentication'
import { useSpacesWithSetup } from 'garden-kit/hooks'
import { getSpaceAll, getPrivateFile, getPublicFile, getCompostFile, getNurseryFile } from 'garden-kit/spaces'

import { getSourceUrl } from '@inrupt/solid-client'
import { deleteResource } from '../utils/fetch'


export default function DevConsolePage() {
  const webId = useWebId()
  const { spaces } = useSpacesWithSetup(webId)

  function deleteSpaces() {
    for (let space of getSpaceAll(spaces)){
      deleteResource(getPrivateFile(space))
      deleteResource(getPublicFile(space))
      deleteResource(getCompostFile(space))
      deleteResource(getNurseryFile(space))
      deleteResource(getSourceUrl(spaces))
    }
  }
  global.deleteSpaces = deleteSpaces

  return (
    <div>
      <button className="btn" onClick={deleteSpaces}>delete spaces</button>
    </div>
  )
}
