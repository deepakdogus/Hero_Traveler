/*
web and mobile have different versions of draftJS
due to this SelectionState's import would cause an error on simulator for some reason
since these two methods are only used by web we are moving them to here.
If we need these two methods in mobile we'll likely need to updgrade draftJS and
ensure that Andrew's draftJS code does not get messed up by this
*/
export {default as createSelectionWithFocus} from './createSelectionWithFocus'
export {default as removeMedia} from './removeMedia'
