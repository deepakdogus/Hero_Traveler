import React from 'react'
import _ from 'lodash'
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
import styles from './3_FullScreenEditorStyles'
import pathAsFileObject from '../../Lib/pathAsFileObject'
import getImageUrl from '../../Lib/getImageUrl'
import HeroAPI from '../../Services/HeroAPI'

const api = HeroAPI.create()

class FullScreenEditor extends React.Component {

  componentDidMount() {
    api.setAuth(this.props.accessToken)
  }

  _onLeft = () => {
    NavActions.pop()
  }

  _onRight = () => {
    this.editor.getContentHtml().then(storyContent => {
      NavActions.createStory_details({storyContent})
    })
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
          ref={c => {
            if (c) {
              this.c = c
              this.editor = c.getEditor()
            }
          }}
          content={this.props.story.content}
          onAddImage={this._handlePressAddImage}
        />
      </View>
    )
  }

  _handlePressAddImage = () => {
    this.editor.prepareInsert()
    setTimeout(() => {
      NavActions.mediaSelectorScreen({
        type: 'push',
        mediaType: 'photo',
        title: 'Add Image',
        leftTitle: 'Cancel',
        onLeft: () => {
          NavActions.pop()
          setTimeout(() => this.editor.restoreSelection(), 1000)
        },
        rightTitle: 'Next',
        onSelectMedia: this._handleAddImage
      })
    }, 500)
  }

  _handleAddImage = (data) => {
    this.editor.restoreSelection()
    api.uploadStoryImage(this.props.story.id, pathAsFileObject(data))
      .then(({data: imageUpload}) => {
        this.editor.insertImage({
          src: getImageUrl(imageUpload)
        })
      })
    NavActions.pop()
  }
}

const selector = formValueSelector('createStory')
export default R.compose(
  connect(state => {
    return {
      accessToken: _.find(state.session.tokens, {type: 'access'}).value,
      story: {
        id: _.get(state.storyCreate.draft, 'id'),
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
      storyContent: ''
    }
  })
)(FullScreenEditor)
