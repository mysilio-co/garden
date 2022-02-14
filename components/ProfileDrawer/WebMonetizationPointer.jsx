import { useState } from 'react';
import { EditIcon } from '../icons';
import { getPaymentPointer, setPaymentPointer } from '../../model/profile';

export default function WebMonetizationPointer({ profile, saveProfile, ...props }) {
  const paymentPointer = getPaymentPointer(profile);
  const [newPaymentPointer, setNewPaymentPointer] = useState();

  async function save(newPaymentPointer){
    return await saveProfile(setPaymentPointer(profile, newPaymentPointer))
  }
  const [editingPaymentPointer, setEditingPaymentPointer] = useState(false);
  function savePaymentPointer() {
    save(newPaymentPointer);
    setEditingPaymentPointer(false);
  }
  function onEdit() {
    setNewPaymentPointer(paymentPointer);
    setEditingPaymentPointer(true);
  }
  return (
    <div {...props}>
      {editingPaymentPointer ? (
        <div className="flex flex-row">
          <input className="ipt-with-btn"
            value={newPaymentPointer}
            autoFocus
            onChange={e => setNewPaymentPointer(e.target.value)} type="text"
            placeholder="New Payment Pointer" />
          <button className="btn-md btn-on-ipt" onClick={savePaymentPointer}>
            Save
          </button>
        </div>
      ) : (
        <div className="relative flex flex-row">
          <h3 className="text-base text-center mb-3">
            {paymentPointer || (
              <span className="text-gray-500" onClick={onEdit}>
                click to set payment pointer
              </span>
            )}
          </h3>
          {paymentPointer && (
            <EditIcon className="relative -right-1 -top-2 text-purple-300 cursor-pointer w-4 h-4"
              onClick={onEdit} />
          )}
        </div>
      )}
    </div>
  );
}
