import React from 'react';

import NoteCard from '../components/NoteCard';
import { createExampleConcept } from '../model/concept';

export default {
  title: 'Components/NoteCard',
  component: NoteCard,
  argTypes: {
  }
};

const webId = "https://example.com/webid/avatar";
const workspaceSlug = "default";
const conceptPrefix = "https://example.com/concepts#";
const conceptName = "Social Knowledge Graphs";
let concept = createExampleConcept(conceptName, conceptPrefix)

const Template = (args) => <NoteCard {...args} />

export const BasicNoteCard = Template.bind({});
BasicNoteCard.args = {
  label: 'Header/NoteDashboard',
  concept,
  webId,
  workspaceSlug,
  visibility: "true"
};