import { useLoggedIn, useWebId } from 'swrlit'
import Header from '../components/Header'
import { Loader } from '../components/elements'
import { useAppSettings, useSpaces } from '../model/GardenKit/hooks';
import { useApp } from '../hooks/app'
import Welcome from '../components/onboarding/Welcome'
import { hasRequiredSpaces } from '../model/GardenKit/spaces';

function Setup({ webId }) {
  const { app, initApp, error: appError } = useApp(webId);

  return (
    <>
      <Header />
      <div className="text-center pt-12">
        {app && appError && appError.statusCode === 404 ? (
          <>
            <h3 className="text-xl pb-6">
              Welcome to Mysilio! It looks like you don't have any Spaces set up
              yet.
            </h3>
            <button className="btn-md btn-filled btn-square h-10 mr-1">
              Create your Home Space
            </button>
          </>
        ) : (
          <>
            <h3 className="text-xl pb-6">
              We've upgraded our data format! Click below to import your data.
            </h3>
            <button className="btn-md btn-filled btn-square h-10 mr-1">
              Migrate your data
            </button>
          </>
        )}
      </div>
    </>
  );
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

export default function SetupPage() {
  const loggedIn = useLoggedIn();
  const webId = useWebId();
  const { spaces } = useSpaces(webId);

  return (
    <div className="page" id="page">
      {loggedIn === true ? (
        hasRequiredSpaces(spaces) ? (
          'Everything is set up'
        ) : spaces ? (
          <Setup webId={webId} />
        ) : (
          <LoadingPage />
        )
      ) : loggedIn === false || loggedIn === null ? (
        <div className="text-center">
          <Welcome />
        </div>
      ) : (
        <Loader className="flex flex-row justify-center mt-36" />
      )}
    </div>
  );
}
