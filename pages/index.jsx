import { useState } from 'react';
import { useLoggedIn, useWebId } from 'swrlit/contexts/authentication';
import { useSpacesWithSetup } from 'garden-kit/hooks';
import { hasRequiredSpaces } from 'garden-kit/spaces';
import Header from '../components/GardenHeader';
import { Loader } from '../components/elements';

import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import { fuseWebhookUrl } from '../model/search';

export const MysilioKnowledgeGnome =
  process.env.NEXT_PUBLIC_MKG_WEBID || 'https://mysilio.me/mkg/profile/card#me';

function InitPage({ initApp }) {
  const [saving, setSaving] = useState(false);
  async function onClick() {
    setSaving(true);
    await initApp();
    setSaving(false);
  }
  return (
    <>
      <Header />
      <div className="text-center pt-12 flex flex-col items-center">
        <h3 className="text-xl pb-6">
          looks like this is your first time here!
        </h3>
        {saving ? (
          <Loader />
        ) : (
          <button
            className="btn-filled btn-md btn-square font-bold"
            onClick={onClick}
          >
            get started
          </button>
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
  );
}

export default function IndexPage() {
  const loggedIn = useLoggedIn();
  const webId = useWebId();
  const {
    spaces,
    setupDefaultSpaces,
    error: spacesError,
  } = useSpacesWithSetup(webId);
  const spacesConfigDoesntExist = !!(
    spacesError && spacesError.statusCode === 404
  );
  const setupComplete = spaces && hasRequiredSpaces(spaces);
  return (
    <div className="page" id="page">
      {loggedIn === true ? (
        setupComplete ? (
          <Dashboard />
        ) : spacesConfigDoesntExist ? (
          <InitPage
            initApp={() => {
              setupDefaultSpaces(
                [
                  {
                    agent: MysilioKnowledgeGnome,
                    access: {
                      read: true,
                      write: true,
                      append: true,
                      control: false,
                    },
                  },
                ],
                (gardenUrl) => [fuseWebhookUrl(gardenUrl)]
              );
            }}
          />
        ) : (
          <LoadingPage />
        )
      ) : loggedIn === false || loggedIn === null ? (
        <div className="text-center">
          <Login />
        </div>
      ) : (
        <Loader className="flex flex-row justify-center mt-36" />
      )}
    </div>
  );
}
