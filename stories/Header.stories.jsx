import React from 'react'

import Header from '../components/Header'
import avatarImg from './assets/avatar.jpeg'
import authorAvatarImg from './assets/authorAvatar.jpeg'
import { createProfileFor } from '../model/profile'

export default {
  title: 'Components/Header',
  component: Header,
  argTypes: {
    logout: { action: 'loggedout' },
  },
}

const profile = createProfileFor(
  'https://example.com/webids/currentuser',
  new URL(avatarImg, window.location).toString()
)

const authorProfile = createProfileFor(
  'https://example.com/webids/author',
  new URL(authorAvatarImg, window.location).toString()
)

const Template = (args) => <Header {...args} />

export const DashboardHeader = Template.bind({})
DashboardHeader.args = {
  label: 'Header/Dashboard',
  profile,
  loggedIn: true,
  type: 'dashboard',
}

export const DashboardHeaderDrawerOpen = Template.bind({})
DashboardHeaderDrawerOpen.args = {
  label: 'Header/DashboardDrawerOpen',
  profile,
  drawerOpen: true,
  loggedIn: true,
  type: 'dashboard',
}

export const ProfileHeader = Template.bind({})
ProfileHeader.args = {
  label: 'Header/Profile',
  profile,
  loggedIn: true,
  type: 'profile',
}
