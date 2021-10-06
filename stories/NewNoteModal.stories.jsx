import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { ComponentStory, ComponentMeta } from '@storybook/react';

import NewNoteModal, { NewNote } from '../components/modals/NewNote';

export default {
  title: 'Modals/NewNoteModal',
  component: NewNoteModal,
  argTypes: {
  }
};

const Template = (args) => <NewNoteModal {...args} />

export const DefaultNewNoteModal = Template.bind({});
DefaultNewNoteModal.args = {
  label: 'NewNote/Default',
};

export const PublicNewNoteModal = Template.bind({});
PublicNewNoteModal.args = {
  label: 'NewNote/Public',
  isPublic: true,
  open: true
};

export function ModalNewNoteModal() {
  let [isOpen, setIsOpen] = useState(false)
  console.log(isOpen)
  return (
    <>
      <button className="btn" onClick={() => setIsOpen(!isOpen)}>
        Show Modal
      </button>
      <NewNoteModal open={isOpen} close={() => setIsOpen(false)}/>
    </>
  )
}
ModalNewNoteModal.args = {
  label: 'NewNote/Modal'
}

