import { Transforms, Text, Node } from 'slate';
import { createPluginFactory, ELEMENT_MENTION } from "@udecode/plate-headless";

// inspired by https://stackoverflow.com/a/60972027
const mentionRegex = /@(\w{1,100})(.*)/

function hasMentionParent(editor, path) {
  const parent = Node.get(editor, path.slice(0, -1))
  if (parent.type === ELEMENT_MENTION) {
    return true
  } else {
    return false
  }
}

export const withMentions = editor => {
  const { normalizeNode } = editor

  editor.normalizeNode = entry => {
    const [node, path] = entry
    if (Text.isText(node) && !hasMentionParent(editor, path)) {
      const mentionMatch = node.text.match(mentionRegex)
      if (mentionMatch) {
        const { index, 0: match, 1: name } = mentionMatch
        const at = { anchor: { path, offset: index }, focus: { path, offset: index + match.length } }
        Transforms.wrapNodes(editor, { type: ELEMENT_MENTION, children: [] }, { at, split: true })
        return
      }
    } else if (node.type === ELEMENT_MENTION) {
      // Migrate from old to new mention format
      if (node.value) {
        Transforms.setNodes(editor, {
          name: node.value
        }, { at: path })
        const childText = `@${node.value}`
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

      const mentionMatch = Node.string(node).match(mentionRegex)
      if (mentionMatch) {
        const [_, name, extra] = mentionMatch
        // make sure name always matches text
        if (node.name !== name) {
          Transforms.setNodes(editor, { name }, { at: path })
          return
        }

        // make sure a mention doesn't eat the text after it
        if (extra && extra !== '') {
          const childText = `#${node.name}`
          Transforms.splitNodes(editor, {
            at: { path: [...path, 0], offset: childText.length },
            match: n => (n.type === ELEMENT_MENTION)
          })
          return
        }
      } else {
        Transforms.unwrapNodes(editor, { match: n => n.type === ELEMENT_MENTION })
        return
      }
    }

    normalizeNode(entry)
  }

  return editor
}

export const createMentionPlugin = createPluginFactory({
  key: ELEMENT_MENTION,
  isElement: true,
  isInline: true,
  withOverrides: withMentions
})
