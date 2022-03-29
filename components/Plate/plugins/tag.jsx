import { Transforms, Text, Node, Editor as SlateEditor } from 'slate';
import { createPluginFactory } from "@udecode/plate";

import { ELEMENT_TAG } from "../../../utils/slate";

// inspired by https://stackoverflow.com/a/60972027
// the (.*) at the end allows us to detect situations where the tag needs to be split
const tagRegex = /#([\w\-]{1,100})(.*)/

function hasTagParent(editor, path) {
  const parent = Node.get(editor, path.slice(0, -1))
  if (parent.type === ELEMENT_TAG) {
    return true
  } else {
    return false
  }
}

export const withTags = editor => {
  const { normalizeNode } = editor

  editor.normalizeNode = entry => {
    const [node, path] = entry
    if (Text.isText(node) && !hasTagParent(editor, path)) {
      const tagMatch = node.text.match(tagRegex)
      if (tagMatch) {
        const { index, 0: match, 1: name } = tagMatch
        const at = { anchor: { path, offset: index }, focus: { path, offset: index + match.length } }
        Transforms.wrapNodes(editor, { type: ELEMENT_TAG, children: [] }, { at, split: true })
        return
      }
    } else if (node.type === ELEMENT_TAG) {
      // Migrate from old to new tag format
      if (node.value) {
        Transforms.setNodes(editor, {
          name: node.value
        }, { at: path })
        const childText = `#${node.value}`
        if (node.children[0].text != childText) {
          const childTextStart = { path: [...path, 0], offset: 0 }
          const lastChildIndex = (node.children.length - 1)
          const lastTextPositionIndex = node.children[lastChildIndex].text.length
          const childTextEnd = { path: [...path, lastChildIndex], offset: lastTextPositionIndex }
          const childTextRange = { anchor: childTextStart, focus: childTextEnd }
          Transforms.insertText(editor, childText, { at: childTextRange })
        }
        Transforms.unsetNodes(editor, 'value', { at: path })
        return
      }

      const tagMatch = Node.string(node).match(tagRegex)
      if (tagMatch) {
        const [_, name, extra] = tagMatch
        // make sure name always matches text
        if (node.name !== name) {
          Transforms.setNodes(editor, { name }, { at: path })
          return
        }

        // make sure a tag doesn't eat the text after it
        if (extra && extra !== '') {
          const childText = `#${node.name}`
          Transforms.splitNodes(editor, {
            at: { path: [...path, 0], offset: childText.length },
            match: n => (n.type === ELEMENT_TAG)
          })
          return
        }
      } else {
        Transforms.unwrapNodes(editor, { match: n => n.type === ELEMENT_TAG })
        return
      }
    }

    normalizeNode(entry)
  }

  return editor
}

export const createTagPlugin = createPluginFactory({
  key: ELEMENT_TAG,
  isElement: true,
  isInline: true,
  withOverrides: withTags
})
