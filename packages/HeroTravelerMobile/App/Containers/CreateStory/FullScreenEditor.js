import React from 'react'
import {
  View
} from 'react-native'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import {Actions as NavActions} from 'react-native-router-flux'
import { connect } from 'react-redux'
import R from 'ramda'

import Editor from '../../Components/Editor'
import NavBar from './NavBar'
import styles from './FullScreenEditorStyles'

class FullScreenEditor extends React.Component {

  _onLeft = () => {
    NavActions.pop()
  }

  _onRight = () => {
    this.editor.getContentHtml()
      .then(html => {
        this.props.update(this.props.story.id, {
          content
        })
        
      })
  }

  render () {
    console.log('story content', this.props.story.content.trim())
    return (
      <View style={[styles.root]}>
        <NavBar
          title='Content'
          rightTitle='Next'
          onRight={this._onRight}
          leftTitle='Cancel'
          onLeft={this._onLeft}
        />
        <Editor
          ref={(editor) => {
            if (editor) {
              this.editor = editor.getEditor()
            }
          }}
          content={this.props.story.content.trim()}
          onAddImage={this._handlePressAddImage}
        />
      </View>
    )
  }

  _handlePressAddImage = () => {
    NavActions.mediaSelectorScreen({
      mediaType: 'photo',
      title: 'Add Image',
      onSelectMedia: this._handleAddImage
    })
  }

  _handleAddImage = (localFilePath) => {
    console.log('this.editor.insertImage', localFilePath)
    NavActions.pop()
  }
}

const selector = formValueSelector('createStory')
export default R.compose(
  connect(state => {
    console.log('state', state.storyCreate)
    return {
      story: {
        id: state.storyCreate.draft.id,
        content: state.storyCreate.content ||`<h1>Hello <b>World</b></h1>`
      }
    }
  }),
  reduxForm({
    form: 'createStory',
    destroyOnUnmount: false,
    initialValues: {
      title: '',
      description: '',
      coverPhoto: null
    }
  })
)(FullScreenEditor)
