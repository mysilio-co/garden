import { useLoggedIn, useWebId } from 'swrlit/contexts/authentication'
import { useSpacesWithSetup } from 'garden-kit/hooks'
import { hasRequiredSpaces } from 'garden-kit/spaces'

import Header from '../components/GardenHeader'
import { Loader } from '../components/elements'

import Login from '../components/Login'
import Dashboard from '../components/Dashboard'

import { getSourceUrl } from '@inrupt/solid-client'
import { deleteResource } from '../utils/fetch'

function InitPage({ initApp }) {
  return (
    <>
      <Header />
      <div className="text-center pt-12">
        <h3 className="text-xl pb-6">looks like this is your first time here!</h3>
        <button className="btn" onClick={initApp}>get started</button>
      </div>
    </>
  )
}

function LoadingPage() {
  return (
    <>
      <div className="text-center h-full w-full">
        <Loader className="absolute top-1/2 left-1/2" />
      </div>
    </>
  )
}

export default function IndexPage() {
  const loggedIn = useLoggedIn()
  const webId = useWebId()
  const { spaces, setupDefaultSpaces, error: spacesError } = useSpacesWithSetup(webId)
  const spacesConfigDoesntExist = !!(spacesError && (spacesError.statusCode === 404))
  const setupComplete = spaces && hasRequiredSpaces(spaces)
  return (
    <div className="page" id="page">
      {(loggedIn === true) ? (
        setupComplete ? (
          <Dashboard />
        ) : (
          (spacesConfigDoesntExist) ? (
            <InitPage initApp={setupDefaultSpaces} />
          ) : (
            <LoadingPage />
          )
        )
      ) : (
        ((loggedIn === false) || (loggedIn === null)) ? (
          <div className="text-center">
            <Login />
          </div>
        ) : (
          <Loader className="flex flex-row justify-center mt-36" />
        )
      )}
    </div>
  )
}
