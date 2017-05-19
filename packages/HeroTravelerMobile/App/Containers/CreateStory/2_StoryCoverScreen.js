import _ from 'lodash'
import React, {PropTypes, Component} from 'react'
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Image,
  Alert,
  TextInput
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import R from 'ramda'
import Icon from 'react-native-vector-icons/FontAwesome'

import API from '../../Services/HeroAPI'
import StoryEditActions from '../../Redux/StoryCreateRedux'
import ShadowButton from '../../Components/ShadowButton'
import Loader from '../../Components/Loader'
import {Colors, Images, Metrics} from '../../Themes'
import styles, { placeholderColor } from './2_StoryCoverScreenStyles'
import NavBar from './NavBar'
import getImageUrl from '../../Lib/getImageUrl'
import getVideoUrl from '../../Lib/getVideoUrl'
import Video from '../../Components/Video'
import pathAsFileObject from '../../Lib/pathAsFileObject'
import isTooltipComplete, {Types as TooltipTypes} from '../../Lib/firstTimeTooltips'
import RoundedButton from '../../Components/RoundedButton'
import UserActions from '../../Redux/Entities/Users'

const api = API.create()

class StoryCoverScreen extends Component {

  static propTypes = {
    user: PropTypes.object,
    mediaType: PropTypes.oneOf(['photo', 'video']).isRequired,
    navigatedFromProfile: PropTypes.bool
  }

  static defaultProps = {
    mediaType: 'photo',
    story: {},
    navigatedFromProfile: false
  }

  constructor(props) {
    super(props)
    this.state = {
      imageMenuOpen: false,
      file: null,
      updating: false,
      originalStory: props.story,
      title: props.story.title || '',
      description: props.story.description || '',
      // Local file path to the image
      coverImage: getImageUrl(props.story.coverImage),
      // Local file path to the video
      coverVideo: getVideoUrl(props.story.coverVideo)
    }
  }

  componentWillMount() {
    const {storyId} = this.props
    api.setAuth(this.props.accessToken.value)
    // Create a new draft to work with if one doesn't exist
    if (!storyId) {
      this.props.registerDraft()
    } else {
      this.props.loadStory(storyId)
    }
  }

  isPhotoType() {
    return this.props.mediaType === 'photo'
  }

  _toggleImageMenu = () => {
    this.setState({imageMenuOpen: !this.state.imageMenuOpen})
  }

  renderCoverPhoto(coverPhoto) {
    return R.ifElse(
      R.identity,
      R.always((
        <Image source={{uri: coverPhoto}} style={styles.coverPhoto}>
          {this.renderContent()}
        </Image>
      )),
      R.always(this.renderContent(coverPhoto))
    )(!!coverPhoto)
  }

  renderCoverVideo(coverVideo) {
    return R.ifElse(
      R.identity,
      R.always((
        <View style={styles.coverVideo}>
          <Video
            path={coverVideo}
            allowVideoPlay={false}
            autoPlayVideo={false}
          />
          {this.renderContent()}
        </View>
      )),
      R.always(this.renderContent())
    )(!!coverVideo)
  }

  renderTextColor = (baseStyle) => {
    return R.ifElse(
      R.identity,
      R.always([baseStyle, { color: 'white' }]),
      R.always(baseStyle),
    )(!!this.state.coverImage)
  }

  renderPlaceholderColor = (baseColor) => {
    return R.ifElse(
      R.identity,
      R.always('white'),
      R.always(baseColor)
    )(!!this.state.coverImage)
  }

  _onLeft = () => {
    const isDraft = this.props.story.draft === true
    console.log(isDraft)
    const title = isDraft ? 'Cancel Draft' : 'Cancel Edits'
    const message = isDraft ? 'Do you want to save this draft?' : 'Do you want to save these edits?'

    // When a user cancels the draft flow, remove the draft
    Alert.alert(
      title,
      message,
      [{
        text: 'Yes',
        onPress: () => {
          if (!this.isValid()) {
            this.setState({error: 'Please add a cover and a title to continue'})
          } else {
            this.saveStory().then(() => {
              this.navBack()
            })
          }
        }
      }, {
        text: 'No',
        onPress: () => {
          if (isDraft) {
            this.props.discardDraft(this.props.story.id)
          } else {
            this.props.update(this.props.story.id, this.state.originalStory, true)
          }
          this.navBack()
        }
      }]
    )
  }

  isValid() {
    return _.every([
      !!this.state.coverImage || !!this.state.coverVideo,
      !!this.state.title
    ])
  }

  navBack() {
    this.props.dispatch(StoryEditActions.resetCreateStore())
    if (this.props.navigatedFromProfile) {
      NavActions.tabbar({type: 'reset'})
      NavActions.profile()
    } else {
      NavActions.pop()
    }
  }

  hasTitleChanged() {
    return !!this.state.title && this.state.title !== this.props.story.title
  }

