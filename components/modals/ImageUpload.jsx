import Modal from '../Modal'
import { ImageUploadAndEditor } from '../ImageUploader'

export default function ImageUploadModal({
  open,
  setOpen,
  onSave,
  uploadContainerUri,
}) {
  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false)
      }}
    >
      <div>
        <ImageUploadAndEditor
          onSave={onSave}
          onClose={() => {
            setOpen(false)
          }}
          imageUploadContainerUri={uploadContainerUri}
        />
      </div>
    </Modal>
  )
}
