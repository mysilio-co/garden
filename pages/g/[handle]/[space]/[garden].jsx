import { useState, useMemo, useContext } from 'react';
import { useGardenWithSetup, useGarden } from 'garden-kit/hooks';
import { useRouter } from 'next/router';

import WebMonetization from '../../../../components/WebMonetization';
import GardenHeader from '../../../../components/GardenHeader';
import { Loader } from '../../../../components/elements';
import LeftNavLayout from '../../../../components/LeftNavLayout';
import Cards from '../../../../components/Cards';

import GardenContext from '../../../../contexts/GardenContext';
import SpaceContext from '../../../../contexts/SpaceContext';

import { handleToWebId, urlSafeIdToGardenUrl } from '../../../../utils/uris';

function GardenCreator({ url }) {
  const { setupGarden } = useGardenWithSetup(url);
  return <button onClick={setupGarden}>Create Garden</button>;
}

function Garden({ webId, search }) {
  const { slug } = useContext(SpaceContext);
  const { url } = useContext(GardenContext);
  const { garden, error } = useGarden(url);
  return (
    <div>
      {garden ? (
        <Cards webId={webId} garden={garden} spaceSlug={slug} />
      ) : error && error.statusCode === 404 ? (
        <GardenCreator url={url} />
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default function GardenPage() {
  const router = useRouter();
  const {
    query: { handle, space, garden },
  } = router;
  const webId = handle && handleToWebId(handle);
  const spaceSlug = space;
  const gardenUrl = garden && urlSafeIdToGardenUrl(garden);
  const { settings } = useGarden(gardenUrl);
  const [search, setSearch] = useState('');
  const headerProps = useMemo(
    () => ({
      onSearch: setSearch,
      gardenSettings: settings,
    }),
    [setSearch, settings]
  );
  return (
    <LeftNavLayout
      pageName="Garden"
      HeaderComponent={GardenHeader}
      headerProps={headerProps}
      spaceSlug={spaceSlug}
      gardenUrl={gardenUrl}
    >
      <WebMonetization webId={webId} />
      <div className="p-6">
        <Garden webId={webId} search={search} />
      </div>
    </LeftNavLayout>
  );
}
