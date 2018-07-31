import React from 'react'
import PropTypes from 'prop-types'
import {EditorState} from 'draft-js'
import 'draft-js/dist/Draft.css'
import 'draft-js-side-toolbar-plugin/lib/plugin.css'
import Editor from 'draft-js-plugins-editor'
import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin'
import BlockTypeSelect from 'draft-js-side-toolbar-plugin/lib/components/BlockTypeSelect'
import {
  BoldButton,
} from 'draft-js-buttons'

const CustomBlockTypeSelect = ({ getEditorState, setEditorState, theme }) => (
  <BlockTypeSelect
    getEditorState={getEditorState}
    setEditorState={setEditorState}
    theme={theme}
    structure={[
      BoldButton,
    ]}
  />
)

const sideToolbarPlugin = createSideToolbarPlugin({
  structure: [CustomBlockTypeSelect]
})

const { SideToolbar } = sideToolbarPlugin;

export default class BodyEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty()
    }
  }

  onChange = (editorState) => this.setState({editorState})
  focus = () => this.editor.focus()
  setEditorRef = (ref) => this.editor = ref

  render() {
    return (
      <div>
        <Editor
          editorState={this.state.editorState}
          placeholder='Tell your story'
          onChange={this.onChange}
          plugins={[sideToolbarPlugin]}
          ref={this.setEditorRef}
        />
        <SideToolbar />
      </div>
    )
  }
}
