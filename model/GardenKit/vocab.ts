import namespace from '@rdfjs/namespace'

const g = namespace('https://vocab.mysilio.com/my/garden#');
export const MY = {
  // The namespace library will automatically generate terms based on the property name
  // i.e. MY.Incubator.fooo will be a NamedNode representing `.../incubator#foo`
  Incubator: namespace('https://vocab.mysilio.com/my/incubator#');
  // We manually list all expected Garden vocab termns as a (very) basic error check against typoes
  // and to give others a quick and easy place to see all existing terms before creating a new one.
  Garden: {
    Garden: g`Garden`,
    mainIndex: g`mainIndex`,

    Concept: g`Concept`,
    Image: g`Image`,
    File: g`File`,
    Note: g`Note`,
    Bookmark: g`Bookmark`,
  }
};
