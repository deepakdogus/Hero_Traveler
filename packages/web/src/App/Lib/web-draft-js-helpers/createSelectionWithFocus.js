import { SelectionState } from 'draft-js'

export default function createSelectionWithFocus(key) {
  return new SelectionState({
    anchorKey: key,
    anchorOffset: 0,
    focusKey: key,
    focusOffset: 0,
    hasFocus: true,
  })
}
