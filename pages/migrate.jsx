import { useLoggedIn, useWebId } from 'swrlit/contexts/authentication'
import { useApp } from '../hooks/app';
import Header from '../components/GardenHeader';
import Login from '../components/Login'
import { getNurseryFile } from 'garden-kit';
import { useGarden } from '../hooks/concepts';

export default function MigrateV0Data() {
  const loggedIn = useLoggedIn();
  const webId = useWebId();

  const slug = HomeSpaceSlug
  const { space } = useSpace(webId, slug)
  const url = getNurseryFile(space)

  const { app, initApp, error: appError } = useApp(webId);

  const [migrating, setMigrating] = useState(false);
  const [logLines, setLogLines] = useState([]);
  function log(s) {
    setLogLines(logLines.push(s));
  }

  async function onClick() {
    setMigrating(true);
    log('Starting Migration');
    // ...
    setMigrating(false);
    log('Migration Coplete');
  }

  return (
    <div className="page" id="page">
      {loggedIn === true ? (
        <>
          <Header />
          <div className="text-center pt-12 flex flex-col items-center">
            <h3 className="text-xl pb-6">
              Time to migrate your data! Press the button below to get started.{' '}
            </h3>
            {migrating ? (
              logLines.map((line) => {
                <p className="text-l pb-6">{line}</p>;
              })
            ) : (
              <button
                className="btn-filled btn-md btn-square font-bold"
                onClick={onClick}
              >
                Migrate your v0 Data
              </button>
            )}
          </div>
        </>
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
