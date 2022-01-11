import React, { useCallback, useState, useMemo, useRef, useEffect } from "react";
import { Transforms, Text, Node, Editor as SlateEditor } from 'slate';
import * as P from "@udecode/plate";

import { comboboxStore, Combobox, createComboboxPlugin } from '@mysilio/plate-ui-combobox'
import { useWebId } from 'swrlit'
import { Image as ImageIcon } from "@styled-icons/material/Image";
import { Link as LinkIcon } from "@styled-icons/material/Link";
import Link from "next/link";

import Modal from '../Modal';
import { useWorkspaceContext } from "../../contexts/WorkspaceContext";
import { notePath, conceptNameToUrlSafeId } from "../../utils/uris";
import { ELEMENT_CONCEPT, ELEMENT_TAG } from "../../utils/slate";
import { useImageUploadUri } from "../../hooks/uris";
import { ImageUploadAndEditor } from "../ImageUploader";
import { ExternalLinkIcon } from '../icons'
import { autoformatRules } from './autoformat/autoformatRules'

import {
  ToolbarButtonsList,
  ToolbarButtonsBasicElements,
  BallonToolbarMarks,
} from "./Toolbars";
import ToolbarImageButton from "./ToolbarImageButton"

export const fromMentionable = (m) => {
  return m.value;
};

const ConceptElement = ({ attributes, element, children }) => {
  return (
    <span {...attributes} className="text-lagoon group">
      {children}
    </span>
  );
};

const TagElement = (m) => {
  const tag = fromMentionable(m);

  return <span className="text-lagoon">#{tag}</span>;
};

const MentionElement = (m) => {
  const mention = fromMentionable(m);
  return <span className="text-lagoon">@{mention}</span>;
};

const CodeBlockElement = ({ attributes, children, element, nodeProps }) => {
  return (
    <pre {...attributes} {...nodeProps} className="bg-gray-100 px-4 py-2 ml-4 mt-2">
      <code>{children}</code>
    </pre>
  )
}

function LinkElement({ attributes, children, element, nodeProps }) {
  return (
    <>
      <a className="text-my-purple underline" href={element.url} {...attributes} {...nodeProps}>{children}</a>
      <a href={element.url} contentEditable={false} target="_blank" rel="noopener noreferrer">
        <ExternalLinkIcon className="inline w-4 h-4" />
      </a>
    </>
  )
}

const components = P.createPlateUI({
  [P.ELEMENT_H1]: P.withProps(P.StyledElement, { as: "h1" }),
  [P.ELEMENT_H2]: P.withProps(P.StyledElement, { as: "h2" }),
  [P.ELEMENT_H3]: P.withProps(P.StyledElement, { as: "h3" }),
  [P.ELEMENT_CODE_BLOCK]: CodeBlockElement,
  [ELEMENT_CONCEPT]: ConceptElement,
  [ELEMENT_TAG]: P.withProps(P.MentionElement, {
    renderLabel: TagElement,
  }),
  [P.ELEMENT_MENTION]: P.withProps(P.MentionElement, {
    renderLabel: MentionElement,
  }),
  [P.ELEMENT_LINK]: LinkElement
});

const optionsAutoformat = {
  rules: autoformatRules
};

const resetBlockTypesCommonRule = {
  types: [P.ELEMENT_BLOCKQUOTE, P.ELEMENT_TODO_LI],
  defaultType: P.ELEMENT_PARAGRAPH,
};

const optionsResetBlockTypePlugin = {
  rules: [
    {
      ...resetBlockTypesCommonRule,
      hotkey: "Enter",
      predicate: P.isBlockAboveEmpty,
    },
    {
      ...resetBlockTypesCommonRule,
      hotkey: "Backspace",
      predicate: P.isSelectionAtBlockStart,
    },
  ],
};

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

