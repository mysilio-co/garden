export const PP = {
  paymentPointer: 'http://paymentpointers.org/ns#PaymentPointer',
}

const understoryRoot = 'https://understory.coop/vocab/garden#'
export const US = {
  noteBody: `${understoryRoot}noteBody`,
  refersTo: `${understoryRoot}refersTo`,
  paymentPointer: `${understoryRoot}paymentPointer`,
  storedAt: `${understoryRoot}storedAt`,
  noteStorage: `${understoryRoot}noteStorage`,
  publicPrefs: `${understoryRoot}publicPrefs`,
  privatePrefs: `${understoryRoot}privatePrefs`,
  backupsStorage: `${understoryRoot}backupsStorage`,
  hasWorkspace: `${understoryRoot}hasWorkspace`,
  conceptIndex: `${understoryRoot}conceptIndex`,
  conceptPrefix: `${understoryRoot}conceptPrefix`,
  tagged: `${understoryRoot}tagged`,
  tagPrefix: `${understoryRoot}tagPrefix`,
  hasSettings: `${understoryRoot}hasSettings`,
  devMode: `${understoryRoot}devMode`,
  hasGnomeType: `${understoryRoot}hasGnomeType`,
  usesGateTemplate: `${understoryRoot}usesGateTemplate`,
  usesConcept: `${understoryRoot}usesConcept`,
  usesConceptIndex: `${understoryRoot}usesConceptIndex`,
  deployedAt: `${understoryRoot}deployedAt`,
  hasGnomeStatus: `${understoryRoot}hasGnomeStatus`,
  monetizedFor: `${understoryRoot}monetizedFor`,
  usesCSS: `${understoryRoot}usesCSS`,
  slateJSON: `${understoryRoot}slateJSON`, // https://docs.slatejs.org/concepts/02-nodes
}

const MY_PREFIX = 'https://vocab.mysilio.com/my/'
const MY_INCUBATOR = `${MY_PREFIX}incubator/`
const MY_SKOS = `${MY_PREFIX}skos#`
const MY_FOAF = `${MY_PREFIX}foaf#`
const MY_NEWS = `${MY_INCUBATOR}newsletter#`
const MY_HTML = `${MY_INCUBATOR}html#`

export const MY = {
  SKOS: {
    Bookmark: `${MY_SKOS}Bookmark`, // disjoint with SKOS:Concept. Concepts and Bookmarks can both point to the same notes / resources, but a Bookmark is explicitly defined as a "Concept Fragmet" rather than a full Concept.
  },
  FOAF: {
    File: `${MY_FOAF}File`, // subclass of Document, disjoint with Link. For resources that are intended to be downloaded as Files.
    Link: `${MY_FOAF}Link`, // subclass of Document, disjoint with File. For resources that are intended to be treated as Links / viewed in a WebBrowser
  },
  News: {
    publicationManifest: `${understoryRoot}publicationManifest`,
    subscriptionManifest: `${understoryRoot}subscriptionManifest`,
    Newsletter: `${MY_NEWS}Newsletter`, // subclass of SIOC:Container
    Edition: `${MY_NEWS}Edition`, // subclass of SIOC:Item
    has_edition: `${MY_NEWS}has_edition`,
    edition_of: `${MY_NEWS}edition_of`,
    volume: `${MY_NEWS}volume`, // literal, property of Edition
    issue: `${MY_NEWS}issue`, // literal, property of Edition
  },
  HTML: {
    Config: `${MY_HTML}Config`,
    configFor: `${MY_HTML}configFor`, // the Newsletter / Webpage this config is for
    usesTemplate: `${MY_HTML}usesTemplate`,
    usesConcept: `${MY_HTML}usesConcept`,
    usesCollection: `${MY_HTML}usesCollection`,
    deployedTo: `${MY_HTML}deployedAt`,
    deliveredTo: `${MY_HTML}deliveredTo`,
  },
}

export const SIOC_PREFIX = 'http://rdfs.org/sioc/ns#'
export const SIOC = {
  Community: `${SIOC_PREFIX}Community`,
  Site: `${SIOC_PREFIX}Site`,

  Forum: `${SIOC_PREFIX}Forum`,
  Container: `${SIOC_PREFIX}Container`,
  has_subscriber: `${SIOC_PREFIX}has_subscriber`,
  has_moderator: `${SIOC_PREFIX}has_moderator`,
  container_of: `${SIOC_PREFIX}container_of`,
  about: `${SIOC_PREFIX}about`,

  Post: `${SIOC_PREFIX}Post`,
  Item: `${SIOC_PREFIX}Item`,
  has_creator: `${SIOC_PREFIX}has_creator`,
  has_container: `${SIOC_PREFIX}has_container`,

  User: `${SIOC_PREFIX}User`,
  account_of: `${SIOC_PREFIX}account_of`, // webId
  subscriber_of: `${SIOC_PREFIX}subscriber_of`, // Container
  moderator_of: `${SIOC_PREFIX}moderator_of`, // Container
  creator_of: `${SIOC_PREFIX}creatpr_of`, // Item
  email: `${SIOC_PREFIX}email`,
}

export const MIME = {
  html: 'text/html',
}
