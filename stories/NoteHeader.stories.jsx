import React from 'react';

import NoteHeader from '../components/NoteHeader';
import avatarImg from './assets/avatar.jpeg'
import authorAvatarImg from './assets/authorAvatar.jpeg'
import { createExampleConcept } from '../model/concept';
import { createProfileFor } from '../model/profile';

export default {
  title: 'Components/NoteHeader',
  component: NoteHeader,
  argTypes: {
  }
};

const Template = (args) => <NoteHeader {...args} />
const tagPrefix = "https://example.com/tags/"
const conceptPrefix = "https://example.com/concepts/"

const conceptName = "Social Knowledge Graphs"
let concept = createExampleConcept(conceptName, conceptPrefix)

const authorProfile = createProfileFor(
  "https://example.com/webids/author",
  new URL(authorAvatarImg, window.location).toString()
);
const currentUserProfile = createProfileFor(
  "https://example.com/webids/currentuser",
  new URL(avatarImg, window.location).toString()
);

export const DashboardNoteHeader = Template.bind({});
DashboardNoteHeader.args = {
  label: 'Header/NoteDashboard',
  concept,
  conceptName,
  authorProfile,
  currentUserProfile,
  visibility: "true"
};