  hasDescriptionChanged() {
    return !!this.state.description && this.state.description !== this.props.story.description
  }

  hasImageChanged() {
    return !!this.state.coverImage && this.state.coverImage !== getImageUrl(this.props.story.coverImage)
  }

  hasVideoChanged() {
    return !!this.state.coverVideo && this.state.coverVideo !== getImageUrl(this.props.story.coverVideo)
  }

  _onRight = () => {
    const hasImageChanged = this.hasImageChanged()
    const hasVideoChanged = this.hasVideoChanged()
    const hasVideoSelected = !!this.state.coverVideo
    const hasImageSelected = !!this.state.coverImage
    const hasTitleChanged = this.hasTitleChanged()
    const hasDescriptionChanged = this.hasDescriptionChanged()
    const nothingHasChanged = _.every([
      hasVideoSelected || hasImageSelected,
      !hasImageChanged,
      !hasVideoChanged,
      !hasTitleChanged,
      !hasDescriptionChanged
    ])

    // If nothing has changed, let the user go forward if they navigated back
    if (nothingHasChanged) {
      return NavActions.createStory_content()
    }

    if (!this.isValid()) {
      this.setState({error: 'Please add a cover and a title to continue'})
      return
    }

    if ((hasImageSelected || hasVideoSelected) && (hasVideoChanged || hasImageChanged) && !this.state.file) {
      this.setState({error: 'Sorry, could not process file. Please try another file.'})
      return
    }

    this.saveStory()
      .then(() => {
        NavActions.createStory_content()
      })
  }

  saveStory() {
    let promise

    this.setState({
      updating: true
    })

    if (this.state.file) {
      promise = this.isPhotoType() ?
        api.uploadCoverImage(this.props.story.id, this.state.file) :
        api.uploadCoverVideo(this.props.story.id, this.state.file)

      promise = promise.then(resp => resp.data)
    } else {
      promise = Promise.resolve(this.props.story)
    }

    return promise.then(story => {

      if (this.hasTitleChanged()) {
        story.title = _.trim(this.state.title)
      }

      if (this.hasDescriptionChanged()) {
        story.description = _.trim(this.state.description)
      }

      this.props.update(story.id, story)

      this.setState({
        file: null,
        updating: false,
        coverImage: story.coverImage ? getImageUrl(story.coverImage) : null,
        coverVideo: story.coverVideo ? getVideoUrl(story.coverVideo) : null
      })
    })
  }

  hasNoPhoto() {
    return !this.state.coverImage
  }

