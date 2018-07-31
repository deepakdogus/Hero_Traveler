import React from 'react'
import PropTypes from 'prop-types'
import {Editor, EditorState} from 'draft-js'
import '../../../../node_modules/draft-js/dist/Draft.css'

export default class BodyEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty()
    }
  }

  onChange = (editorState) => this.setState({editorState})

  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        placeholder='Tell your story'
        onChange={this.onChange}
      />
    )
  }
}










