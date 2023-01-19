import {
  asUrl,
  createThing,
  fromRdfJsDataset,
  getDatetime,
  getThing,
  getThingAll,
  setThing,
  setUrl,
  toRdfJsDataset,
  buildThing,
} from '@inrupt/solid-client';
import { useGarden } from 'garden-kit';
import { RDFS, DCTERMS, OWL } from '@inrupt/vocab-common-rdf';
import { useCallback } from 'react';
import { useResource, useThing } from 'swrlit';

export const CommunityNurseryUrl =
  process.env.NEXT_PUBLIC_COMMUNITY_NURSERY_URL ||
  'https://mysilio.me/mysilio/spaces/home/nursery.ttl';
export const CommunityGardenUrl =
  process.env.NEXT_PUBLIC_COMMUNITY_GARDEN_URL ||
  'https://mysilio.me/mysilio/spaces/home/public.ttl';

export function useCommunityNursery() {
  const res = useGarden(CommunityNurseryUrl);
  const publishItemReference = useCallback(
    async (originalGardenUrl, gardenItem) => {
      let gardenItemReference = setUrl(
        gardenItem,
        RDFS.seeAlso,
        originalGardenUrl
      );
      const newGarden = res.garden && setThing(res.garden, gardenItemReference);
      console.log(res.garden);
      if (newGarden) {
        return await res.saveGarden(newGarden);
      } else {
        throw Error('Could not publish to Community Garden');
      }
    },
    [res]
  );
  res.publishItemReference = publishItemReference;
  return res;
}

export function useCommunityGarden() {
  return useGarden(CommunityGardenUrl);
}

export const CommunityContactsUrl =
  process.env.NEXT_PUBLIC_COMMUNITY_CONTACTS_URL ||
  'https://mysilio.me/mysilio/spaces/home/contacts.ttl';

export function urlForUsername(username) {
  return `${CommunityContactsUrl}#${username}`;
}

export function usernameFromUrl(contactUrl) {
  const url = new URL(contactUrl);
  return url.hash.replace('#', '');
}

export function usernameFromContact(contact) {
  return usernameFromUrl(asUrl(contact));
}
export function createContact(username, webId) {
  return buildThing(createThing({ name: username }))
    .addUrl(OWL.sameAs, webId)
    .addDatetime(DCTERMS.modified, new Date())
    .addDatetime(DCTERMS.created, new Date())
    .build();
}

export function addContact(contacts, username, webId) {
  const existingContact = getContact(contacts, username);
  if (existingContact) {
    throw new Error('That username is already taken');
  }

  contacts = setThing(contacts, createContact(username, webId));
  return contacts;
}

export function getContact(contacts, username) {
  return getThing(contacts, urlForUsername(username));
}

export function getContactByWebId(contacts, webId) {
  const dataset = contacts && toRdfJsDataset(contacts);
  const matches = dataset && dataset.match(null, OWL.sameAs, webId);
  const sorted =
    matches &&
    getThingAll(fromRdfJsDataset(matches)).sort((a, b) => {
      getDatetime(b, DCTERMS.created) - getDatetime(a, DCTERMS.created);
    });
  return sorted && sorted[0];
}

export function useCommunityContacts() {
  const res = useResource(CommunityContactsUrl);
  res.contacts = res.resource;
  res.saveContacts = res.save;
  return res;
}

export function useCommunityContact(username) {
  const res = useThing(urlForUsername(username));
  res.contact = thing;
  res.save = undefined;
  return res;
}
