import _ from 'lodash'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'

import API from '../../Services/HeroAPI'
import StoryEditActions, {hasDraft} from '../../Redux/StoryCreateRedux'
import { Images } from '../../Themes'
import styles from './1_CreateStoryScreenStyles'
import pathAsFileObject from '../../Lib/pathAsFileObject'
import Loader from '../../Components/Loader'

class CreateStoryScreen extends Component {

  constructor(props) {
    super(props)
    this.api = API.create()
    this.api.setAuth(this.props.accessToken)
    this.state = {
      uploading: false,
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
    if (!this.props.hasDraft && nextProps.hasDraft && !this.props.navigatedFromProfile && !this.state.videoSelected) {
      NavActions.mediaSelectorScreen({
        mediaType: 'video',
        title: 'Create Video',
        leftTitle: 'Cancel',
        onLeft: () => NavActions.pop(),
        rightTitle: 'Next',
        onSelectMedia: this._handleAddVideo
      })
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
    NavActions.createStory_cover({
      mediaType: 'photo'
    })
  }

  render () {
    return (
      <ScrollView
        style={[styles.container, styles.root]}
        contentContainerStyle={{flex: 1, alignItems: 'center'}}
      >
        <Image source={Images.whiteLogo} style={styles.logoImage} />
        <Image source={Images.createStory} style={styles.storyImage} />
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={this._createPhoto}
          >
            <Icon
              name='file-word-o'
              size={40}
              color='white'
            />
            <Text style={[styles.lightText, styles.buttonText]}>CREATE STORY</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
          >
            <Icon
              name='video-camera'
              size={40}
              color='white'
              onPress={this._createVideo}
            />
            <Text style={[styles.lightText, styles.buttonText]}>CREATE VIDEO</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.fakeTabbar}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => NavActions.pop()}>
            <Icon
              name='close'
              size={20}
              color='white'
            />
          </TouchableOpacity>
        </View>
        {this.state.uploading &&
          <Loader
            style={styles.loading}
            text='Saving progress...'
            textStyle={styles.loadingText}
            tintColor='rgba(0,0,0,.9)' />
        }
      </ScrollView>
    )
  }
}

export default connect(state => ({
  story: state.storyCreate.draft,
  accessToken: _.get(_.find(state.session.tokens, {type: 'access'}), 'value', null),
  hasDraft: hasDraft(state.storyCreate)
}), dispatch => ({
  registerDraft: () =>
    dispatch(StoryEditActions.registerDraft()),
}))(CreateStoryScreen)
