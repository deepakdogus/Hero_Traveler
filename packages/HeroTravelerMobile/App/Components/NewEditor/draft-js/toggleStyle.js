import {RichUtils} from './reexports'

export default function toggleStyle(editorState, style) {
  return RichUtils.toggleBlockType(editorState, style)
}
