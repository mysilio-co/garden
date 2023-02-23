import React from 'react'
import {
  getPreventDefaultHandler,
  isMarkActive,
  toggleMark,
  useEventPlateId,
  usePlateEditorState,
  Value,
  withPlateProvider,
  usePlateSelectors,
} from '@udecode/plate-core'
import { ToolbarButton } from '@udecode/plate-ui-toolbar'

/**
 * Toolbar button to toggle the mark of the leaves in selection.
 */
const MarkToolbarButton = withPlateProvider(({ id, type, clear, ...props }) => {
  id = useEventPlateId(id)
  const editor = usePlateEditorState(id)
  return (
    <ToolbarButton
      active={!!editor?.selection && isMarkActive(editor, type)}
      onMouseDown={
        editor
          ? getPreventDefaultHandler(toggleMark, editor, { key: type, clear })
          : undefined
      }
      {...props}
    />
  )
})

export default MarkToolbarButton
