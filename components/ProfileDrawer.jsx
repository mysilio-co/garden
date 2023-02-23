import Link from 'next/link'
import { asUrl } from '@inrupt/solid-client/thing/thing'
import ProfileImage from './ProfileDrawer/Image'
import Name from './ProfileDrawer/Name'
import Username from './ProfileDrawer/Username'
import WebMonetizationPointer from './ProfileDrawer/WebMonetizationPointer'
import { profilePath } from '../utils/uris'
import { Close, ExternalLinkIcon } from './icons'

export default function ProfileDrawer({ profile, saveProfile, setIsOpen }) {
  return (
    <div className="text-gray-200">
      <div className="flex justify-between mb-12">
        {profile && (
          <div className="">
            <ProfileImage profile={profile} saveProfile={saveProfile} />
          </div>
        )}
        <div className="flex justify-end">
          <button
            className="rounded-full border h-8 w-8 ml-2"
            onClick={() => setIsOpen(false)}
          >
            <Close className="w-5 h-5 m-auto" />
          </button>
        </div>
      </div>
      {profile && (
        <Link href={`${profilePath(asUrl(profile))}`}>
          <a className="text-purple-300">
            View Public Profile <ExternalLinkIcon className="w-4 h-4 inline" />
          </a>
        </Link>
      )}
      <Name profile={profile} saveProfile={saveProfile} className="my-2" />
      <Username profile={profile} saveProfile={saveProfile} className="my-2" />
      <WebMonetizationPointer
        profile={profile}
        saveProfile={saveProfile}
        className="my-2"
      />
    </div>
  )
}
