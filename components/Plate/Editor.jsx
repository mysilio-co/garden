import React, { useState, useMemo, useRef } from "react";
import * as P from "@udecode/plate";
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

import {
  useCustomMentionPlugin,
  Patterns,
  toMentionable,
  fromMentionable,
} from "./hooks/useCustomMentionPlugin";
import {
  ToolbarButtonsList,
  ToolbarButtonsBasicElements,
  BallonToolbarMarks,
} from "./Toolbars";
import ToolbarImageButton from "./ToolbarImageButton"

const ConceptElement = (m) => {
  const { webId, slug: workspaceSlug } = useWorkspaceContext();
  const name = fromMentionable(m);
  const url = notePath(webId, workspaceSlug, name)

  return (
    <Link href={url || ""}>
      <a className="text-lagoon">[[{name}]]</a>
    </Link>
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

const ConceptSelectLabel = (m) => {
  const name = fromMentionable(m);
  return <span className="text-lagoon">[[{name}]]</span>;
};

const TagSelectLabel = (m) => {
  const tag = fromMentionable(m);
  return <span className="text-lagoon">#{tag}</span>;
};

const MentionSelectLabel = (m) => {
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

const components = P.createPlateComponents({
  [P.ELEMENT_H1]: P.withProps(P.StyledElement, { as: "h1" }),
  [P.ELEMENT_H2]: P.withProps(P.StyledElement, { as: "h2" }),
  [P.ELEMENT_H3]: P.withProps(P.StyledElement, { as: "h3" }),
  [P.ELEMENT_CODE_BLOCK]: CodeBlockElement,
  [ELEMENT_CONCEPT]: P.withProps(P.MentionElement, {
    renderLabel: ConceptElement,
  }),
  [ELEMENT_TAG]: P.withProps(P.MentionElement, {
    renderLabel: TagElement,
  }),
  [P.ELEMENT_MENTION]: P.withProps(P.MentionElement, {
    renderLabel: MentionElement,
  }),
  [P.ELEMENT_LINK]: LinkElement
});

const defaultOptions = P.createPlateOptions();

const preFormat = (editor) => P.unwrapList(editor);

const optionsAutoformat = {
  rules: [
    {
      type: P.ELEMENT_H1,
      markup: "#",
      preFormat,
    },
    {
      type: P.ELEMENT_H2,
      markup: "##",
      preFormat,
    },
    {
      type: P.ELEMENT_H3,
      markup: "###",
      preFormat,
    },
    {
      type: P.ELEMENT_LI,
      markup: ["*", "-"],
      preFormat,
      format: (editor) => {
        if (editor.selection) {
          const parentEntry = P.getParent(editor, editor.selection);
          if (!parentEntry) return;
          const [node] = parentEntry;
          if (
            P.isElement(node) &&
            !P.isType(editor, node, P.ELEMENT_CODE_BLOCK) &&
            !P.isType(editor, node, P.ELEMENT_CODE_LINE)
          ) {
            P.toggleList(editor, {
              type: P.ELEMENT_UL,
            });
          }
        }
      },
    },
    {
      type: P.ELEMENT_LI,
      markup: ["1.", "1)"],
      preFormat,
      format: (editor) => {
        if (editor.selection) {
          const parentEntry = P.getParent(editor, editor.selection);
          if (!parentEntry) return;
          const [node] = parentEntry;
          if (
            P.isElement(node) &&
            !P.isType(editor, node, P.ELEMENT_CODE_BLOCK) &&
            !P.isType(editor, node, P.ELEMENT_CODE_LINE)
          ) {
            P.toggleList(editor, {
              type: P.ELEMENT_OL,
            });
          }
        }
      },
    },
    {
      type: P.ELEMENT_TODO_LI,
      markup: ["[]"],
    },
    {
      type: P.ELEMENT_BLOCKQUOTE,
      markup: [">"],
      preFormat,
    },
    {
      type: P.MARK_BOLD,
      between: ["**", "**"],
      mode: "inline",
      insertTrigger: true,
    },
    {
      type: P.MARK_BOLD,
      between: ["__", "__"],
      mode: "inline",
      insertTrigger: true,
    },
    {
      type: P.MARK_ITALIC,
      between: ["*", "*"],
      mode: "inline",
      insertTrigger: true,
    },
    {
      type: P.MARK_ITALIC,
      between: ["_", "_"],
      mode: "inline",
      insertTrigger: true,
    },
    {
      type: P.MARK_CODE,
      between: ["`", "`"],
      mode: "inline",
      insertTrigger: true,
    },
    {
      type: P.ELEMENT_CODE_BLOCK,
      markup: "``",
      trigger: "`",
      triggerAtBlockStart: false,
      preFormat,
      format: (editor) => {
        P.insertEmptyCodeBlock(editor, {
          defaultType: P.getPlatePluginType(editor, P.ELEMENT_DEFAULT),
          insertNodesOptions: { select: true },
        });
      },
    },
  ],
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

/* TODO:" add mentionables for Concepts, and friends */

const defaultPlugins = [
  P.createReactPlugin(),
  P.createHistoryPlugin(),
  P.createHeadingPlugin({ levels: 3 }),
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
  P.createLinkPlugin(),
  P.createKbdPlugin(),
  P.createNodeIdPlugin(),
  P.createAutoformatPlugin(optionsAutoformat),
  P.createResetNodePlugin(optionsResetBlockTypePlugin),
  P.createSoftBreakPlugin({
    rules: [
      { hotkey: "shift+enter" },
      {
        hotkey: "enter",
        query: {
          allow: [P.ELEMENT_CODE_BLOCK, P.ELEMENT_BLOCKQUOTE, P.ELEMENT_TD],
        },
      },
    ],
  }),
  P.createExitBreakPlugin({
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
  }),
  P.createSelectOnBackspacePlugin({ allow: P.ELEMENT_IMAGE }),
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
  function imageUploaderOnSave(url) {
    imageGetterResolveRef.current(url)
    setImageUploaderOpen(false)
  }

  return {
    imageUploaderOpen, setImageUploaderOpen,
    imageUploadUri, imageUploaderOnSave,
    imageUrlGetter
  }
}

export default function Editor({
  editorId = "default-plate-editor",
  initialValue = "",
  onChange,
  conceptNames,
  readOnly,
  ...props
}) {

  const editableProps = {
    placeholder: "What's on your mind?",
    readOnly
  };

  const { getMentionSelectProps: getConceptProps, plugin: conceptPlugin } =
    useCustomMentionPlugin({
      mentionables: conceptNames ? conceptNames.map(toMentionable) : [],
      pluginKey: ELEMENT_CONCEPT,
      pattern: Patterns.Concept,
      newMentionable: (s) => {
        return toMentionable(s);
      },
    });

  const { getMentionSelectProps: getTagProps, plugin: tagPlugin } =
    useCustomMentionPlugin({
      mentionables: [],
      pluginKey: ELEMENT_TAG,
      pattern: Patterns.Tag,
      newMentionable: (s) => {
        return toMentionable(s);
      },
    });

  const { getMentionSelectProps: getMentionProps, plugin: mentionPlugin } =
    useCustomMentionPlugin({
      mentionables: [],
      pluginKey: P.ELEMENT_MENTION,
      pattern: Patterns.Mention,
      newMentionable: (s) => {
        return toMentionable(s);
      },
    });

  const plugins = useMemo(
    () => [...defaultPlugins, conceptPlugin, tagPlugin, mentionPlugin],
    [conceptPlugin, tagPlugin, mentionPlugin]
  );


  const {
    imageUploaderOpen, setImageUploaderOpen,
    imageUploadUri, imageUploaderOnSave,
    imageUrlGetter
  } = useImageUrlGetterAndSaveCallback()
  return (
    <P.Plate
      id={editorId}
      plugins={plugins}
      components={components}
      options={defaultOptions}
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
            <P.ToolbarLink icon={<LinkIcon />} />
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



          <P.MentionSelect
            {...getConceptProps()}
            renderLabel={ConceptSelectLabel}
          />
          <P.MentionSelect {...getTagProps()} renderLabel={TagSelectLabel} />
          <P.MentionSelect
            {...getMentionProps()}
            renderLabel={MentionSelectLabel}
          />
        </>
      )}
    </P.Plate>
  );
}
