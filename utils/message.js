import { setUrl, setStringNoLocale } from '@inrupt/solid-client/thing/set'
import { createThing, setThing } from '@inrupt/solid-client/thing/thing'
import { saveSolidDatasetInContainer } from '@inrupt/solid-client/resource/resource'
import { createSolidDataset } from '@inrupt/solid-client/resource/solidDataset'
import { RDFS, DCTERMS } from '@inrupt/vocab-common-rdf'
import { fetch } from '@inrupt/solid-client-authn-browser'

export async function sendMessage(inboxUri, senderWebId, title, message){
  var msg = createThing({name: "message"})
  msg = setStringNoLocale(msg, RDFS.label, title)
  msg = setStringNoLocale(msg, RDFS.comment, message)
  msg = setUrl(msg, DCTERMS.creator, senderWebId)
  const data = setThing(createSolidDataset(), msg)
  return saveSolidDatasetInContainer(inboxUri, data, {fetch})
}
