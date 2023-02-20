import { useState, useMemo } from 'react';
import { useWebId } from 'swrlit/contexts/authentication';
import { useGardenWithSetup } from 'garden-kit/hooks';

import WebMonetization from '../components/WebMonetization';
import GardenHeader from './GardenHeader';
import { Loader } from './elements';
import LeftNavLayout from '../components/LeftNavLayout';
import Cards from '../components/Cards';

import { useCommunityGarden } from '../hooks/community';
import { HomeSpaceSlug } from 'garden-kit';

function GardenCreator({ url }) {
  const { setupGarden } = useGardenWithSetup(url);
  return <button onClick={setupGarden}>Create Garden</button>;
}

function Garden({ search }) {
  const webId = useWebId();
  const { garden, error } = useCommunityGarden();
  return (
    <div>
      {garden ? (
        <Cards
          webId={webId}
          garden={garden}
          spaceSlug={HomeSpaceSlug}
          isCommunityGarden={true}
        />
      ) : error && error.statusCode === 404 ? (
        <GardenCreator url={url} />
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default function Dashboard() {
  const webId = useWebId();
  const [search, setSearch] = useState('');

  const headerProps = useMemo(
    () => ({
      onSearch: setSearch,
      type: 'dashboard',
    }),
    [setSearch]
  );
  return (
    <LeftNavLayout
      pageName="Dashboard"
      HeaderComponent={GardenHeader}
      headerProps={headerProps}
    >
      <WebMonetization webId={webId} />
      <div className="p-6">
        <Garden search={search} />
      </div>
    </LeftNavLayout>
  );
}
