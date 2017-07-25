import React from 'react'
import _ from 'lodash'
import {
  ScrollView,
  View
} from 'react-native'
import {Actions as NavActions} from 'react-native-router-flux'
import { connect } from 'react-redux'

import StoryEditActions from '../../Redux/StoryCreateRedux'
import Editor from '../../Components/NewEditor/Editor'
import NavBar from './NavBar'
import styles, {customStyles} from './3_FullScreenEditorStyles'
import pathAsFileObject from '../../Lib/pathAsFileObject'
import getImageUrl from '../../Lib/getImageUrl'
import HeroAPI from '../../Services/HeroAPI'
import getVideoUrl from '../../Lib/getVideoUrl'
import NavButtonStyles from '../../Navigation/Styles/NavButtonStyles'
import Loader from '../../Components/Loader'
import Metrics from '../../Themes/Metrics'
import Immutable from 'seamless-immutable'

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
    return Promise.resolve(this.editor.getEditorStateAsObject())
      .then(draftjsObject => {
        const story = {...this.props.story, draftjsContent: draftjsObject}
        this.props.update(this.props.story.id, story)
      })
  }

  getContent() {
    if (_.keys(this.props.story.draftjsContent).length) {
      const content = Immutable.asMutable(this.props.story.draftjsContent, {deep: true})
      if (!content.entityMap) content.entityMap = {}
      return {value: content}
    } else {
      return {}
    }
  }

  render () {

    return (
      <View style={[styles.root]}>
        <NavBar
          title='Content'
          onLeft={this._onLeft}
          leftTitle='Back'
          onRight={this._onRight}
          rightIcon={'arrowRightRed'}
          rightTitle='Next'
          rightTextStyle={{paddingRight: 10}}
        />
        <Editor
          ref={i => this.editor = i}
          style={{
            flex: 1,
            minHeight: Metrics.screenHeight - Metrics.navBarHeight,
            minWidth: Metrics.screenWidth
          }}
          onPressImage={this._handlePressAddImage}
          onPressVideo={this._handlePressAddVideo}
          customStyles={customStyles}
          {...this.getContent()}
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
    // this.editor.prepareInsert()
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
    // this.editor.prepareInsert()
    // setTimeout(() => {
      NavActions.mediaSelectorScreen({
        type: 'push',
        mediaType: 'video',
        title: 'Add Video',
        leftTitle: 'Cancel',
        onLeft: () => {
          NavActions.pop()
          // setTimeout(() => this.editor.restoreSelection(), 1000)
        },
        rightTitle: 'Next',
        onSelectMedia: this._handleAddVideo
      })
    // }, 100)
  }

  _handleAddImage = (data) => {
    // this.editor.restoreSelection()
    this.setState({imageUploading: true})
    api.uploadStoryImage(this.props.story.id, pathAsFileObject(data))
      .then(({data: imageUpload}) => {
        this.editor.insertImage(_.get(imageUpload, 'original.path'))
        this.setState({imageUploading: false})
      })
    NavActions.pop()
  }

  _handleAddVideo = (data) => {
    // this.editor.restoreSelection()
    this.setState({videoUploading: true})
    api.uploadStoryVideo(this.props.story.id, pathAsFileObject(data))
      .then(({data: videoUpload}) => {
        this.editor.insertVideo(_.get(videoUpload, 'original.path'))
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
