import React, { useState, useMemo, useRef, useEffect } from "react";
import { Transforms, Editor as SlateEditor } from 'slate';
import * as P from "@udecode/plate-headless";
import { LinkToolbarButton } from '@udecode/plate-ui-link'
import { ImageElement } from '@udecode/plate-ui-image'
import { Combobox } from '@udecode/plate-ui-combobox'
import { MediaEmbedElement } from '@udecode/plate-ui-media-embed';


import { useWebId } from 'swrlit'
import { LinkIcon } from "@heroicons/react/outline";
import Link from "next/link";

import Modal from '../Modal';
import { useWorkspaceContext } from "../../contexts/WorkspaceContext";
import { ELEMENT_CONCEPT, ELEMENT_TAG } from "../../utils/slate";
import { notePath } from "../../utils/uris";
import { useImageUploadUri } from "../../hooks/uris";
import { ImageUploadAndEditor } from "../ImageUploader";
import { ExternalLinkIcon } from '../icons'
import { autoformatRules } from './autoformat/autoformatRules'
import {
  createConceptPlugin, createConceptStartPlugin, createConceptEndPlugin,
  LEAF_CONCEPT_START, LEAF_CONCEPT_END
} from './plugins/concept'
import { createTagPlugin } from './plugins/tag'
import { createMentionPlugin } from './plugins/mention'

import {
  ToolbarButtonsList,
  ToolbarButtonsBasicElements,
  ToolbarButtonsBasicMarks,
} from "./Toolbars";
import ToolbarImageButton from "./ToolbarImageButton"

export const fromMentionable = (m) => {
  return m.value;
};

const ConceptElement = ({ attributes, element, children }) => {
  return (
    <span {...attributes} className="text-my-green group">
      {children}
    </span>
  );
};

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
          <ExternalLinkIcon className="h-4 w-4 inline hover:scale-125" />
        </a>
      </Link>
    </span>

  )
}

const TagElement = ({ attributes, element, children }) => {
  const { slug: workspaceSlug } = useWorkspaceContext();
  return (
    <span className="text-my-green group" {...attributes}>
      {children}
      <Link href={`/tags/${workspaceSlug}/${element.name}`}>
        <a contentEditable={false} className="hidden group-hover:inline">
          <ExternalLinkIcon className="h-4 w-4 inline hover:scale-125" />
        </a>
      </Link>
    </span>
  )
};

