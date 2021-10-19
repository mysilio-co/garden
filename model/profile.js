import { setUrl, getStringNoLocale, setStringNoLocale, createThing } from '@inrupt/solid-client'
import { FOAF } from "@inrupt/vocab-common-rdf";

import { US, PP } from '../vocab'


export function getPaymentPointer(profile) {
  return profile && (getStringNoLocale(profile, US.paymentPointer) || getStringNoLocale(profile, PP.paymentPointer))
}

export function setPaymentPointer(profile, newPaymentPointer) {
  return setStringNoLocale(profile, PP.paymentPointer, newPaymentPointer)
}

export function createProfile(webId) {
  return createThing({ url: webId });
}

export function createProfileFor(webId, avatarImg) {
  let profile = createProfile(webId)
  profile = setUrl(profile, FOAF.img, avatarImg)
  return profile
}