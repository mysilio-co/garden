import { useState, useMemo, useContext } from 'react'
import { useWebId } from 'swrlit/contexts/authentication'
import { useFilteredGarden, useGardenWithSetup, useSpace } from 'garden-kit/hooks';
import { getGardenFileAll } from 'garden-kit/spaces'
import { getItemAll } from 'garden-kit/garden';
//import { useFilteredGarden } from '../hooks/concepts';


import WebMonetization from '../components/WebMonetization'
import GardenHeader from './GardenHeader'
import { Loader } from './elements'
import LeftNavLayout from '../components/LeftNavLayout'
import Cards from '../components/Cards'

import SpaceContext from '../contexts/SpaceContext';
import { getThingAll } from '@inrupt/solid-client';

function GardenCreator({ url }) {
  const { garden, error, setupGarden } = useGardenWithSetup(url);
  return (
    <button onClick={setupGarden}>Create Garden</button>
  )

}

function Garden({ url, search }) {
  const { garden, error } = useFilteredGarden(url, search);
  const items = garden && getItemAll(garden)
  return (
    <div>
      {garden ? (console.log("garden", getItemAll(garden)) ||
        <Cards garden={items} workspaceSlug="default"/>
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
  const { slug } = useContext(SpaceContext)
  const { space } = useSpace(webId, slug)
  const gardenUrls = space && getGardenFileAll(space)
  console.log("home", space, gardenUrls)

  const headerProps = useMemo(() => ({
    onSearch: setSearch,
  }), [setSearch])
  return (
    <LeftNavLayout pageName="Dashboard" HeaderComponent={GardenHeader} headerProps={headerProps} >
      <WebMonetization webId={webId} />
      <div className="p-6">
        <Garden url={gardenUrls && gardenUrls[0]} search={search} />
      </div>
    </LeftNavLayout>
  );
}
