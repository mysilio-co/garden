import React, { useState } from 'react';
import { Dialog } from '@headlessui/react'
import { ComponentStory, ComponentMeta } from '@storybook/react';

import NewNote from '../components/modals/NewNote';

export default {
  title: 'Modals/NewNote',
  component: NewNote,
  argTypes: {
  }
};

const Template = (args) => <NewNote {...args} />

export const DefaultNewNoteModal = Template.bind({});
DefaultNewNoteModal.args = {
  label: 'NewNote/Default',
};

export const PublicNewNoteModal = Template.bind({});
PublicNewNoteModal.args = {
  label: 'NewNote/Public',
  isPublic: true
};

export function ModalNewNoteModal() {
  let [isOpen, setIsOpen] = useState(false)
  console.log(isOpen)
  return (
    <>
      <button className="btn" onClick={() => setIsOpen(!isOpen)}>
        Show Modal
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <Dialog.Overlay className="fixed z-0 inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded max-w-sm mx-auto">
          <NewNote onClose={() => setIsOpen(false)}/>
        </div>
      </Dialog>
    </>
  )
}
ModalNewNoteModal.args = {
  label: 'NewNote/Modal'
}
