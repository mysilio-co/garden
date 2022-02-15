import namespace from '@rdfjs/namespace'

const g = namespace('https://vocab.mysilio.com/my/garden#');
export const MY = {
  // The namespace library will automatically generate terms based on the property name
  // i.e. MY.scratch.fooo will be a NamedNode representing `.../scratch#fooo`
  scratch: namespace('https://vocab.mysilio.com/my/scratch#');
  // We manually list all expected Garden vocab termns as a (very) basic error check against typoes
  // and to give others a quick and easy place to see all existing terms before creating a new one.
  Garden: {
    hostsWorkspace: g`hostsWorkspace`,
    
    Workspace: g`Workspace`,
    hasGarden: g`hasGarden`,

    Garden: g`Garden`,
    inWorkspace: g`inWorkspace`,

    rootStorage: g`rootStorage`,
    imageStorage: g`imageStorage`,
    fileStorage: g`fileStorage`,
    noteStorage: g`noteStorage`,

    Concept: g`Concept`,
    Image: g`Image`,
    File: g`File`,
    Note: g`Note`,
    Bookmark: g`Bookmark`,
  }
};
