import React from 'react'

import Login from '../components/Login'
import avatarImg from './assets/avatar.jpeg'

export default {
  title: 'Components/Login',
  component: Login,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {},
}

const Template = (args) => <Login {...args} />

export const LoginLanding = Template.bind({})
LoginLanding.args = {
  label: 'Login/Landing',
  username: 'dylanfrazo',
}
