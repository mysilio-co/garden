import HeaderWithData from './HeaderWithData'

function DevTools() {
  const webId = useWebId()

  const { resource: appResource } = useApp(webId)
  const { public: workspacePreferencesFileUri } = useWorkspacePreferencesFileUris(webId)
  return (
    <ul className="flex flex-column">
      <li className="mx-3">
        prefix: {appPrefix}
      </li>
      <li>
        <button className="btn text-xs" onClick={() => deleteResource(getSourceUrl(appResource))}>
          delete app file
        </button>
      </li>
      <li>
        <button className="btn text-xs" onClick={() => deleteResource(workspacePreferencesFileUri)}>
          delete default workspace
        </button>
      </li>
    </ul>
  )
}

export default function Nav() {
  return (
    <HeaderWithData/>
  )
}
