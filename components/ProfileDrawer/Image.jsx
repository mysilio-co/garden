import { useState } from 'react';
import { useWebId } from 'swrlit';
import { getUrl } from '@inrupt/solid-client/thing/get';
import { setUrl } from '@inrupt/solid-client/thing/set';
import { FOAF } from '@inrupt/vocab-common-rdf';
import { useImageUploadUri } from '../../hooks/uris';
import { EditIcon } from '../icons';
import { ImageUploadAndEditor } from '../ImageUploader';
import Avatar from '../Avatar'
import Modal from '../Modal';

export default function ProfileImage({ profile, saveProfile, ...props }) {
  const profileImage = profile && getUrl(profile, FOAF.img);
  const [editingProfileImage, setEditingProfileImage] = useState(false);
  const webId = useWebId();
  const imageUploadContainer = useImageUploadUri(webId);
  function saveProfileImage(newProfileImageUri) {
    saveProfile(setUrl(profile, FOAF.img, newProfileImageUri));
    setEditingProfileImage(false);
  }
  function onEdit() {
    setEditingProfileImage(true);
  }
  return (
    <div {...props}>
      <div className="relative cursor-pointer group" onClick={onEdit}>
        {profileImage && <Avatar className="rounded-full h-32 w-32 object-cover mr-12" src={profileImage} />}
        <div className="absolute inset-0 justify-center items-center hidden group-hover:flex group-hover:bg-white opacity-50">
          <EditIcon className="text-gray-900 w-10 h-10" />
        </div>
        <Modal open={editingProfileImage} onClose={() => { setEditingProfileImage(false) }}>
          <ImageUploadAndEditor onSave={saveProfileImage}
            imageUploadContainerUri={imageUploadContainer}
            onClose={() => setEditingProfileImage(false)} />
        </Modal>
      </div>
    </div>
  );
}
