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

export const PublicNoteHeader = Template.bind({});
PublicNoteHeader.args = {
  label: 'NoteHeader/Public',
  concept,
  conceptName,
  authorProfile,
  currentUserProfile,
  privacy: "public",
  myNote: true
};

export const PrivateNoteHeader = Template.bind({});
PrivateNoteHeader.args = {
  label: 'NoteHeader/Private',
  concept,
  conceptName,
  authorProfile,
  currentUserProfile,
  privacy: "private",
  myNote: true
};

export const ThirdPartyNoteHeader = Template.bind({});
ThirdPartyNoteHeader.args = {
  label: 'NoteHeader/ThirdParty',
  concept,
  conceptName,
  authorProfile,
  currentUserProfile,
  privacy: "public",
  myNote: false
};