import _ from 'lodash'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  View,
  KeyboardAvoidingView,
  Image,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import R from 'ramda'
import Icon from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient'
import Immutable from 'seamless-immutable'

import API from '../../Shared/Services/HeroAPI'
import StoryEditActions from '../../Shared/Redux/StoryCreateRedux'
import ShadowButton from '../../Components/ShadowButton'
import Loader from '../../Components/Loader'
import {Colors, Metrics} from '../../Shared/Themes'
import styles, {customStyles, modalBackgroundStyles, modalWrapperStyles} from './2_StoryCoverScreenStyles'
import NavBar from './NavBar'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import getVideoUrl from '../../Shared/Lib/getVideoUrl'
import Video from '../../Components/Video'
import pathAsFileObject from '../../Shared/Lib/pathAsFileObject'
import isTooltipComplete, {Types as TooltipTypes} from '../../Shared/Lib/firstTimeTooltips'
import RoundedButton from '../../Components/RoundedButton'
import UserActions from '../../Shared/Redux/Entities/Users'
import TabIcon from '../../Components/TabIcon'
import Modal from '../../Components/Modal'

import Editor from '../../Components/NewEditor/Editor'
import Toolbar from '../../Components/NewEditor/Toolbar'
import NavButtonStyles from '../../Navigation/Styles/NavButtonStyles'
import {KeyboardTrackingView} from 'react-native-keyboard-tracking-view';

const api = API.create()

const MediaTypes = {
  video: 'video',
  photo: 'photo',
}

class StoryCoverScreen extends Component {

  static propTypes = {
    mediaType: PropTypes.oneOf([MediaTypes.video, MediaTypes.photo]),
    user: PropTypes.object,
    navigatedFromProfile: PropTypes.bool,
    loadStory: PropTypes.func,
    shouldLoadStory: PropTypes.bool
  }

  static defaultProps = {
    mediaType: MediaTypes.photo,
    story: {},
    navigatedFromProfile: false,
    shouldLoadStory: true
  }

  constructor(props) {
    super(props)
    this.timeout = null
    const coverImage = getImageUrl(props.story.coverImage)
    const coverVideo = getVideoUrl(props.story.coverVideo)
    this.state = {
      imageMenuOpen: false,
      file: null,
      updating: false,
      originalStory: props.story,
      title: props.story.title || '',
      description: props.story.description || '',
      // Local file path to the image
      coverImage,
      // Local file path to the video
      coverVideo,
      toolbarOpacity: new Animated.Value(1),
      imageUploading: false,
      videoUploading: false,
      isScrollDown: !!coverImage,
      titleHeight: 34,
      activeModal: undefined,
      toolbarDisplay: false,
    }
  }

  componentWillMount() {
    const {storyId} = this.props
    api.setAuth(this.props.accessToken.value)
    // Create a new draft to work with if one doesn't exist
    if (!storyId) {
      this.props.registerDraft()
    } else if (this.props.shouldLoadStory) {
      this.props.loadStory(storyId)
    }
  }

  componentWillReceiveProps(nextProps) {
    let nextState = {}

    if (this.props.story.title != undefined && !this.props.story.title !== nextProps.story.title) {
      nextState.title = nextProps.story.title
      nextState.description = nextProps.story.description
    }

    if (!this.props.story.coverVideo && nextProps.story.coverVideo) {
      nextState.coverVideo = getVideoUrl(nextProps.story.coverVideo)
    }
    // case of switching to new draft from existing story
    if (this.state.coverVideo &&
      (this.props.story.id !== nextProps.story.id)
    ) {
      nextState.coverVideo = undefined
    }

    if (!this.props.story.coverImage && nextProps.story.coverImage) {
      nextState.coverImage = getImageUrl(nextProps.story.coverImage)
    }
    // case of switching to new draft from existing story
    if (this.state.coverImage &&
      (this.props.story.id !== nextProps.story.id)
    ) {
      nextState.coverImage = undefined
    }

    this.setState(nextState)
  }

