import React from 'react';

import NoteHeader from '../components/NoteHeader';
import avatarImg from './assets/avatar.jpeg'

export default {
  title: 'Components/NoteHeader',
  component: NoteHeader,
  argTypes: {
  }
};

const Template = (args) => <NoteHeader {...args} />

export const DashboardNoteHeader = Template.bind({});
DashboardNoteHeader.args = {
  label: 'Header/NoteDashboard',
  avatarImgSrc: avatarImg,
  username: "dylanfrazo",
  noteTitle: "Social Knowledge Graphs", 
  noteCreatedAt: "4/24/21", 
  noteLastEdit: "Just Now!", 
  visibility: "true", 
  noteUrl: "http://example.com"
};