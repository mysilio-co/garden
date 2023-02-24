import { useState } from 'react'

import { EditIcon } from '../icons'
import {
  addContact,
  getContactByWebId,
  useCommunityContacts,
  usernameFromContact,
} from '../../hooks/community'
import { asUrl } from '@inrupt/solid-client'

export default function Username({ profile, saveProfile, ...props }) {
  const { contacts, saveContacts } = useCommunityContacts()
  const [username, setUsername] = useState()

  const currentContact = contacts && getContactByWebId(contacts, asUrl(profile))
  const currentUsername = currentContact && usernameFromContact(currentContact)

  async function save(username) {
    if (contacts && username && username != currentUsername) {
      const newContacts = addContact(contacts, username, asUrl(profile))
      saveContacts(newContacts)
    }
  }
  const [editingUsername, setEditingUsername] = useState(false)
  function saveUsername() {
    save(username)
    setEditingUsername(false)
  }
  function onEdit() {
    setUsername(currentUsername)
    setEditingUsername(true)
  }
  return (
    <div {...props}>
      {editingUsername ? (
        <div className="flex flex-row">
          <input
            className="ipt-with-btn text-gray-600"
            value={username}
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="New Username"
          />
          <button className="btn-md btn-on-ipt" onClick={saveUsername}>
            Save
          </button>
        </div>
      ) : (
        <div className="relative flex flex-row">
          <div className="flex flex-col">
            <p className="text-xs font-medium text-gray-400 group-hover:text-gray-300">
              Username
            </p>
            <h3 className="text-2xl mb-3">{username || currentUsername}</h3>
          </div>
          <EditIcon
            className="relative -right-1 text-purple-300 cursor-pointer w-4 h-4"
            onClick={onEdit}
          />
        </div>
      )}
    </div>
  )
}
