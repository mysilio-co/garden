import React from 'react';

import Header from '../components/Header';
import avatarImg from './assets/avatar.jpeg'
import { createProfileFor } from '../model/profile'

export default {
  title: 'Components/Header',
  component: Header,
  argTypes: {
    logout: { action: "loggedout" }
  }
};

const profile = createProfileFor(
  "https://example.com/webids/currentuser",
  new URL(avatarImg, window.location).toString()
);

const Template = (args) => <Header {...args} />

export const DashboardHeader = Template.bind({});
DashboardHeader.args = {
  label: 'Header/Dashboard',
  profile,
  loggedIn: true
};

export const DashboardHeaderDrawerOpen = Template.bind({});
DashboardHeaderDrawerOpen.args = {
  label: 'Header/DashboardDrawerOpen',
  profile,
  drawerOpen: true,
  loggedIn: true
};

