import React, { useState, useMemo, useRef, useEffect } from "react";
import { Transforms, Editor as SlateEditor } from 'slate';
import {
  PlateProvider, Plate,

  KEYS_HEADING,

  MARK_BOLD,
  MARK_CODE,
  MARK_HIGHLIGHT,
  MARK_ITALIC,
  MARK_UNDERLINE,
  ELEMENT_MENTION,
  ELEMENT_LINK,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,

  ELEMENT_IMAGE,
  ELEMENT_LI,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_TODO_LI,

  createListPlugin,
  createTodoListPlugin,
  createImagePlugin,
  createLinkPlugin,
  createKbdPlugin,
  createNodeIdPlugin,
  createAutoformatPlugin,
  createResetNodePlugin,
  createComboboxPlugin,
  createSoftBreakPlugin,
  createExitBreakPlugin,
  createInsertDataPlugin,
  createSelectOnBackspacePlugin,
  createPlugins,
  createDeserializeMdPlugin,
  createDeserializeCsvPlugin,
  createDeserializeDocxPlugin,

  isBlockAboveEmpty,
  isSelectionAtBlockStart,
} from "@udecode/plate-headless"
import {
  createBoldPlugin,
  createItalicPlugin,
  createUnderlinePlugin,
  createCodePlugin,
} from '@udecode/plate-basic-marks'
import {
  createHighlightPlugin,
} from '@udecode/plate-highlight'
import {
  createBlockquotePlugin,
} from '@udecode/plate-block-quote'
import {
  createCodeBlockPlugin,
} from '@udecode/plate-code-block'
import { createHeadingPlugin } from '@udecode/plate-heading'
import { createParagraphPlugin } from '@udecode/plate-paragraph'
import { LinkToolbarButton, PlateFloatingLink } from '@udecode/plate-ui-link'

import { Combobox } from '@udecode/plate-ui-combobox'
import { MediaEmbedElement, ImageElement } from '@udecode/plate-ui-media';


import { useWebId } from 'swrlit/contexts/authentication'
import { LinkIcon } from "@heroicons/react/outline";
import Link from "next/link";

import Modal from '../Modal';
import { useNoteContext } from "../../contexts/NoteContext";
import { ELEMENT_CONCEPT, ELEMENT_TAG } from "../../utils/slate";
import { itemPath } from "../../utils/uris";
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
  const { webId, spaceSlug, gardenUrl } = useNoteContext();
  const name = leaf.conceptName
  const url = itemPath(webId, spaceSlug, gardenUrl, name)
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
  const { spaceSlug } = useNoteContext();
  return (
    <span className="text-my-green group" {...attributes}>
      {children}
      <Link href={`/tags/${spaceSlug}/${element.name}`}>
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

function H1Element({ className = "", attributes, children, nodeProps }) {
  return (
    <h1 className={`text-3xl ${className}`} {...attributes} {...nodeProps}>
      {children}
    </h1>
  )
}

function H2Element({ className = "", attributes, children, nodeProps }) {
  return (
    <h2 className={`text-2xl ${className}`} {...attributes} {...nodeProps}>
      {children}
    </h2>
  )
}

function H3Element({ className = "", attributes, children, nodeProps }) {
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
    <ul className="pl-5 list-disc" {...attributes} {...nodeProps}>
      {children}
    </ul>
  )
}