  renderContent () {
    return (
      <KeyboardAvoidingView behavior='position'>
        <View style={this.hasNoPhoto() ? styles.lightGreyAreasBG : null}>
          {this.hasNoPhoto() && <View style={styles.spaceView} />}
          {this.hasNoPhoto() &&
            <View style={[styles.spaceView, styles.addPhotoView]}>
              <TouchableOpacity
                style={styles.addPhotoButton}
                onPress={() => {
                  this.setState({error: null})
                  NavActions.mediaSelectorScreen({
                    mediaType: this.props.mediaType,
                    title: 'Add a Cover',
                    leftTitle: 'Cancel',
                    onLeft: () => NavActions.pop(),
                    rightTitle: 'Next',
                    onSelectMedia: this._handleSelectCover
                  })
                }}
              >
                <Icon name={this.isPhotoType() ? 'camera' : 'video-camera'} size={40} color='gray' style={styles.cameraIcon} />
                <Text style={this.renderTextColor(styles.baseTextColor)}>
                  {this.isPhotoType() ? '+ ADD COVER PHOTO' : '+ ADD COVER VIDEO'}
                </Text>
              </TouchableOpacity>
            </View>
          }
          {!this.hasNoPhoto() && !this.state.imageMenuOpen &&
            <TouchableWithoutFeedback onPress={this._toggleImageMenu}>
              <View>
                <View style={styles.spaceView} />
                <View style={styles.spaceView} />
              </View>
            </TouchableWithoutFeedback>
          }
          {!this.hasNoPhoto() && this.state.imageMenuOpen &&
            <View>
              <TouchableWithoutFeedback onPress={this._toggleImageMenu}>
                <View>
                  <View style={styles.spaceView} />
                  <View style={styles.imageMenuView}>
                    <TouchableOpacity
                      onPress={() =>
                        NavActions.mediaSelectorScreen({
                          mediaType: this.props.mediaType,
                          title: 'Change Cover',
                          leftTitle: 'Cancel',
                          onLeft: () => NavActions.pop(),
                          rightTitle: 'Update',
                          onSelectMedia: this._handleSelectCover
                        })
                      }
                      style={styles.iconButton}>
                      <Icon name='camera' color={Colors.snow} size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => alert('crop')}
                      style={styles.iconButton}>
                      <Icon name='crop' color={Colors.snow} size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.setState({coverImage: null, coverVideo: null, imageMenuOpen: false})}
                      style={styles.iconButton}>
                      <Icon name='trash' color={Colors.snow} size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={this._toggleImageMenu}
                      style={styles.iconButton}>
                      <Icon name='close' color={Colors.snow} size={30} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          }
          <View style={styles.addTitleView}>
            <TextInput
              editable={!this.state.imageMenuOpen}
              style={this.renderTextColor(styles.titleInput)}
              placeholder='ADD A TITLE'
              placeholderTextColor={this.renderPlaceholderColor(placeholderColor)}
              returnKeyType='next'
              value={this.state.title}
              onChangeText={title => this.setState({title})}
            />
            <TextInput
              editable={!this.state.imageMenuOpen}
              style={this.renderTextColor(styles.subTitleInput)}
              placeholder='Add a subtitle'
              placeholderTextColor={this.renderPlaceholderColor(placeholderColor)}
              onChangeText={description => this.setState({description})}
              value={this.state.description}
              returnKeyType='done'
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }

  _completeTooltip = () => {
    const tooltips = this.props.user.introTooltips.concat({
      name: TooltipTypes.STORY_PHOTO_EDIT,
      seen: true,
    })
    this.props.completeTooltip(tooltips)
  }

  renderTooltip() {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,.4)',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={this._completeTooltip}
      >
          <View style={{
            height: 200,
            width: 200,
            padding: 20,
            borderRadius: 20,
            backgroundColor: 'white',
            justifyContent: 'space-between',
            alignItems: 'center',
            shadowColor: 'black',
            shadowOpacity: .2,
            shadowRadius: 30
          }}>
          <View style={{
            height: 50,
            width: 120,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Icon name='camera' size={18} />
            <Icon name='crop' size={18} />
            <Icon name='trash' size={18} />
          </View>
            <Icon name='bullseye' style={{marginBottom: -10}} size={18} />
            <Icon name='hand-pointer-o' style={{backgroundColor: 'transparent', marginRight: -8}} size={30} />
            <Text style={{marginTop: 10}}>Tap an image to edit it</Text>
            <RoundedButton
              style={{
                height: 30,
                borderRadius: 10,
                paddingHorizontal: 10
              }} onPress={this._completeTooltip}>Ok, I got it</RoundedButton>
          </View>

      </TouchableOpacity>
    )
  }

  render () {
    let showTooltip = false;

    if (this.props.user && this.state.file) {
      showTooltip = !isTooltipComplete(
        TooltipTypes.STORY_PHOTO_EDIT,
        this.props.user.introTooltips
      )
    }

    return (
      <View style={{flex: 1}}>
        <NavBar
          title='Story Cover'
          leftTitle='Cancel'
          onLeft={this._onLeft}
          rightTitle='Next'
          onRight={this._onRight}
        />
        <View style={{flex: 1}}>
          {this.state.error &&
            <ShadowButton
              style={styles.errorButton}
              onPress={() => this.setState({error: null})}
              text={this.state.error} />
          }
          {this.isPhotoType() && this.renderCoverPhoto(this.state.coverImage)}
          {!this.isPhotoType() && this.renderCoverVideo(this.state.coverVideo)}
        </View>
        {this.state.updating &&
          <Loader
            style={styles.loading}
            text='Saving progress...'
            textStyle={styles.loadingText}
            tintColor='rgba(0,0,0,.9)' />
        }
        {showTooltip && this.renderTooltip()}
      </View>
    )
  }

  _handleSelectCover = (path) => {
    const file = pathAsFileObject(path)
    this.setState({file})
    if (this.props.mediaType === 'photo') {
      this.setState({coverImage: path})
    } else {
      this.setState({coverVideo: path})
    }
    NavActions.pop()
  }
}

export default connect((state, props) => {
  let story

  if (!state.storyCreate.draft && !!state.entities.stories.entities[props.storyId]) {
    story = state.entities.stories.entities[props.storyId]
  } else {
    story = state.storyCreate.draft
  }

  return {
    accessToken: _.find(state.session.tokens, {type: 'access'}),
    user: state.entities.users.entities[state.session.userId],
    story: {...story}
  }
}, dispatch => ({
  registerDraft: () =>
    dispatch(StoryEditActions.registerDraft()),
  discardDraft: (draftId) =>
    dispatch(StoryEditActions.discardDraft(draftId)),
  update: (id, attrs, doReset) =>
    dispatch(StoryEditActions.updateDraft(id, attrs, doReset)),
  uploadCoverImage: (id, path) =>
    dispatch(StoryEditActions.uploadCoverImage(id, path)),
  uploadCoverVideo: (id, path) =>
    dispatch(StoryEditActions.uploadCoverVideo(id, path)),
  loadStory: (storyId) =>
    dispatch(StoryEditActions.editStory(storyId)),
  completeTooltip: (introTooltips) =>
    dispatch(UserActions.updateUser({introTooltips})),
})
)(StoryCoverScreen)
