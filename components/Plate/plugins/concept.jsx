import { Transforms, Text, Node, Editor as SlateEditor } from 'slate';
import { createPluginFactory } from "@udecode/plate";
import Link from "next/link";
import { ExternalLinkIcon } from '../../icons'

import { notePath } from "../../../utils/uris";
import { useWorkspaceContext } from "../../../contexts/WorkspaceContext";
import { ELEMENT_CONCEPT } from "../../../utils/slate";

const conceptRegex = /\[\[(.*)\]\](.*)/

function hasConceptParent(editor, path) {
  const parent = Node.get(editor, path.slice(0, -1))
  if (parent.type === ELEMENT_CONCEPT) {
    return true
  } else {
    return false
  }
}

export const withConcepts = editor => {
  const { normalizeNode } = editor

  editor.normalizeNode = entry => {
    const [node, path] = entry
    if (Text.isText(node) && !hasConceptParent(editor, path)) {
      const conceptMatch = node.text.match(conceptRegex)
      if (conceptMatch) {
        const { index, 0: match, 1: name } = conceptMatch
        const at = { anchor: { path, offset: index }, focus: { path, offset: index + match.length } }
        Transforms.wrapNodes(editor, { type: ELEMENT_CONCEPT, children: [] }, { at, split: true })
        return
      }
    } else if (node.type === ELEMENT_CONCEPT) {

      // Migrate from old to new concept format
      if (node.value) {
        Transforms.setNodes(editor, {
          name: node.value
        }, { at: path })
        const childText = `[[${node.value}]]`
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

      const conceptMatch = Node.string(node).match(conceptRegex)
      if (conceptMatch) {
        const [_, name, extra] = conceptMatch

        // make sure name always matches text
        if (node.name !== name) {
          Transforms.setNodes(editor, { name }, { at: path })
          return
        }

        // make sure a concept doesn't eat the text after it
        if (extra !== '') {
          const childText = `[[${node.name}]]`
          Transforms.splitNodes(editor, {
            at: { path: [...path, 0], offset: childText.length },
            match: n => (n.type === ELEMENT_CONCEPT)
          })
          return
        }
      } else {
        Transforms.unwrapNodes(editor, { match: n => n.type === ELEMENT_CONCEPT })
        return
      }
    }

    normalizeNode(entry)
  }

  return editor
}

const LEAF_CONCEPT_START = 'conceptLeafStart'
const LEAF_CONCEPT_END = 'conceptLeafEnd'

export const createConceptPlugin = createPluginFactory({
  key: ELEMENT_CONCEPT,
  isElement: true,
  isInline: true,
  withOverrides: withConcepts,
  decorate: (editor, options) => ([node, path]) => {
    if (node.type === 'concept') {
      const textPath = [...path, 0]
      const textLength = node.children[0].text.length
      return [
        {
          anchor: { path: textPath, offset: 0 },
          focus: { path: textPath, offset: 2 },
          [LEAF_CONCEPT_START]: true
        },
        {
          anchor: { path: textPath, offset: textLength - 2 },
          focus: { path: textPath, offset: textLength },
          [LEAF_CONCEPT_END]: true,
          conceptName: node.name
        }
      ]
    }
  }
})

function ConceptStartLeaf({ children }) {
  return (
    <span className="opacity-50 group-hover:opacity-100">
      {children}
    </span>
  )
}
function ConceptEndLeaf({ children, leaf }) {
  const { webId, slug: workspaceSlug } = useWorkspaceContext();
  const name = leaf.conceptName
  const url = notePath(webId, workspaceSlug, name)
  return (
    <span className="opacity-50 group-hover:opacity-100 relative">
      {children}
      <Link href={url || ""}>
        <a contentEditable={false} className="hidden group-hover:inline">
          <ExternalLinkIcon className="h-4 w-4 inline" />
        </a>
      </Link>
    </span>

  )
}

export const createConceptStartPlugin = createPluginFactory({
  key: LEAF_CONCEPT_START,
  isLeaf: true,
  component: ConceptStartLeaf
})

export const createConceptEndPlugin = createPluginFactory({
  key: LEAF_CONCEPT_END,
  isLeaf: true,
  component: ConceptEndLeaf
})