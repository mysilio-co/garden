import { createThing } from '@inrupt/solid-client/thing/thing'
import { getStringNoLocale } from '@inrupt/solid-client/thing/get'
import { setUrl, setStringNoLocale } from '@inrupt/solid-client/thing/set'
import { FOAF } from '@inrupt/vocab-common-rdf'

import { US, PP } from '../vocab'

export function getPaymentPointer(profile) {
  return (
    profile &&
    (getStringNoLocale(profile, PP.paymentPointer) ||
      getStringNoLocale(profile, US.paymentPointer))
  )
}

export function setPaymentPointer(profile, newPaymentPointer) {
  return setStringNoLocale(profile, PP.paymentPointer, newPaymentPointer)
}

export function createProfile(webId) {
  return createThing({ url: webId })
}

export function createProfileFor(webId, avatarImg) {
  let profile = createProfile(webId)
  profile = setUrl(profile, FOAF.img, avatarImg)
  return profile
}
