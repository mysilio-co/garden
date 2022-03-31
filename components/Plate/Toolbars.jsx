import * as P from '@udecode/plate-headless'
import { MarkToolbarButton, BlockToolbarButton } from '@udecode/plate-ui-toolbar'
import { ListToolbarButton } from '@udecode/plate-ui-list'

import { CodeAlt } from '@styled-icons/boxicons-regular/CodeAlt';
import { CodeBlock } from '@styled-icons/boxicons-regular/CodeBlock';
import { Highlight } from '@styled-icons/boxicons-regular/Highlight';

import { FormatBold } from '@styled-icons/material/FormatBold';
import { FormatItalic } from '@styled-icons/material/FormatItalic';
import { FormatListBulleted } from '@styled-icons/material/FormatListBulleted';
import { FormatListNumbered } from '@styled-icons/material/FormatListNumbered';
import { FormatQuote } from '@styled-icons/material/FormatQuote';

import { FormatUnderlined } from '@styled-icons/material/FormatUnderlined';

import { Looks3 } from '@styled-icons/material/Looks3';

import { LooksOne } from '@styled-icons/material/LooksOne';
import { LooksTwo } from '@styled-icons/material/LooksTwo';

export const ToolbarButtonsBasicElements = () => {
  const editor = P.usePlateEditorRef(P.useEventEditorSelectors.focus());

  return (
    <>
      <BlockToolbarButton
        type={P.getPluginType(editor, P.ELEMENT_H1)}
        icon={<LooksOne />}
      />
      <BlockToolbarButton
        type={P.getPluginType(editor, P.ELEMENT_H2)}
        icon={<LooksTwo />}
      />
      <BlockToolbarButton
        type={P.getPluginType(editor, P.ELEMENT_H3)}
        icon={<Looks3 />}
      />
      <BlockToolbarButton
        type={P.getPluginType(editor, P.ELEMENT_BLOCKQUOTE)}
        icon={<FormatQuote />}
      />
      <BlockToolbarButton
        type={P.getPluginType(editor, P.ELEMENT_CODE_BLOCK)}
        icon={<CodeBlock />}
      />
    </>
  );
};


// TODO: list break / have weird behavior when switching between list types, probably due to poor logic in
// https://github.com/udecode/plate/blob/ac3f7d9072c3dd12e971d52af68d07ee18496f57/packages/elements/list/src/transforms/toggleList.ts
export const ToolbarButtonsList = () => {
  const editor = P.usePlateEditorRef(P.useEventEditorSelectors.focus());

  return (
    <>
      <ListToolbarButton
        type={P.getPluginType(editor, P.ELEMENT_UL)}
        icon={<FormatListBulleted />}
      />
      <ListToolbarButton
        type={P.getPluginType(editor, P.ELEMENT_OL)}
        icon={<FormatListNumbered />}
      />
    </>
  );
};

export const ToolbarButtonsBasicMarks = () => {
  const editor = P.usePlateEditorRef(P.useEventEditorSelectors.focus());
  const tooltip = {
    arrow: true,
    delay: 0,
    duration: [200, 0],
    hideOnClick: false,
    offset: [0, 17],
    placement: 'top',
  };
  return (
    <>
      <MarkToolbarButton
        type={P.getPluginType(editor, P.MARK_BOLD)}
        icon={<FormatBold />}
        tooltip={{ content: 'Bold (⌘B)', ...tooltip }}
      />
      <MarkToolbarButton
        type={P.getPluginType(editor, P.MARK_ITALIC)}
        icon={<FormatItalic />}
        tooltip={{ content: 'Italic (⌘I)', ...tooltip }}
      />
      <MarkToolbarButton
        type={P.getPluginType(editor, P.MARK_UNDERLINE)}
        icon={<FormatUnderlined />}
        tooltip={{ content: 'Underline (⌘U)', ...tooltip }}
      />
      <MarkToolbarButton
        type={P.getPluginType(editor, P.MARK_CODE)}
        icon={<CodeAlt />}
        tooltip={{ content: 'Code', ...tooltip }}
      />
      <MarkToolbarButton
        type={P.getPluginType(editor, P.MARK_HIGHLIGHT)}
        icon={<Highlight />}
        tooltip={{ content: 'Highlight', ...tooltip }}
      />
    </>
  );
};
