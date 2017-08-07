import _ from 'lodash'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import API from '../../Services/HeroAPI'
import StoryEditActions, {hasDraft} from '../../Redux/StoryCreateRedux'
import styles from './1_CreateStoryScreenStyles'
import pathAsFileObject from '../../Lib/pathAsFileObject'
import Loader from '../../Components/Loader'
import TabIcon from '../../Components/TabIcon'

class CreateStoryScreen extends Component {

  constructor(props) {
    super(props)
    this.api = API.create()
    this.api.setAuth(this.props.accessToken)
    this.state = {
      uploading: false,
      video: false,
      videoSelected: false
    }
  }

  static propTypes = {
    navigatedFromProfile: PropTypes.bool
  }

  defaultProps = {
    navigatedFromProfile: false
  }

  componentWillReceiveProps(nextProps) {
    // Once a draft is created, move to media selector
    if (!this.props.hasDraft && nextProps.hasDraft && !this.props.navigatedFromProfile && this.state.video && !this.state.videoSelected) {
      NavActions.createStoryFlow({
        mediaType: 'video',
        title: 'Create Video',
        leftTitle: 'Cancel',
        onLeft: () => NavActions.pop(),
        rightTitle: 'Next',
        onSelectMedia: this._handleAddVideo
      })
      /*
      Setting video to false in order to reinitialize state and so that we do not
      retrigger this if statement when we go back from video Story Cover Screen
      */
      this.setState({video: false})
    }
  }

  _handleAddVideo = (path) => {
    this.setState({
      uploading: true,
      videoSelected: true
    }, () => {
      NavActions.pop()
      this.api.uploadCoverVideo(this.props.story.id, pathAsFileObject(path))
        .then(() => {
          this.setState({uploading: false}, () => {
            NavActions.createStory_cover({
              storyId: this.props.story.id,
              shouldLoadStory: true
            })
          })
        })
    })
  }

  _createVideo = () => {
    this.setState({
      video: true
    }, () => {
      this.props.registerDraft()
    })
  }

  _createPhoto = () => {
    this.setState({
      video: false
    }, () => {
      NavActions.createStoryFlow({
        mediaType: 'photo',
        type: 'reset',
        shouldLoadStory: true,
      })
    })
  }

  render () {
    const {isShowCreateModal} = this.props
    /*
      hacky solution to get the story create modal to show up properly
      we need the modal to be on the last Icon or else the icons on the right
      still show up are touchable when they should not be.
      So since the last icon is profile we display profile when the modal
      showCreateModal is not active
    */
    if (!isShowCreateModal) {
      return (
        <TouchableOpacity
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => NavActions.profile()}
        >
          <TabIcon name='profile' />
        </TouchableOpacity>
      )
    }
    else {
      return (
        <View style={styles.wrapper}>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.storyButton]}
              onPress={this._createPhoto}
            >
              <TabIcon name='createMenuStory'/>
              <Text style={[styles.lightText, styles.buttonText]}>CREATE STORY</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.videoButton]}
              onPress={this._createVideo}
            >
              <TabIcon name='video-camera'/>
              <Text style={[styles.lightText, styles.buttonText]}>CREATE VIDEO</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.fakeTabbar}>
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={() => this.props.toggleCreateView()}>
              <TabIcon name='closeGrey'/>
            </TouchableOpacity>
          </View>
          {this.state.uploading &&
            <Loader
              style={styles.loading}
              text='Saving video...'
              textStyle={styles.loadingText}
              tintColor='rgba(0,0,0,.9)' />
          }
        </View>
      )
    }
  }
}

export default connect(state => ({
  story: state.storyCreate.draft,
  accessToken: _.get(_.find(state.session.tokens, {type: 'access'}), 'value', null),
  hasDraft: hasDraft(state.storyCreate),
  isShowCreateModal: state.storyCreate.isShowCreateModal,
}), dispatch => ({
  registerDraft: () =>
    dispatch(StoryEditActions.registerDraft()),
  toggleCreateView: () =>
    dispatch(StoryEditActions.toggleCreateModal()),
}))(CreateStoryScreen)
