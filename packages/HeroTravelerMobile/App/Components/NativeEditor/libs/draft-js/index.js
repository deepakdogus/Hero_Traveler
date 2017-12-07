// Native views
import {
  requireNativeComponent
} from 'react-native'
export const NativeEditor = requireNativeComponent('RNDJDraftJSEditor', null)

// DraftJS Exports
export {default as EditorState} from 'draft-js/lib/EditorState'
export {default as convertFromRaw} from 'draft-js/lib/convertFromRawToDraftState'
export {default as convertToRaw} from 'draft-js/lib/convertFromDraftStateToRaw'
export {default as RichUtils} from 'draft-js/lib/RichTextEditorUtil'
export {default as SelectionState} from 'draft-js/lib/SelectionState'
export {default as Modifier} from 'draft-js/lib/DraftModifier'
export {default as genKey} from 'draft-js/lib/generateRandomKey'
export {default as ContentBlock} from 'draft-js/lib/ContentBlock'
export {default as AtomicBlockUtils} from 'draft-js/lib/AtomicBlockUtils'
export {default as keyCommandPlainBackspace} from 'draft-js/lib/keyCommandPlainBackspace'
export {default as keyCommandBackspaceWord} from 'draft-js/lib/keyCommandBackspaceWord'
export {default as keyCommandBackspaceToStartOfLine} from 'draft-js/lib/keyCommandBackspaceToStartOfLine'
export {default as DraftOffsetKey} from 'draft-js/lib/DraftOffsetKey'
export {default as removeEntitiesAtEdges} from 'draft-js/lib/removeEntitiesAtEdges'
export {default as removeRangeFromContentState} from 'draft-js/lib/removeRangeFromContentState'

// Custom Commands
export {default as insertText} from './insertText'
export {default as customKeyCommandInsertNewline} from './customKeyCommandInsertNewline'
export {default as insertTextAtPosition} from './insertTextAtPosition'
export {default as backspace} from './backspace'
export {default as insertNewline} from './insertNewline'
export {default as updateSelectionHasFocus} from './updateSelectionHasFocus'
export {default as updateSelectionAnchorAndFocus} from './updateSelectionAnchorAndFocus'
export {default as insertAtomicBlock} from './insertAtomicBlock'
export {default as makeSelectionState} from './makeSelectionState'