  componentWillUpdate(){
    if (this.props.story &&
      !this.isPhotoType() &&
      !this.props.story.coverVideo &&
      !this.state.coverVideo
    ) {
      NavActions.mediaSelectorScreen({
        mediaType: this.props.mediaType,
        title: 'Add Video',
        leftTitle: 'Cancel',
        onLeft: this._onLeft,
        rightTitle: 'Next',
        onSelectMedia: this._handleSelectCover
      })
    }
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

  isPhotoType() {
    return this.getMediaType() === MediaTypes.photo
  }

  getMediaType() {
    if (this.props.story.coverVideo) {
      return MediaTypes.video
    }

    if (this.props.story.coverImage) {
      return MediaTypes.photo
    }

    return this.props.mediaType
  }

  _toggleImageMenu = () => {
    if (this.state.imageMenuOpen) {

      if (this.timeout) {
        clearTimeout(this.timeout)
      }

      this.setState({imageMenuOpen: false}, () => {
        this.resetAnimation()
      })
    } else {
      this.setState({imageMenuOpen: true})
      this.timeout = setTimeout(() => {
        if (this.state.imageMenuOpen) {
          this.fadeOutMenu()
        }
      }, 5000)
    }
  }

  closeMenu() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }

    this.setState({imageMenuOpen: false}, () => {
      this.resetAnimation()
    })
  }

  fadeOutMenu() {
    Animated.timing(
      this.state.toolbarOpacity,
      {
        toValue: 0,
        duration: 300
      }
    ).start(() => {
      this.setState({imageMenuOpen: false}, () => {
        this.resetAnimation()
      })
    })
  }

  resetAnimation() {
    this.state.toolbarOpacity.stopAnimation(() => {
      this.state.toolbarOpacity.setValue(1)
    })
  }

  _touchTrash = () => {
    this.setState({coverImage: null, coverVideo: null, imageMenuOpen: false}, () => {
      this.resetAnimation()
    })
  }

  _touchChangeCover = () => {
    this.setState({imageMenuOpen: false}, () => {
      this.resetAnimation()
    })
    NavActions.mediaSelectorScreen({
      mediaType: this.getMediaType(),
      title: 'Change Cover',
      leftTitle: 'Cancel',
      onLeft: () => NavActions.pop(),
      rightTitle: 'Update',
      onSelectMedia: this._handleSelectCover
    })
  }

  renderCoverPhoto(coverPhoto) {
    return R.ifElse(
      R.identity,
      R.always((
        <Image
          source={{uri: coverPhoto}}
          style={styles.coverPhoto}
          resizeMode='cover'
        >
          <LinearGradient
            colors={['rgba(0,0,0,.4)', 'rgba(0,0,0,.4)']}
            style={{flex: 1}}
          >
            {this.renderContent()}
          </LinearGradient>
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
            resizeMode='cover'
            allowVideoPlay={false}
            autoPlayVideo={false}
            showPlayButton={false}
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
      R.always([baseStyle, { color: Colors.snow }]),
      R.always(baseStyle),
    )(!!(this.state.coverImage || this.state.coverVideo))
  }

  renderPlaceholderColor = (baseColor) => {
    return R.ifElse(
      R.identity,
      R.always('white'),
      R.always(baseColor)
    )(!!(this.state.coverImage || this.state.coverVideo))
  }

  /*
  roundabout way to figure out if a draft has already been saved
  we want to know this because if it already has we do NOT want to
  delete it if they say no to _onLeft message and instead want to
  merely revert the values
  */
  isSavedDraft = () => {
    return this.state.originalStory &&
      this.state.originalStory.id &&
      this.state.originalStory.id === this.props.story.id
  }

  _onLeftYes = () => {
    if (!this.isValid() && this.isPhotoType()) {
      this.setState({
        error: 'Please add a cover and a title to continue',
        activeModal: undefined,
      })
    } else {
      this.saveStory().then(() => {
        this.navBack()
      })
    }
  }

  _onLeftNo = () => {
    if (!this.isSavedDraft()) {
      this.props.discardDraft(this.props.story.id)
    } else {
      this.props.update(this.props.story.id, this.state.originalStory, true)
    }
    this.navBack()
  }

  _onLeft = () => {
    if (!this.isPhotoType()) {
      const isDraft = this.props.story.draft === true
      const title = isDraft ? 'Save Draft' : 'Save Edits'
      const message = this.isSavedDraft() ? 'Do you want to save these edits before you go?' : 'Do you want to save this story draft before you go?'

      // When a user cancels the draft flow, remove the draft
      Alert.alert(
        title,
        message,
        [{
          text: 'Yes',
          onPress: () => {
            if (!this.isValid() && this.isPhotoType()) {
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
            if (!this.isSavedDraft()) {
              this.props.discardDraft(this.props.story.id)
            } else {
              this.props.update(this.props.story.id, this.state.originalStory, true)
            }
            this.navBack()
          }
        }]
      )
    }
    else this.setState({activeModal: 'cancel'})
  }

  closeModal = () => {
    this.setState({ activeModal: undefined})
  }

  renderCancel = () => {
    const isDraft = this.props.story.draft === true
    const title = isDraft ? 'Save Draft' : 'Save Edits'
    const message = this.isSavedDraft() ? 'Do you want to save these edits before you go?' : 'Do you want to save this story draft before you go?'
    return (
      <Modal
        closeModal={this.closeModal}
        modalStyle={modalWrapperStyles}
      >
        <Text style={styles.modalTitle}>{title}</Text>
        <Text style={styles.modalMessage}>{message}</Text>
        <View style={styles.modalBtnWrapper}>
          <TouchableOpacity
            style={[styles.modalBtn, styles.modalBtnLeft]}
            onPress={this._onLeftYes}
          >
            <Text style={styles.modalBtnText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalBtn}
            onPress={this._onLeftNo}
          >
            <Text style={styles.modalBtnText}>No</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }

  _onTitle = () => {
    const title = 'Save Progess'
    const message = 'Do you want to save your progress?'
    if (!this.isValid()) {
      this.setState({error: 'Please add a cover and a title to continue'})
      return
    }
    Alert.alert(
      title,
      message,
      [{
        text: 'Yes',
        onPress: () => {
          if (!this.isValid() && this.isPhotoType()) {
            this.setState({error: 'Please add a cover and a title to save'})
          } else {
            this.saveStory()
          }
        }
      }, {
        text: 'Cancel',
        onPress: () => null
      }]
    )
  }

  isValid() {
    return _.every([
      !!this.state.coverImage || !!this.state.coverVideo,
      !!_.trim(this.state.title)
    ])
  }

  navBack() {
    this.props.dispatch(StoryEditActions.resetCreateStore())
    if (this.props.navigatedFromProfile) {
      NavActions.tabbar({type: 'reset'})
      NavActions.profile()
    } else {
      NavActions.tabbar({type: 'reset'})
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
    return !!this.state.coverVideo && this.state.coverVideo !== getVideoUrl(this.props.story.coverVideo)
  }

  // TODO
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
      this.saveStory()
        .then(() => {
          this.nextScreen()
        })
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
        this.nextScreen()
      })
  }

  nextScreen() {
    NavActions.createStory_details()
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

      if (this.isPhotoType()) {
        story.draftjsContent = this.editor.getEditorStateAsObject()
      }

      this.props.update(story.id, story)

      this.setState({
        file: null,
        updating: false,
        coverImage: story.coverImage ? getImageUrl(story.coverImage) : null,
        coverVideo: story.coverVideo ? getVideoUrl(story.coverVideo) : null,
        originalStory: story
      })
    })
    .catch((err) => {
      this.saveFailed()
      return Promise.reject(err)
    })
  }

  saveFailed = () => {
    this.setState({
      updating: false,
      imageUploading: false,
      videoUploading: false,
      activeModal: 'saveFail',
    })
  }

  renderFailModal = () => {
    return (
      <Modal
        closeModal={this.closeModal}
        modalStyle={modalWrapperStyles}
      >
        <Text style={styles.modalTitle}>Save Error</Text>
        <Text style={[styles.modalMessage, styles.failModalMessage]}>We experienced an error while trying to save your story. Please try again</Text>
      </Modal>
    )
  }

  hasNoPhoto() {
    return !this.state.coverImage
  }

  hasNoVideo() {
    return !this.state.coverVideo
  }

  hasNoCover() {
    return this.hasNoPhoto() && this.hasNoVideo()
  }

  getIcon() {
    return this.isPhotoType() ? 'camera' : 'video-camera'
  }

  _contentAddCover = () => {
    this.setState({error: null})
    const mediaType = this.getMediaType()
    NavActions.mediaSelectorScreen({
      mediaType: mediaType,
      title: `Add ${mediaType === 'video' ? 'Video' : 'Image'}`,
      leftTitle: 'Cancel',
      onLeft: () => NavActions.pop(),
      rightTitle: 'Next',
      onSelectMedia: this._handleSelectCover
    })
  }

  _touchError = () => {
    this.setState({error: null})
  }

  setTitleHeight = (event) => {
    this.setState({titleHeight: event.nativeEvent.contentSize.height})
  }

  setTitle = (title) => {
    this.setState({title})
  }

  setDescription = (description) => {
    this.setState({description})
  }

  renderContent () {
    const icon = this.getIcon()
    // offset so that the buttons are visible when the keyboard + toolbar are open
    const buttonsOffset = (this.toolbar && this.state.toolbarDisplay) ? {top: 75} : null
    return (
      <View style={this.hasNoCover() ? styles.lightGreyAreasBG : null}>
        {this.hasNoCover() && <View style={styles.spaceView} />}
        {this.hasNoCover() &&
          <View style={[styles.spaceView, styles.addPhotoView]}>
            <TouchableOpacity
              style={[styles.addPhotoButton, buttonsOffset]}
              onPress={this._contentAddCover}
            >
              <TabIcon name={icon} style={{
                view: styles.cameraIcon,
                image: icon === 'camera' ? styles.cameraIconImage : styles.videoIconImage,
              }} />
              <Text style={this.renderTextColor([styles.baseTextColor, styles.coverPhotoText])}>
                {this.isPhotoType() ? '+ ADD COVER PHOTO' : '+ ADD COVER VIDEO'}
              </Text>
            </TouchableOpacity>
          </View>
        }
        {!this.hasNoCover() && !this.state.imageMenuOpen &&
          <TouchableWithoutFeedback onPress={this._toggleImageMenu}>
            <View>
              <View style={styles.spaceView} />
              <View style={styles.spaceView} />
            </View>
          </TouchableWithoutFeedback>
        }
        {!this.hasNoCover() && this.state.imageMenuOpen &&
          <View>
            <TouchableWithoutFeedback onPress={this._toggleImageMenu}>
              <View>
                <View style={styles.spaceView} />
                <Animated.View style={[
                  styles.imageMenuView,
                  {opacity: this.state.toolbarOpacity}
                ]}>
                  <TouchableOpacity
                    onPress={this._touchChangeCover}
                    style={[styles.iconButton, buttonsOffset]}>
                    <Icon name={icon} color={Colors.snow} size={30} />
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        }
        <View style={styles.addTitleView}>
          <TextInput
            style={[
              this.renderTextColor(styles.titleInput),
              {height: this.state.titleHeight},
            ]}
            placeholder='ADD A TITLE'
            placeholderTextColor={this.renderPlaceholderColor(Colors.background)}
            value={this.state.title}
            onChangeText={this.setTitle}
            returnKeyType='done'
            maxLength={40}
            multiline={true}
            blurOnSubmit
            onContentSizeChange={this.setTitleHeight}
          />
          <TextInput
            style={this.renderTextColor(styles.subTitleInput)}
            placeholder='Add a subtitle'
            placeholderTextColor={this.renderPlaceholderColor(Colors.background)}
            onChangeText={this.setDescription}
            value={this.state.description}
            returnKeyType='done'
            maxLength={50}
          />
        </View>
      </View>
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
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Icon name='camera' size={18} />
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

  handlePressAddImage = () => {
    NavActions.mediaSelectorScreen({
      type: 'push',
      mediaType: 'photo',
      title: 'Add Image',
      leftTitle: 'Cancel',
      onLeft: () => {
        NavActions.pop()
      },
      rightTitle: 'Next',
      onSelectMedia: this.handleAddImage
    })
  }

  handlePressAddVideo = () => {
    NavActions.mediaSelectorScreen({
      type: 'push',
      mediaType: 'video',
      title: 'Add Video',
      leftTitle: 'Cancel',
      onLeft: () => {
        NavActions.pop()
      },
      rightTitle: 'Next',
      onSelectMedia: this.handleAddVideo
    })
  }

  handleAddImage = (data) => {
    this.setState({imageUploading: true})
    api.uploadStoryImage(this.props.story.id, pathAsFileObject(data))
      .then(({data: imageUpload}) => {
        this.editor.insertImage(_.get(imageUpload, 'original.path'))
        this.setState({imageUploading: false})
      })
      .catch(this.saveFailed)
    NavActions.pop()
  }

  handleAddVideo = (data) => {
    this.setState({videoUploading: true})
    api.uploadStoryVideo(this.props.story.id, pathAsFileObject(data))
      .then(({data: videoUpload}) => {
        this.editor.insertVideo(_.get(videoUpload, 'original.path'))
        this.setState({videoUploading: false})
      })
      .catch(this.saveFailed)
    NavActions.pop()
  }

  setToolbarDisplay = (toolbarDisplay) => {
    if (this.toolbar && this.state.toolbarDisplay !== toolbarDisplay) {
      this.setState({toolbarDisplay})
    }
  }

  renderEditor() {
    return (
      <View style={[styles.editor]}>
        <Editor
          ref={i => this.editor = i}
          style={{
            flex: 1,
            minWidth: Metrics.screenWidth
          }}
          onPressImage={this.handlePressAddImage}
          onPressVideo={this.handlePressAddVideo}
          customStyleMap={customStyles}
          setToolbarDisplay={this.setToolbarDisplay}
          {...this.getContent()}
        />
      </View>
    )
  }

  YOffset = 0
  // getting rough YOffset
  onScroll = (event) => {
    // rounding offset to within 10
    const newYOffset = (event.nativeEvent.contentOffset.y/10).toFixed()*10
    if (newYOffset !== this.YOffset) {
      this.YOffset = event.nativeEvent.contentOffset.y
    }
  }

  // this gets triggered when an Editor's block size changes
  onContentSizeChange = (contentWidth, contentHeight) => {
    const diff = contentHeight - this.contentHeight
    if (this.scrollViewRef) {
      this.scrollViewRef.scrollTo({x:0, y: this.YOffset + diff, amimated: true})
    }
    this.contentHeight = contentHeight
  }

  render () {
    let showTooltip = false;
    if (this.props.user && this.state.file) {
      showTooltip = !isTooltipComplete(
        TooltipTypes.STORY_PHOTO_EDIT,
        this.props.user.introTooltips
      )
    }
    if (this.scrollViewRef && this.state.isScrollDown) {
      this.setState({isScrollDown: false})
      this.scrollViewRef.scrollTo({x: 0, y: 200, animated: true})
    }
    return (
      <View style={styles.root}>
        <ScrollView
          ref={i => this.scrollViewRef = i}
          keyboardShouldPersistTaps='handled'
          stickyHeaderIndices={[0]}
          onScroll={this.onScroll}
          scrollEventThrottle={16}
          onContentSizeChange={this.onContentSizeChange}
          bounces={false}
        >
          <NavBar
            title='Save'
            onTitle={this._onTitle}
            onLeft={this._onLeft}
            leftTitle='Cancel'
            onRight={this._onRight}
            rightIcon={'arrowRightRed'}
            isRightValid={this.isValid()}
            rightTitle='Next'
            rightTextStyle={{
              paddingRight: 10,
            }}
          />
          <KeyboardAvoidingView behavior='position'>
            <View style={this.isPhotoType() ? styles.coverWrapper : styles.videoCoverWrapper}>
              {this.state.error &&
                <ShadowButton
                  style={styles.errorButton}
                  onPress={this._touchError}
                  text={this.state.error} />
              }
              {this.isPhotoType() && this.renderCoverPhoto(this.state.coverImage)}
              {!this.isPhotoType() && this.renderCoverVideo(this.state.coverVideo)}
            </View>
            {this.isPhotoType() &&
              <View style={styles.editorWrapper}>
                <View style={styles.angleDownIcon}>
                  <Icon name='angle-down' size={20} color='#9e9e9e' />
                </View>
                {this.renderEditor()}
              </View>
            }
          {showTooltip && this.renderTooltip()}
          {this.isPhotoType() && <View style={styles.toolbarAvoiding}></View>}
          </KeyboardAvoidingView>
        </ScrollView>
        {this.isPhotoType() && this.editor &&
          <KeyboardTrackingView
            style={styles.trackingToolbarContainer}
            trackInteractive={true}
          >
            <Toolbar
              ref={i => this.toolbar = i}
              display={this.state.toolbarDisplay}
              onPress={this.editor.onToolbarPress}
            />
          </KeyboardTrackingView>
        }
        {this.state.activeModal === 'cancel' && this.renderCancel()}
        {this.state.activeModal === 'saveFail' && this.renderFailModal()}
        {this.isUploading() &&
          <Loader
            style={styles.loading}
            text={this.state.imageUploading ? 'Saving image...' : 'Saving video...'}
            textStyle={styles.loadingText}
            tintColor='rgba(0,0,0,.9)' />
        }
        {this.state.updating &&
          <Loader
            style={styles.loading}
            text='Saving progress...'
            textStyle={styles.loaderText}
            tintColor='rgba(0,0,0,.9)' />
        }
      </View>
    )
  }

  _handleSelectCover = (path) => {
    const file = pathAsFileObject(path)
    const updatedState = {file}
    if (this.isPhotoType()) {
      updatedState.isScrollDown = true
      updatedState.coverImage = path
    } else {
      updatedState.coverVideo = path
    }
    this.setState(updatedState, () => {
      NavActions.pop()
    })
  }
}

export default connect((state, props) => {
  let story
  /*
  go over logic to see if we can refactor.
  I believe we can make it so that all new drafts have shouldLoadStory true
  or some other such boolean.
  If we are editing a story that means we are coming in through the profile page
  that means we already have the story loaded so it should be entities.
  This existing logic needs more clarity
  */
  if (props.shouldLoadStory) {
    story = state.storyCreate.draft
  }
  else if (state.entities.stories.entities[props.storyId]) {
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
