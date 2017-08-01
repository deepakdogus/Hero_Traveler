import {RichUtils} from './reexports'

export default function applyStyle(editorState, styleType) {
  return RichUtils.handleKeyCommand(editorState, styleType)
}
