import namespace from '@rdfjs/namespace'

const g = namespace('https://vocab.mysilio.com/my/garden#');
export const MY = {
  // The namespace library will automatically generate terms based on the property name
  // i.e. MY.scratch.fooo will be a NamedNode representing `.../scratch#fooo`
  scratch: namespace('https://vocab.mysilio.com/my/scratch#'),
  // We manually list all expected Garden vocab termns as a (very) basic error check against typoes
  // and to give others a quick and easy place to see all existing terms before creating a new one.
  Garden: {
    hasMetaSpace: g`hasMetaSpace`, // webId hasMetaSpace Space. For designating a Space as the Meta Space (the Space where other Spaces are stored)
    hasPodSpace: g`hasPodSpace`, // webId hasPodSpace Space. For designating a Space as the Pod Space (the Space representing the full Pod)
    holdsSpace: g`holdsSpace`, // webId holdsSpace Space. Admin of Space. Typically the owner of the webid where the gardens are stored.
    memberOf: g`memberOf`, // webId memberOf Space. Member of Space. Typically used on the profile card to indicate Spaces they wish to be a member of.

    MetaSpace: g`Space`, // A Space for community gardening on the web. May contain Gardens, and members (webids). Related: https://www.w3.org/ns/pim/space#
    Space: g`Space`, // A Space for community gardening on the web. May contain Gardens, and members (webids). Related: https://www.w3.org/ns/pim/space#
    holder: g`holdsSpace`, // Space holder WebId. Inverse of holdsSpace
    hasMember: g`hasMember`, // Space hasMember webId. Member of Space. Typically used on the Space to denote the list of members allowed.
    hasGarden: g`hasGarden`, // Space hasGarden Garden. A space may have many Gardens. Not all Gardens have to exist in the same pod.

    Garden: g`Garden`, // A Garden for community content. Contains Concepts,

    imageStorage: g`imageStorage`, // a subclass of WS.storage for image files
    fileStorage: g`fileStorage`, // a subclass of WS.storage for downloadable files
    noteStorage: g`noteStorage`, // a subclass of WS.storage for rich text notes

    Item: g`Item`,
    Concept: g`Concept`,
    mentions: g`mentions`,
    tagged: g`tagged`,
    references: g`references`,

    Image: g`Image`,
    File: g`File`,
    Note: g`Note`,
    storedAt: g`storedAt`,
    Bookmark: g`Bookmark`,
    Person: g`Person`,

    Collection: g`Collection`,
  },
};

const sioc = namespace('http://rdfs.org/sioc/ns#');
export const SIOC = {
  Community: sioc`Community`,
  Site: sioc`Site`,

  Forum: sioc`Forum`,
  Container: sioc`Container`,
  has_subscriber: sioc`has_subscriber`,
  has_moderator: sioc`has_moderator`,
  container_of: sioc`container_of`,
  about: sioc`about`,

  Post: sioc`Post`,
  Item: sioc`Item`,
  has_creator: sioc`has_creator`,
  has_container: sioc`has_container`,

  User: sioc`User`,
  account_of: sioc`account_of`, // webId
  subscriber_of: sioc`subscriber_of`, // Container
  moderator_of: sioc`moderator_of`, // Container
  creator_of: sioc`creatpr_of`, // Item
  email: sioc`email`,
};