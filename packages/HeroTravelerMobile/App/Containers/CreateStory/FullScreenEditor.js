import React from 'react'
import {
  View
} from 'react-native'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import {Actions as NavActions} from 'react-native-router-flux'
import { connect } from 'react-redux'
import R from 'ramda'

import StoryEditActions from '../../Redux/StoryCreateRedux'
import Editor from '../../Components/Editor'
import NavBar from './NavBar'
import styles from './FullScreenEditorStyles'

class FullScreenEditor extends React.Component {

  _onLeft = () => {
    NavActions.pop()
  }

  _onRight = () => {
    NavActions.createStory_details()
  }

  render () {
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
          content={this.props.story.content}
          onChange={(text) => this.props.change('content', text)}
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
    NavActions.pop()
  }
}

const selector = formValueSelector('createStory')
export default R.compose(
  connect(state => {
    return {
      story: {
      //   id: state.storyCreate.draft.id,
      //   // content: state.storyCreate.content
      }
    }
  }, (dispatch) => {
    return {
      // update: (id, attrs) => {
      //   dispatch(
      //     StoryEditActions.updateDraft(id, attrs)
      //   )
      // }
    }
  }),
  reduxForm({
    form: 'createStory',
    destroyOnUnmount: false,
    keepDirtyOnReinitialize: true,
    enableReinitialize: true,
    initialValues: {
      content: ''
    }
  })
)(FullScreenEditor)
