import decorateComponentWithProps from 'decorate-component-with-props'
import createStore from './utils/createStore'
import Toolbar from './Toolbar'

/*
 * Forked from draft-js-side-toolbar-plugin
 * Created by Benjamin Kniffler (benjamin@kniffler.com)
 *
 * DO NOT REMOVE LICENSE
 *
 * Original: https://github.com/draft-js-plugins/draft-js-plugins/tree/master/draft-js-side-toolbar-plugin
 *
 */
export default (config = {}) => {
  const defaultPostion = 'left'

  const store = createStore({
    isVisible: true,
  })

  const { position = defaultPostion } = config

  const toolbarProps = {
    store,
    position,
  }

  return {
    initialize: ({ setEditorState, getEditorState, getEditorRef }) => {
      store.updateItem('getEditorState', getEditorState)
      store.updateItem('setEditorState', setEditorState)
      store.updateItem('getEditorRef', getEditorRef)
    },
    // Re-Render the toolbar on every change
    onChange: editorState => {
      store.updateItem('editorState', editorState)
      return editorState
    },
    SideToolbar: decorateComponentWithProps(Toolbar, toolbarProps),
  }
}
