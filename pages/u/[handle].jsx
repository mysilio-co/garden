import { useMemo, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useProfile } from 'swrlit/hooks/things'
import { useWebId } from 'swrlit/contexts/authentication'
import { useSpace, useFilteredGarden } from 'garden-kit/hooks'
import { HomeSpaceSlug, getGardenFileAll } from 'garden-kit/spaces'

import { Loader } from '../../components/elements'

import { handleToWebId } from '../../utils/uris'
import Cards from '../../components/Cards'
import WebMonetization from '../../components/WebMonetization'
import GardenHeader from '../../components/GardenHeader'
import LeftNavLayout from '../../components/LeftNavLayout'

function ProfileCards({ webId, search }) {
  const slug = HomeSpaceSlug
  const { space } = useSpace(webId, slug)
  const urls = getGardenFileAll(space)
  const url = urls && urls[0]

  const { garden, error } = useFilteredGarden(url, search)
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
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const {
    query: { handle },
  } = router
  const webId = handleToWebId(handle)
  const [search, setSearch] = useState('')

  const { profile } = useProfile(webId)
  const myWebId = useWebId()
  const headerProps = useMemo(
    () => ({
      onSearch: setSearch,
      authorProfile: profile,
    }),
    [profile]
  )
  return (
    <LeftNavLayout
      pageName={myWebId ? `My Profile` : `${webId} Profile`}
      HeaderComponent={GardenHeader}
      headerProps={headerProps}
    >
      <WebMonetization webId={webId} />
      <div className="p-6">
        <ProfileCards webId={webId} search={search} />
      </div>
    </LeftNavLayout>
  )
}
