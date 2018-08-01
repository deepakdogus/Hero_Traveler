import React from 'react'
import PropTypes from 'prop-types'
import {EditorState} from 'draft-js'
import 'draft-js/dist/Draft.css'
import 'draft-js-side-toolbar-plugin/lib/plugin.css'
import Editor from 'draft-js-plugins-editor'
import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin'
import BlockTypeSelect from 'draft-js-side-toolbar-plugin/lib/components/BlockTypeSelect'
import styled from 'styled-components'
import {
  BoldButton,
} from 'draft-js-buttons'

import {
  convertFromRaw,
} from './editorHelpers/draft-js'
import Image from '../Image'
import Video from '../Video'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import {getVideoUrlBase} from '../../Shared/Lib/getVideoUrl'
//   NativeEditor,
//   EditorState,
//   RichUtils,
//   convertToRaw,
//   insertText,
//   insertTextAtPosition,
//   backspace,
//   insertNewline,
//   insertAtomicBlock,
//   updateSelectionHasFocus,
//   updateSelectionAnchorAndFocus,
//   makeSelectionState,

const Caption = styled.p`
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: .7px;
  font-style: italic;
  text-align: center;
  margin-top: 0;
`

const StyledImage = styled(Image)`
  width: 100%;
`

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

class MediaComponent extends React.Component {
  render() {
    const {type, url, text, key} = this.props.blockProps

    const videoUrl = `${getVideoUrlBase()}/${url}`
    switch (type) {
      case 'image':
        return (
          <div key={key}>
            <StyledImage src={getImageUrl(url, 'contentBlock')} />
            {text && <Caption>{text}</Caption>}
          </div>
        )
      case 'video':
        return (
          <div key={key}>
            <Video
              src={videoUrl}
              withPrettyControls
            />
            {text && <Caption>{text}</Caption>}
          </div>
        )
    }
  }
}


function myBlockRenderer(contentBlock) {
  const type = contentBlock.getType()

  if (type === 'atomic') {
    const props = {
      text: contentBlock.getText(),
      key: contentBlock.getKey(),
    }
    contentBlock.getData().mapEntries((entry) => {
      props[entry[0]] = entry[1]
    })
    return {
      component: MediaComponent,
      editable: false,
      props: props,
    };
  }
}

export default class BodyEditor extends React.Component {
  constructor(props) {
    super(props)
    let editorState

    if (props.value) editorState = EditorState.createWithContent(convertFromRaw(props.value))
    else editorState = EditorState.createEmpty()
    this.state = {
      editorState
    }
  }

  componentDidUpdate(prevProps){
    if ((!prevProps.value && this.props.value) ||
      (this.props.value && this.props.storyId !== prevProps.storyId)
    ){
      this.setState({
        editorState: EditorState.createWithContent((this.props.value))
      })
    }
  }


  onChange = (editorState) => {
    this.setState({editorState})
    // this.props.onInputChange({
    //   draftjsContent: editorState
    // })
  }

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
          blockRendererFn={myBlockRenderer}
        />
        <SideToolbar />
      </div>
    )
  }
}
