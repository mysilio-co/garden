import { useState, useMemo, useContext } from 'react'
import { useWebId } from 'swrlit/contexts/authentication'
import { useFilteredGarden, useGardenWithSetup } from 'garden-kit/hooks';

import WebMonetization from '../components/WebMonetization'
import GardenHeader from './GardenHeader'
import { Loader } from './elements'
import LeftNavLayout from '../components/LeftNavLayout'
import Cards from '../components/Cards'

import GardenContext from '../contexts/GardenContext';
import SpaceContext from '../contexts/SpaceContext';

function GardenCreator({ url }) {
  const { setupGarden } = useGardenWithSetup(url);
  return (
    <button onClick={setupGarden}>Create Garden</button>
  )
}

function Garden({ search }) {
  const webId = useWebId();
  const { slug } = useContext(SpaceContext)
  const { url } = useContext(GardenContext)
  const { garden, error } = useFilteredGarden(url, search);
  return (
    <div>
      {garden ? (
        <Cards webId={webId} garden={garden} spaceSlug={slug} />
      ) : (
        (error && (error.statusCode === 404)) ? (
          <GardenCreator url={url} />
        ) : (
          <Loader />
        )
      )}
    </div>
  )
}

export default function Dashboard() {
  const webId = useWebId();
  const [search, setSearch] = useState('');

  const headerProps = useMemo(() => ({
    onSearch: setSearch,
  }), [setSearch])
  return (
    <LeftNavLayout pageName="Dashboard" HeaderComponent={GardenHeader} headerProps={headerProps} >
      <WebMonetization webId={webId} />
      <div className="p-6">
        <Garden search={search} />
      </div>
    </LeftNavLayout>
  );
}
