import { useLoggedIn, useWebId } from 'swrlit/contexts/authentication'

import Header from '../components/GardenHeader'
import { Loader } from '../components/elements'

import { useApp } from '../hooks/app'

import Login from '../components/Login'
import Dashboard from '../components/Dashboard'
import { useEffect } from 'react'

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
  const { app, initApp, error: appError } = useApp(webId)
  useEffect(() => {
    console.log(`loggedIn? ${loggedIn} as webId ${webId}`);
    console.log(`app ${app} / ${appError}`);
  }, [loggedIn, webId, app, appError]);
  return (
    <div className="page" id="page">
      {(loggedIn === true) ? (
        app ? (
          <Dashboard />
        ) : ((appError && (appError.statusCode === 404)) ? (
          <InitPage initApp={initApp} />
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
