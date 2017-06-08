import React from 'react'
import _ from 'lodash'
import {
  View
} from 'react-native'
import {Actions as NavActions} from 'react-native-router-flux'
import { connect } from 'react-redux'

import StoryEditActions from '../../Redux/StoryCreateRedux'
import Editor from '../../Components/Editor'
import NavBar from './NavBar'
import styles from './3_FullScreenEditorStyles'
import pathAsFileObject from '../../Lib/pathAsFileObject'
import getImageUrl from '../../Lib/getImageUrl'
import HeroAPI from '../../Services/HeroAPI'
import getVideoUrl from '../../Lib/getVideoUrl'
import Loader from '../../Components/Loader'

const api = HeroAPI.create()

class FullScreenEditor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      imageUploading: false,
      videoUploading: false,
    }
  }

  componentDidMount() {
    api.setAuth(this.props.accessToken)
  }

  _onLeft = () => {
    this.saveContent().then(() => {
      NavActions.pop()
    })
  }

  _onRight = () => {
    this.saveContent().then(() => {
      NavActions.createStory_details()
    })
  }

  isUploading() {
    return this.state.imageUploading || this.state.videoUploading
  }

  saveContent() {
    return this.editor.getContentHtml().then(storyContent => {
      if (this.props.story.content !== storyContent) {
        const story = {...this.props.story, content: storyContent}
        this.props.update(this.props.story.id, story)
      }
    })
  }

  render () {
    return (
      <View style={[styles.root]}>
        <NavBar
          title='Content'
          rightTitle='Next'
          onRight={this._onRight}
          leftTitle='Back'
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
          onAddVideo={this._handlePressAddVideo}
        />
        {this.isUploading() &&
          <Loader
            style={styles.loading}
            text={this.state.imageUploading ? 'Saving image...' : 'Saving video...'}
            textStyle={styles.loadingText}
            tintColor='rgba(0,0,0,.9)' />
        }
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
    }, 100)
  }

  _handlePressAddVideo = () => {
    this.editor.prepareInsert()
    setTimeout(() => {
      NavActions.mediaSelectorScreen({
        type: 'push',
        mediaType: 'video',
        title: 'Add Video',
        leftTitle: 'Cancel',
        onLeft: () => {
          NavActions.pop()
          setTimeout(() => this.editor.restoreSelection(), 1000)
        },
        rightTitle: 'Next',
        onSelectMedia: this._handleAddVideo
      })
    }, 100)
  }

  _handleAddImage = (data) => {
    this.editor.restoreSelection()
    this.setState({imageUploading: true})
    api.uploadStoryImage(this.props.story.id, pathAsFileObject(data))
      .then(({data: imageUpload}) => {
        this.editor.insertImage({
          src: getImageUrl(imageUpload)
        })
        this.setState({imageUploading: false})
      })
    NavActions.pop()
  }

  _handleAddVideo = (data) => {
    this.editor.restoreSelection()
    this.setState({videoUploading: true})
    api.uploadStoryVideo(this.props.story.id, pathAsFileObject(data))
      .then(({data: videoUpload}) => {
        this.editor.insertVideo({
          videoAttributes: {
              width: 320,
              height: 240,
              controls: true,
              src: getVideoUrl(videoUpload),
            },
            sourceAttributes: {
              // type: 'video/quicktime'
            }
        })
        this.setState({videoUploading: false})
      })
    NavActions.pop()
  }
}

export default connect(state => {
  return {
    accessToken: _.find(state.session.tokens, {type: 'access'}).value,
    story: {
      ...state.storyCreate.draft
    }
  }
}, (dispatch) => {
  return {
    update: (id, attrs) =>
      dispatch(StoryEditActions.updateDraft(id, attrs)),
  }
})(FullScreenEditor)
