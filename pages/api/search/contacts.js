import {
  getSolidDataset,
  getStringNoLocale,
  getThing,
  getThingAll,
  getUrl,
  asUrl,
} from '@inrupt/solid-client'
import Fuse from 'fuse.js'
import { FOAF, OWL } from '@inrupt/vocab-common-rdf'

export const CommunityContactsUrl =
  process.env.NEXT_PUBLIC_COMMUNITY_CONTACTS_URL ||
  'https://mysilio.me/mysilio/spaces/home/contacts.ttl'

export function usernameFromUrl(contactUrl) {
  const url = new URL(contactUrl)
  return url.hash.replace('#', '')
}

export function usernameFromContact(contact) {
  return usernameFromUrl(asUrl(contact))
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // From Vercel docs: "[This] tells our CDN: serve from cache, but update it, if requested after 1 second."
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

    const contacts = await getSolidDataset(CommunityContactsUrl)
    let fuseEntries = []

    for (const contact of getThingAll(contacts)) {
      const webId = getUrl(contact, OWL.sameAs)
      const profile = await getSolidDataset(webId)
      const profileThing = getThing(profile, webId)
      fuseEntries = [
        ...fuseEntries,
        {
          name: getStringNoLocale(profileThing, FOAF.name),
          webId: webId,
          username: usernameFromContact(contact),
          profileImage: getUrl(profileThing, FOAF.img),
          fullProfile,
        },
      ]
    }

    const fuseKeys = ['name', 'webId', 'username']
    console.log('=====================')
    console.log(fuseEntries)
    const index = Fuse.createIndex(fuseKeys, fuseEntries)
    return res.json(index.toJSON())
  } else {
    return res.status(405).json({ message: 'Only supports GET' })
  }
}
