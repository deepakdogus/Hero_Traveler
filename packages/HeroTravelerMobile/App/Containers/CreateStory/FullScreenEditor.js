import React from 'react'
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import {Actions as NavActions} from 'react-native-router-flux'
import { connect } from 'react-redux'
import R from 'ramda'

import Editor from '../../Components/Editor'
import NavBar from './NavBar'
import styles from './FullScreenEditorStyles'

class FullScreenEditor extends React.Component {

  render () {
    return (
      <View style={[styles.root]}>
        <NavBar
          title='Content'
          rightTitle='Next'
          leftTitle='Cancel'
        />
        <Editor
          ref={(editor) => {
            if (editor) {
              this.editor = editor.getEditor()
            }
          }}
          onAddImage={this._handlePressAddImage}
        />
        <TouchableOpacity onPress={() => {
          this.editor.getContentHtml()
          .then(html => {
            console.log('html', html)
          })
        }}>
          <Text color='black'>Get HTML</Text>
        </TouchableOpacity>
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
  connect(state => ({
    story: {
    }
    // state: state
  })),
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
