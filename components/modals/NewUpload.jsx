import { useState, Fragment } from 'react'
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { Transition, Dialog } from '@headlessui/react';

export function NewUpload ({ onClose }) {
  return (
    <Formik
      initialValues={{ file: null }}
      onSubmit={async (values) => {
        console.alert(
          JSON.stringify(
            {
              fileName: values.file.name,
              type: values.file.type,
              size: `${values.file.size} bytes`,
            },
            null,
            2
          )
        );
      }}
      validationSchema={Yup.object().shape({
        file: Yup.mixed().required(),
      })}
    >
      <Form>
        <div className="form-group">
          <label for="file">File upload</label>
          <Field id="file" name="file" type="file" className="form-control" />
        </div>
        <button type="submit" className="btn">
          Submit
        </button>
        <button type="button" className="btn cancel"
          onClick={onClose}>
          Cancel
        </button>
      </Form>
    </Formik>
  );
}

export default function NewUploadModal({ isPublic = false, open, onClose }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        onClose={onClose}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-end justify-center min-h-screen px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-20 hams transition-opacity backdrop-filter backdrop-blur-lg" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-full sm:w-5/6">
              <NewUpload onClose={onClose} />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}