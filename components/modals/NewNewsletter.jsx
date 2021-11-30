import { useState, useEffect } from 'react';
import { parse as parseCSV } from 'papaparse';

import { useWebId } from 'swrlit';
import { isThingLocal } from '@inrupt/solid-client';
import { Close as CloseIcon, TickCircle } from '../icons';
import { useCurrentWorkspace } from '../../hooks/app';
import Modal from '../Modal';
import {
  usePublicationManifest,
  useNewsletter,
} from '../../hooks/publications';
import { getNewsletter } from '../../model/publications';

function validEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const NewNewsletter = ({ onClose }) => {
  const [saving, setSaving] = useState(false);

  const webId = useWebId();
  const { workspace, slug: workspaceSlug } = useCurrentWorkspace('private');
  const [name, setName] = useState('');

  const [csv, setCSV] = useState();
  const [subscribers, setSubscribers] = useState();

  useEffect(() => {
    csv &&
      parseCSV(csv, {
        skipEmptyLines: true,
        complete: function (results) {
          setSubscribers(
            results.data.map((row) => {
              // array of row values 
              return { email: row.find(validEmail) };
            }).filter((subscriber) => {
              // throw out all rows without an email (includign header row)
              return subscriber.email;
            })
          );
        },
      });
  }, [csv]);

  const { manifest: resource, saveManifest: saveResource } =
    usePublicationManifest(webId, workspaceSlug);
  const newsletterExists = !!getNewsletter(manifest, title);

  const save = async function save() {
    // Create newsletter
    setSaving(true);
    try {
    } catch (e) {
      console.log('error saving newsletter', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto rounded-lg overflow-hidden bg-white flex flex-col items-stretch">
      <div className="flex flex-row justify-between self-stretch h-18 p-6 bg-my-green">
        <div className="flex flex-row justify-start items-start gap-4">
          <h2 className="text-white font-bold text-xl">New Newsletter</h2>
        </div>
        <CloseIcon
          className="text-white h-6 w-6 flex-grow-0 cursor-pointer"
          onClick={onClose}
        />
      </div>
      <div className="divide-1 divide-gray-100">
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start px-6 py-5">
          <label htmlFor="name" className="text-sm font-medium text-gray-900">
            Name your Newsletter
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2 flex flex-col">
            <input
              type="text"
              name="name"
              id="name"
              className={`ipt ${newsletterExists ? 'error' : ''}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {newsletterExists && (
              <span className="ipt-error-message">
                Newsletter already exists
              </span>
            )}
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start px-6 py-5">
          <label htmlFor="name" className="text-sm font-medium text-gray-900">
            Upload a CSV of your subscribers
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2 flex flex-col">
            <input
              id="file"
              name="file"
              type="file"
              accept=".csv"
              className="ipt"
              onChange={(e) => {
                const f = e.target.files && e.target.files[0];
                setCSV(f);
              }}
            />
          </div>
        </div>
      </div>
      <div className="h-20 bg-gray-50 flex flex-row justify-end items-center px-6">
        <button
          onClick={onClose}
          className="btn-md btn-filled btn-square h-10 mr-1"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={save}
          className="btn-md btn-filled btn-square h-10 ring-my-green text-my-green flex flex-row justify-center items-center"
          disabled={newsletterExists}
        >
          Create
          <TickCircle className="ml-1 text-my-green h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default function NewNewsletterModal({
  isPublic = false,
  conceptNames,
  open,
  onClose,
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <NewNewsletter onClose={onClose} />
    </Modal>
  );
}
