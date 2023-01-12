import { useState } from 'react';
import { getStringNoLocale } from '@inrupt/solid-client/thing/get'
import { setStringNoLocale } from '@inrupt/solid-client/thing/set'
import { FOAF } from '@inrupt/vocab-common-rdf';

import { EditIcon } from '../icons';

export default function Name({ profile, saveProfile, ...props }) {
  const name = profile && getStringNoLocale(profile, FOAF.name)
  const [newName, setNewName] = useState();

  async function save(newName) {
    return await saveProfile(setStringNoLocale(profile, FOAF.name, newName))
  }
  const [editingName, setEditingName] = useState(false);
  function saveName() {
    save(newName);
    setEditingName(false);
  }
  function onEdit() {
    setNewName(name);
    setEditingName(true);
  }
  return (
    <div {...props}>
      {editingName ? (
        <div className="flex flex-row">
          <input className="ipt-with-btn text-gray-600"
            value={newName}
            autoFocus
            onChange={e => setNewName(e.target.value)} type="text"
            placeholder="New Name" />
          <button className="btn-md btn-on-ipt" onClick={saveName}>
            Save
          </button>
        </div>
      ) : (
        <div className="relative flex flex-row">
          <h3 className="text-2xl text-center mb-3">{name}</h3>
          <EditIcon className="relative -right-1 text-purple-300 cursor-pointer w-4 h-4"
            onClick={onEdit} />
        </div>
      )}
    </div>
  );
}
