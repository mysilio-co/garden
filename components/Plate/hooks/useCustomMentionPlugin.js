// forked from https://raw.githubusercontent.com/udecode/plate/ac3f7d9072c3dd12e971d52af68d07ee18496f57/packages/elements/mention/src/useMentionPlugin.ts

export const Patterns = {
  Concept: /\B\[\[([^\]]*)\]{0,2}$/,
  Tag: /\B\#([\w-]*)\b$/,
  Mention: /\B\@([\w-]*)\b$/,
};

export const toMentionable = (data) => {
  return { value: data };
};
export const fromMentionable = (m) => {
  return m.value;
};

