import namespace from '@rdfjs/namespace'

export const MY = {
  // The namespace library will automatically generate terms based on the property name
  // i.e. MY.Garden.Note will be a NamedNode representing NSPath:
  Garden: namespace('https://vocab.mysilio.com/my/garden#');
};
