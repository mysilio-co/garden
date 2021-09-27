import React from 'react';
import Avatar from '../components/Avatar';
import avatarImg from './assets/avatar.jpeg'

export default {
  component: Avatar,
  title: 'Components/Avatar'
}

export const StandardAvatar = () => (
  <Avatar src={avatarImg} />
)
StandardAvatar.parameters = {
  backgrounds: { default: "dark" }
}