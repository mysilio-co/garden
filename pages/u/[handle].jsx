import { useState } from 'react'
import { useRouter } from 'next/router'
import { FOAF } from '@inrupt/vocab-common-rdf'
import { sioc as SIOC } from 'rdf-namespaces'
import { getStringNoLocale, addUrl, removeUrl, getUrl } from '@inrupt/solid-client'
import { useProfile, useMyProfile, useWebId } from 'swrlit'

import { handleToWebId, profilePath } from "../../utils/uris"
import Cards from '../../components/Cards'
import WebMonetization from '../../components/WebMonetization'
import HeaderWithData from '../../components/HeaderWithData'
import ProfileDrawerWithData from '../../components/ProfileDrawerWithData'
import { WorkspaceProvider } from '../../contexts/WorkspaceContext'
import { useFollows } from '../../hooks/people'
import { useGarden } from '../../hooks/concepts'

export default function ProfilePage() {
  const router = useRouter()
  const { query: { handle } } = router
  const webId = handleToWebId(handle)
  const workspaceSlug = 'default';
  const { garden } = useGarden(webId, workspaceSlug);

  const { profile } = useProfile(webId)
  const name = profile && getStringNoLocale(profile, FOAF.name)

  const { profile: myProfile, save: saveProfile } = useMyProfile()
  const profileImage = profile && getUrl(profile, FOAF.img)

  async function follow() {
    await saveProfile(addUrl(myProfile, SIOC.follows, webId))
  }
  async function unfollow() {
    await saveProfile(removeUrl(myProfile, SIOC.follows, webId))
  }
  const myWebId = useWebId()
  const isMyProfile = (myWebId === webId)
  const follows = useFollows()
  const alreadyFollowing = follows && follows.includes(webId)
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false)
  return (
    <div className="page">
      <WebMonetization webId={webId} />
      <HeaderWithData
        setDrawerOpen={setProfileDrawerOpen}
        drawerOpen={profileDrawerOpen}
      />
      <div className="px-18">
        <div className="flex flex-row mt-6 mb-6 justify-between items-start">
          <div className="flex flex-row">
            {profileImage && (
              <img
                className="rounded-full h-36 w-36 object-cover mr-12"
                src={profileImage}
              />
            )}
            <div className="flex flex-col">
              {name && <h3 className="text-4xl text-center">{name}</h3>}
            </div>
          </div>
          {follows &&
            !isMyProfile &&
            (alreadyFollowing ? (
              <button
                className="btn-md btn-filled btn-square py-1"
                onClick={unfollow}
              >
                unfollow
              </button>
            ) : (
              <button
                className="btn-md btn-filled btn-square py-1"
                onClick={follow}
              >
                follow
              </button>
            ))}
        </div>
        <WorkspaceProvider webId={webId} slug={workspaceSlug}>
          <Cards webId={webId} garden={garden} workspaceSlug={workspaceSlug} />
          <ProfileDrawerWithData isOpen={profileDrawerOpen} setIsOpen={setProfileDrawerOpen} webId={myWebId}/>
        </WorkspaceProvider>
      </div>
    </div>
  );
}
