import React from 'react';

import Header from '../components/Header';
import avatarImg from './assets/avatar.jpeg'

export default {
  title: 'Components/Header',
  component: Header,
  argTypes: {
  }
};

const Template = (args) => <Header {...args} />

export const DashboardHeader = Template.bind({});
DashboardHeader.args = {
  label: 'Header/Dashboard',
  avatarImgSrc: avatarImg
};

export const DashboardHeaderDrawerOpen = Template.bind({});
DashboardHeaderDrawerOpen.args = {
  label: 'Header/DashboardDrawerOpen',
  drawerOpen: true
};

