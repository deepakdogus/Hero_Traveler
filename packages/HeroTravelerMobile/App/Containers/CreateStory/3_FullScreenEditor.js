import React from 'react'
import _ from 'lodash'
import {
  ScrollView,
  StyleSheet,
  View
} from 'react-native'
import {Colors, Metrics} from '../../Themes/'
import {Actions as NavActions} from 'react-native-router-flux'
import {connect} from 'react-redux'

import StoryEditActions from '../../Shared/Redux/StoryCreateRedux'
import Editor from '../../Components/NewEditor/Editor'
import NavBar from './NavBar'
import pathAsFileObject from '../../Shared/Lib/pathAsFileObject'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import HeroAPI from '../../Shared/Services/HeroAPI'
import getVideoUrl from '../../Shared/Lib/getVideoUrl'
import Loader from '../../Components/Loader'
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
          customStyleMap={customStyles}
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
    this.setState({imageUploading: true})
    api.uploadStoryImage(this.props.story.id, pathAsFileObject(data))
      .then(({data: imageUpload}) => {
        this.editor.insertImage(_.get(imageUpload, 'original.path'))
        this.setState({imageUploading: false})
      })
    NavActions.pop()
  }

  _handleAddVideo = (data) => {
    this.setState({videoUploading: true})
    api.uploadStoryVideo(this.props.story.id, pathAsFileObject(data))
      .then(({data: videoUpload}) => {
        this.editor.insertVideo(_.get(videoUpload, 'original.path'))
        this.setState({videoUploading: false})
      })
    NavActions.pop()
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column'
  },
  loadingText: {
    color: Colors.white
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
})

const customStyles = {
  unstyled: {
    fontSize: 18,
    color: '#757575'
  },
  link: {
    color: '#c4170c',
    fontWeight: '600',
    textDecorationLine: 'none',
  },
  'header-one': {
    fontSize: 21,
    fontWeight: '400',
    color: '#1a1c21'
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