const MentionElement = ({ attributes, element, children }) => {
  return (
    <span className="text-my-green" {...attributes}>
      {children}
    </span>
  )
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

function BlockquoteElement({ attributes, children, nodeProps }) {
  return (
    <blockquote {...attributes} {...nodeProps}>
      {children}
    </blockquote>
  )
}

function H1Element({ className="", attributes, children, nodeProps }) {
  return (
    <h1 className={`text-3xl ${className}`} {...attributes} {...nodeProps}>
      {children}
    </h1>
  )
}

function H2Element({ className="", attributes, children, nodeProps }) {
  return (
    <h2 className={`text-2xl ${className}`} {...attributes} {...nodeProps}>
      {children}
    </h2>
  )
}

function H3Element({ className="", attributes, children, nodeProps }) {
  return (
    <h3 className={`text-xl ${className}`} {...attributes} {...nodeProps}>
      {children}
    </h3>
  )
}

function LiElement({ attributes, children, nodeProps }) {
  return (
    <li {...attributes} {...nodeProps}>
      {children}
    </li>
  )
}

function UlElement({ attributes, children, nodeProps }) {
  return (
    <ul {...attributes} {...nodeProps}>
      {children}
    </ul>
  )
}

function OlElement({ attributes, children, nodeProps }) {
  return (
    <ol {...attributes} {...nodeProps}>
      {children}
    </ol>
  )
}

function ParagraphElement({ attributes, children, nodeProps }) {
  return (
    <p {...attributes} {...nodeProps}>
      {children}
    </p>
  )
}

function BoldMark({ className="", attributes, children, nodeProps }) {
  return (
    <span className={`font-bold ${className}`} {...attributes} {...nodeProps}>
      {children}
    </span>
  )
}

function CodeMark({ className="", attributes, children, nodeProps }) {
  return (
    <span className={`font-mono bg-gray-200 ${className}`} {...attributes} {...nodeProps}>
      {children}just
    </span>
  )
}

function UnderlineMark({ className="", attributes, children, nodeProps }) {
  return (
    <span className={`underline ${className}`} {...attributes} {...nodeProps}>
      {children}
    </span>
  )
}

function ItalicMark({ className="", attributes, children, nodeProps }) {
  return (
    <span className={`italic ${className}`} {...attributes} {...nodeProps}>
      {children}
    </span>
  )
}

function HighlightMark({ className="", attributes, children, nodeProps }) {
  return (
    <span className={`bg-yellow-200 ${className}`} {...attributes} {...nodeProps}>
      {children}
    </span>
  )
}

const components = {
  [P.ELEMENT_BLOCKQUOTE]: BlockquoteElement,
  [P.ELEMENT_CODE_BLOCK]: CodeBlockElement,
  [P.ELEMENT_H1]: H1Element,
  [P.ELEMENT_H2]: H2Element,
  [P.ELEMENT_H3]: H3Element,

  [P.ELEMENT_IMAGE]: ImageElement,
  [P.ELEMENT_LI]: LiElement,
  [P.ELEMENT_MEDIA_EMBED]: MediaEmbedElement,
  [P.ELEMENT_UL]: UlElement,
  [P.ELEMENT_OL]: OlElement,
  [P.ELEMENT_PARAGRAPH]: ParagraphElement,

  [P.MARK_BOLD]: BoldMark,
  [P.MARK_CODE]: CodeMark,
  [P.MARK_HIGHLIGHT]: HighlightMark,
  [P.MARK_ITALIC]: ItalicMark,
  [P.MARK_UNDERLINE]: UnderlineMark,

  [ELEMENT_CONCEPT]: ConceptElement,
  [LEAF_CONCEPT_START]: ConceptStartLeaf,
  [LEAF_CONCEPT_END]: ConceptEndLeaf,
  [ELEMENT_TAG]: TagElement,
  [P.ELEMENT_MENTION]: MentionElement,
  [P.ELEMENT_LINK]: LinkElement
};

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
  //createComboboxPlugin(),
  // for now we need to support both combobox plugins
  P.createComboboxPlugin(),
  createMentionPlugin(),
  createConceptPlugin(),
  createConceptStartPlugin(),
  createConceptEndPlugin(),
  createTagPlugin(),
  P.createSoftBreakPlugin({
    options: {
      rules: [
        { hotkey: "shift+enter" },
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
        {
          hotkey: "enter",
          query: {
            allow: [P.ELEMENT_CODE_BLOCK, P.ELEMENT_BLOCKQUOTE],
          },
        },
      ],
    }
  }),
  P.createInsertDataPlugin(),
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

function onConceptSelect(editor, item) {
  if (item) {
    Transforms.insertText(editor, `[[${item.text}]]`, { at: P.comboboxStore.get.targetRange() })
  }
}

function onTagSelect(editor, item) {
  if (item) {
    Transforms.insertText(editor, `#${item.text}`, { at: P.comboboxStore.get.targetRange() })
  }
}

function onMentionSelect(editor, item) {
  if (item) {
    Transforms.insertText(editor, `@${item.text}`, { at: P.comboboxStore.get.targetRange() })
  }
}

export default function Editor({
  editorId = "default-plate-editor",
  initialValue = "",
  onChange,
  conceptNames = [],
  tagNames = [],
  mentionNames = [],
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

  // as of 2/14/22 we aren't passing mentions or tags into Editor, so these don't
  // do anything. We may want to change this soon, so I'll leave this here for now - TV
  const mentionItems = useMemo(() => mentionNames.map(toMentionable), [mentionNames])
  const tagItems = useMemo(() => tagNames.map(toMentionable), [tagNames])

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
          <div className="flex flex-col sm:flex-row border-b pt-4 pb-1 mb-1 border-grey-700 bg-white sticky top-0 z-10">
            <div className="flex">
              <ToolbarButtonsBasicElements />
              <ToolbarButtonsList />
              <LinkToolbarButton icon={<LinkIcon />} />
              <ToolbarImageButton getImageUrl={imageUrlGetter} editorId={editorId} />
            </div>
            <div className="flex">
              <ToolbarButtonsBasicMarks />
            </div>
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

          <Combobox id="mentionCombobox" items={mentionItems} trigger="@" onSelectItem={onMentionSelect} />
          <Combobox id="tagCombobox" items={tagItems} trigger="#" onSelectItem={onTagSelect} />
          <Combobox id="conceptCombobox" items={conceptItems} trigger="[[" onSelectItem={onConceptSelect} />
        </>
      )}
    </P.Plate>
  );
}
