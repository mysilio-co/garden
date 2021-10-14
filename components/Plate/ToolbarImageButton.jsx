import { useStoreEditorRef } from '@udecode/plate-core';
import { insertImage } from '@udecode/plate-image';

import { UploadImage as UploadImageIcon } from '../icons'

export default function ToobarImageButton({ getImageUrl, editorId }) {
  const editor = useStoreEditorRef(editorId);
  async function onMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();

    let url;
    if (getImageUrl) {
      url = await getImageUrl();
    } else {
      url = window.prompt('Enter the URL of the image:');
    }
    if (!url) return;

    insertImage(editor, url);
  }
  return (
    <button onMouseDown={onMouseDown} className="px-1">
      <UploadImageIcon className="w-4 h-4" />
    </button>
  )
}