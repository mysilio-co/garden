import { useState, useMemo } from 'react'
import { useWebId } from 'swrlit/contexts/authentication'
import { useGarden, useFilteredGarden, useGardenWithSetup, useSpaces } from 'garden-kit/hooks';
import { getSpace, HomeSpaceSlug, getGardenFileAll, getSpaceAll } from 'garden-kit/spaces'
import { getItemAll } from 'garden-kit/garden';
//import { useFilteredGarden } from '../hooks/concepts';


import WebMonetization from '../components/WebMonetization'
import GardenHeader from './GardenHeader'
import { Loader } from './elements'
import LeftNavLayout from '../components/LeftNavLayout'

import { WorkspaceProvider } from '../contexts/WorkspaceContext'
import Cards from '../components/Cards';

function GardenCreator({url}){
  const {garden, error, setupGarden} = useGardenWithSetup(url);
  return (
    <button onClick={setupGarden}>Create Garden</button>
  )

}

function Garden({url, search}){
  const {garden, error} = useFilteredGarden(url, search);
  console.log("loading garden", garden, error)
  return (
    <div>
      {garden ? (

        console.log("garden", getItemAll(garden)) || <div>Garden!</div>
      ) : (
        (error && (error.statusCode === 404)) ? (
          <GardenCreator url={url}/>
        ) : (
          <Loader/>
        )
      )}
    </div>
  )

}

export default function Dashboard() {
  const webId = useWebId();
    const [search, setSearch] = useState('');
  const { spaces } = useSpaces(webId);
  console.log("spaces", spaces && getSpaceAll(spaces))
  const homeSpace = getSpace(spaces, HomeSpaceSlug)
  const gardenUrls = getGardenFileAll(homeSpace)
  console.log("home", homeSpace, gardenUrls)

  const headerProps = useMemo(() => ({
    onSearch: setSearch,
    type: 'dashboard'
  }), [setSearch])
  return (
    <LeftNavLayout pageName="Dashboard" HeaderComponent={GardenHeader} headerProps={headerProps} >
      <WebMonetization webId={webId} />
      <div className="p-6">
        <Garden url={gardenUrls && gardenUrls[0]} search={search}/>
      </div>
    </LeftNavLayout>
  );
}