function OlElement({ attributes, children, nodeProps }) {
  return (
    <ol className="pl-5 list-decimal" {...attributes} {...nodeProps}>
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

function BoldMark({ className = "", attributes, children, nodeProps }) {
  return (
    <span className={`font-bold ${className}`} {...attributes} {...nodeProps}>
      {children}
    </span>
  )
}

function CodeMark({ className = "", attributes, children, nodeProps }) {
  return (
    <span className={`font-mono bg-gray-200 ${className}`} {...attributes} {...nodeProps}>
      {children}just
    </span>
  )
}

function UnderlineMark({ className = "", attributes, children, nodeProps }) {
  return (
    <span className={`underline ${className}`} {...attributes} {...nodeProps}>
      {children}
    </span>
  )
}

function ItalicMark({ className = "", attributes, children, nodeProps }) {
  return (
    <span className={`italic ${className}`} {...attributes} {...nodeProps}>
      {children}
    </span>
  )
}

function HighlightMark({ className = "", attributes, children, nodeProps }) {
  return (
    <span className={`bg-yellow-200 ${className}`} {...attributes} {...nodeProps}>
      {children}
    </span>
  )
}

const components = {
  [ELEMENT_BLOCKQUOTE]: BlockquoteElement,
  [ELEMENT_CODE_BLOCK]: CodeBlockElement,
  [ELEMENT_H1]: H1Element,
  [ELEMENT_H2]: H2Element,
  [ELEMENT_H3]: H3Element,

  [ELEMENT_IMAGE]: ImageElement,
  [ELEMENT_LI]: LiElement,
  [ELEMENT_MEDIA_EMBED]: MediaEmbedElement,
  [ELEMENT_UL]: UlElement,
  [ELEMENT_OL]: OlElement,
  [ELEMENT_PARAGRAPH]: ParagraphElement,

  [MARK_BOLD]: BoldMark,
  [MARK_CODE]: CodeMark,
  [MARK_HIGHLIGHT]: HighlightMark,
  [MARK_ITALIC]: ItalicMark,
  [MARK_UNDERLINE]: UnderlineMark,

  [ELEMENT_CONCEPT]: ConceptElement,
  [LEAF_CONCEPT_START]: ConceptStartLeaf,
  [LEAF_CONCEPT_END]: ConceptEndLeaf,
  [ELEMENT_TAG]: TagElement,
  [ELEMENT_MENTION]: MentionElement,
  [ELEMENT_LINK]: LinkElement
};

const optionsAutoformat = {
  rules: autoformatRules
};

const resetBlockTypesCommonRule = {
  types: [ELEMENT_BLOCKQUOTE, ELEMENT_TODO_LI],
  defaultType: ELEMENT_PARAGRAPH,
};

const optionsResetBlockTypePlugin = {
  rules: [
    {
      ...resetBlockTypesCommonRule,
      hotkey: "Enter",
      predicate: isBlockAboveEmpty,
    },
    {
      ...resetBlockTypesCommonRule,
      hotkey: "Backspace",
      predicate: isSelectionAtBlockStart,
    },
  ],
};



const defaultPlugins = [
  createHeadingPlugin({ options: { levels: 3 } }),
  createParagraphPlugin(),
  createUnderlinePlugin(),
  createCodePlugin(),
  createBoldPlugin(),
  createItalicPlugin(),
  createHighlightPlugin(),
  createBlockquotePlugin(),
  createCodeBlockPlugin(),
  createListPlugin(),
  createTodoListPlugin(),
  createImagePlugin(),
  createLinkPlugin({
    options: { rangeBeforeOptions: { multiPaths: false } },
    renderAfterEditable: PlateFloatingLink
  }),
  createKbdPlugin(),
  createNodeIdPlugin(),
  createDeserializeMdPlugin(),
  createDeserializeCsvPlugin(),
  createDeserializeDocxPlugin(),
  createAutoformatPlugin({ options: optionsAutoformat }),
  createResetNodePlugin({ options: optionsResetBlockTypePlugin }),
  //createComboboxPlugin(),
  // for now we need to support both combobox plugins
  createComboboxPlugin(),
  createMentionPlugin(),
  createConceptPlugin(),
  createConceptStartPlugin(),
  createConceptEndPlugin(),
  createTagPlugin(),
  createSoftBreakPlugin({
    options: {
      rules: [
        { hotkey: "shift+enter" },
      ],
    }
  }),
  createExitBreakPlugin({
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
            allow: KEYS_HEADING,
          },
        },
        {
          hotkey: "enter",
          query: {
            allow: [ELEMENT_CODE_BLOCK, ELEMENT_BLOCKQUOTE],
          },
        },
      ],
    }
  }),
  createInsertDataPlugin(),
  createSelectOnBackspacePlugin({ options: { query: { allow: ELEMENT_IMAGE } } }),
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
    Transforms.insertText(editor, `[[${item.text}]]`, { at: comboboxStore.get.targetRange() })
  }
}

function onTagSelect(editor, item) {
  if (item) {
    Transforms.insertText(editor, `#${item.text}`, { at: comboboxStore.get.targetRange() })
  }
}

function onMentionSelect(editor, item) {
  if (item) {
    Transforms.insertText(editor, `@${item.text}`, { at: comboboxStore.get.targetRange() })
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

  const plugins = createPlugins(defaultPlugins, {
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
  return (
    <PlateProvider id={editorId}
      initialValue={initialValue}
      onChange={onChange}
      normalizeInitialValue={true}
      plugins={plugins}
    >
      <div className="flex flex-col sm:flex-row border-b pt-4 pb-1 mb-1 border-grey-700 bg-white sticky top-0 z-10">
        <div className="flex">
          <ToolbarButtonsBasicElements />
          <ToolbarButtonsList />
          <LinkToolbarButton icon={<LinkIcon />} />
          {/*
          // TODO: set permissions on uploaded images the same way we do with cover images, then bring this back
           <ToolbarImageButton getImageUrl={imageUrlGetter} editorId={editorId}/>
            */}
        </div>
        <div className="flex">
          <ToolbarButtonsBasicMarks />
        </div>
      </div>

      <Plate
        id={editorId}
        editableProps={editableProps}
        {...props}
      >
        {
          // TODO: set permissions on uploaded images the same way we do with cover images, then bring this back
          false && !readOnly && (
            <>

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
      </Plate>
    </PlateProvider>
  );
}
