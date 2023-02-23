import {
  autoformatArrow,
  autoformatPunctuation,
  autoformatSmartQuotes,
} from '@udecode/plate-headless'
import { autoformatBlocks } from './autoformatBlocks'
import { autoformatLists } from './autoformatLists'
import { autoformatMarks } from './autoformatMarks'

export const autoformatRules = [
  ...autoformatBlocks,
  ...autoformatLists,
  ...autoformatMarks,
  ...autoformatSmartQuotes,
  ...autoformatPunctuation,
  ...autoformatArrow,
]