const createConceptPlugin = P.createPluginFactory({
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

const createConceptStartPlugin = P.createPluginFactory({
  key: LEAF_CONCEPT_START,
  isLeaf: true,
  component: ConceptStartLeaf
})
const createConceptEndPlugin = P.createPluginFactory({
  key: LEAF_CONCEPT_END,
  isLeaf: true,
  component: ConceptEndLeaf
})

const defaultPlugins = [
  P.createHeadingPlugin({ options: { levels: 3 } }),
  P.createParagraphPlugin(),
  P.createBoldPlugin(),
  P.createItalicPlugin(),
  P.createUnderlinePlugin(),
  P.createCodePlugin(),
  P.createHighlightPlugin(),
  P.createBlockquotePlugin(),
  P.createCodeBlockPlugin(),
  P.createListPlugin(),
  P.createTodoListPlugin(),
  P.createImagePlugin(),
  P.createLinkPlugin({ options: { rangeBeforeOptions: { multiPaths: false } } }),
  P.createKbdPlugin(),
  P.createNodeIdPlugin(),
  P.createAutoformatPlugin({ options: optionsAutoformat }),
  P.createResetNodePlugin({ options: optionsResetBlockTypePlugin }),
  createComboboxPlugin(),
  // for now we need to support both combobox plugins
  P.createComboboxPlugin(),
  P.createMentionPlugin({ key: P.ELEMENT_MENTION, options: { trigger: '@' } }),
  P.createMentionPlugin({ key: ELEMENT_TAG, options: { trigger: '#' } }),
  createConceptPlugin(),
  createConceptStartPlugin(),
  createConceptEndPlugin(),
  P.createSoftBreakPlugin({
    options: {
      rules: [
        { hotkey: "shift+enter" },
        {
          hotkey: "enter",
          query: {
            allow: [P.ELEMENT_CODE_BLOCK, P.ELEMENT_BLOCKQUOTE, P.ELEMENT_TD],
          },
        },
      ],
    }
  }),
  P.createExitBreakPlugin({
    options: {
      rules: [
        {
          hotkey: "mod+enter",
        },
        {
          hotkey: "mod+shift+enter",
          before: true,
        },
        {
          hotkey: "enter",
          query: {
            start: true,
            end: true,
            allow: P.KEYS_HEADING,
          },
        },
      ],
    }
  }),
  P.createSelectOnBackspacePlugin({ options: { query: { allow: P.ELEMENT_IMAGE } } }),
];

function useImageUrlGetterAndSaveCallback() {
  const [imageUploaderOpen, setImageUploaderOpen] = useState(false)
  const imageGetterResolveRef = useRef()
  const imageUrlGetter = (e) => new Promise((resolve, reject) => {
    imageGetterResolveRef.current = resolve
    setImageUploaderOpen(true)
  })
  const webId = useWebId()
  const imageUploadUri = useImageUploadUri(webId)
  function imageUploaderOnSave(url, file) {
    imageGetterResolveRef.current(url)
    setImageUploaderOpen(false)
  }

  return {
    imageUploaderOpen, setImageUploaderOpen,
    imageUploadUri, imageUploaderOnSave,
    imageUrlGetter
  }
}

function toMentionable(name) {
  return { key: name, text: name }
}

function useComboboxItems(store, names) {
  const currentComboboxText = store.get.text()
  return useMemo(() => {
    return (names ? Array.from(new Set([...names, currentComboboxText])) : [currentComboboxText]).map(toMentionable)
  }, [names, currentComboboxText])
}

function MentionComboboxComponent({ }) {
  return (
    <div className="text-sm p-2 font-bold">insert mention</div>
  )
}

function TagComboboxComponent({ }) {
  return (
    <div className="text-sm p-2 font-bold">insert tag</div>
  )
}

function onConceptSelect(editor, item) {
  Transforms.insertText(editor, `[[${item.text}]]`, { at: comboboxStore.get.targetRange() })
}

export default function Editor({
  editorId = "default-plate-editor",
  initialValue = "",
  onChange,
  conceptNames,
  tagNames,
  mentionNames,
  readOnly,
  ...props
}) {

  const editableProps = {
    placeholder: "What's on your mind?",
    readOnly
  };

  const plugins = P.createPlugins(defaultPlugins, {
    components
  })

  const {
    imageUploaderOpen, setImageUploaderOpen,
    imageUploadUri, imageUploaderOnSave,
    imageUrlGetter
  } = useImageUrlGetterAndSaveCallback()

  // use the standard combobox because we're using the mentions stuff
  const mentionItems = useComboboxItems(P.comboboxStore, mentionNames)
  const tagItems = useComboboxItems(P.comboboxStore, tagNames)

  const conceptItems = useMemo(() => conceptNames.map(toMentionable), [conceptNames])

  const plateEditor = P.usePlateEditorRef()
  useEffect(function () {
    if (plateEditor) {
      // normalize the whole editor at load to ensure the data is properly formatted
      // this is how we migrate data from one format to another
      SlateEditor.normalize(plateEditor, { force: true })
    }
  }, [plateEditor])

  return (
    <P.Plate
      id={editorId}
      plugins={plugins}
      editableProps={editableProps}
      initialValue={initialValue}
      onChange={onChange}
      {...props}
    >
      {!readOnly && (
        <>
          <div className="flex flex-row border-b pb-1 mb-1 border-grey-700">
            <ToolbarButtonsBasicElements />
            <ToolbarButtonsList />
            <P.LinkToolbarButton icon={<LinkIcon />} />
            <ToolbarImageButton getImageUrl={imageUrlGetter} editorId={editorId} />
          </div>

          <Modal open={imageUploaderOpen} onClose={() => { setImageUploaderOpen(false) }}>
            <div>
              <ImageUploadAndEditor
                onSave={imageUploaderOnSave}
                onClose={() => { setImageUploaderOpen(false) }}
                imageUploadContainerUri={imageUploadUri}
              />
            </div>
          </Modal>

          <BallonToolbarMarks />

          <P.MentionCombobox items={mentionItems} pluginKey="mention" component={MentionComboboxComponent} />
          <P.MentionCombobox items={tagItems} pluginKey="tag" component={TagComboboxComponent} />
          <Combobox id="conceptCombobox" items={conceptItems} trigger="[[" onSelectItem={onConceptSelect} />
        </>
      )}
    </P.Plate>
  );
}
