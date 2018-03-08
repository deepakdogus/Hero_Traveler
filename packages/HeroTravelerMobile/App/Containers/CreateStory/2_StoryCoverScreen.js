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
  Alert,
  TextInput,
  ScrollView,
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import R from 'ramda'
import Icon from 'react-native-vector-icons/FontAwesome'
import Immutable from 'seamless-immutable'

import API from '../../Shared/Services/HeroAPI'
import {styles as StoryReadingScreenStyles} from '../Styles/StoryReadingScreenStyles'
import StoryActions from '../../Shared/Redux/Entities/Stories'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import ShadowButton from '../../Components/ShadowButton'
import Loader from '../../Components/Loader'
import {Colors, Metrics} from '../../Shared/Themes'
import styles, {customStyles, modalWrapperStyles, coverHeight} from './2_StoryCoverScreenStyles'
import NavBar from './NavBar'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import getVideoUrl from '../../Shared/Lib/getVideoUrl'
import ImageWrapper from '../../Components/ImageWrapper'
import VideoPlayer from '../../Components/VideoPlayer'
import pathAsFileObject from '../../Shared/Lib/pathAsFileObject'
import isTooltipComplete, {Types as TooltipTypes} from '../../Shared/Lib/firstTimeTooltips'
import RoundedButton from '../../Components/RoundedButton'
import UserActions from '../../Shared/Redux/Entities/Users'
import TabIcon from '../../Components/TabIcon'
import Modal from '../../Components/Modal'

import NativeEditor from '../../Components/NativeEditor/Editor'
import Toolbar from '../../Components/NativeEditor/Toolbar'
import {KeyboardTrackingView} from 'react-native-keyboard-tracking-view';
import { ProcessingManager } from 'react-native-video-processing'

const api = API.create()

const MediaTypes = {
  video: 'video',
  photo: 'photo',
}

/*

Utility functions

*/

const isEqual = (firstItem, secondItem) => {
  if (!!firstItem && !secondItem || !firstItem && !!secondItem) {
    return false
  } else if (!!firstItem && !!secondItem) {
    // lodash will take of equality check for all objects
    return _.isEqual(firstItem, secondItem)
  } else {
    return true
  }
}

const extractUploadData = (uploadData) => {
  const url = _.get(uploadData, 'original.path')
  const height = _.get(uploadData, 'original.meta.height')
  const width = _.get(uploadData, 'original.meta.width')
  return [url, height, width]
}

async function trimVideo(videoFile, callback, _this){
  try {
    let newSource = videoFile
    const { duration } = await ProcessingManager.getVideoInfo(videoFile)
    if (duration > 60) {
      newSource = await ProcessingManager.trim(videoFile, { startTime: 0, endTime: 60 })
    }
    callback(newSource)
  } catch(e) {
      console.log('Issue trimming video')
      _this.setState({error: 'There\'s an issue with the video you selected. Please try another.'})
      NavActions.pop()
      // jump to top to reveal error message
      _this.jumpToTop()
  }
}


class StoryCoverScreen extends Component {

  static propTypes = {
    mediaType: PropTypes.oneOf([MediaTypes.video, MediaTypes.photo]),
    accessToken: PropTypes.object,
    user: PropTypes.object,
    story: PropTypes.object,
    storyId: PropTypes.string,
    navigatedFromProfile: PropTypes.bool,
    shouldLoadStory: PropTypes.bool,
    update: PropTypes.func,
    discardDraft: PropTypes.func,
    completeTooltip: PropTypes.func,
    resetCreateStore: PropTypes.func,
    workingDraft: PropTypes.object,
    originalDraft: PropTypes.object,
  }

  static defaultProps = {
    mediaType: MediaTypes.photo,
    navigatedFromProfile: false,
    shouldLoadStory: true,
  }

  constructor(props) {
    super(props)
    this.timeout = null

    this.state = {
      imageMenuOpen: false,
      file: null,
      updating: false,
      originalStory: props.workingDraft,
      toolbarOpacity: new Animated.Value(1),
      imageUploading: false,
      videoUploading: false,
      isScrollDown: !!props.workingDraft.coverImage | !!props.workingDraft.coverVideo,
      titleHeight: 37,
      activeModal: undefined,
      toolbarDisplay: false,
      contentTouched: false,
    }
  }

  componentWillMount() {
    api.setAuth(this.props.accessToken.value)
  }

  isUploading() {
    return this.state.imageUploading || this.state.videoUploading
  }

  getContent() {
    if (_.keys(this.props.workingDraft.draftjsContent).length) {
      const content = Immutable.asMutable(this.props.workingDraft.draftjsContent, {deep: true})
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
    if (this.props.workingDraft.coverVideo) {
      return MediaTypes.video
    }
    else return MediaTypes.photo
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

  _touchChangeCover = () => {
    this.setState({imageMenuOpen: false}, () => {
      this.resetAnimation()
    })
    NavActions.mediaSelectorScreen({
      title: 'Change Cover',
      leftTitle: 'Cancel',
      onLeft: () => NavActions.pop(),
      rightTitle: 'Update',
      onSelectMedia: this._handleSelectCover
    })
  }

  renderCoverPhoto(coverPhoto) {
    if (coverPhoto) coverPhoto = getImageUrl(coverPhoto, 'basic')

    return R.ifElse(
      R.identity,
      R.always((
        <ImageWrapper
          background={true}
          source={{uri: coverPhoto}}
          style={styles.coverPhoto}
          resizeMode='cover'
        >
          <View
            style={{flex: 1}}
          >
            {this.renderContent()}
          </View>
        </ImageWrapper>
      )),
      R.always(this.renderContent(coverPhoto))
    )(!!coverPhoto)
  }

  renderCoverVideo(coverVideo) {
    if (coverVideo) coverVideo = getVideoUrl(coverVideo)
    return R.ifElse(
      R.identity,
      R.always((
        <View style={styles.coverVideo}>
          <VideoPlayer
            path={coverVideo}
            allowVideoPlay={false}
            autoPlayVideo={false}
            showPlayButton={false}
            resizeMode='cover'
          />
          {this.renderContent()}
        </View>
      )),
      R.always(this.renderContent())
    )(!!coverVideo)
  }

  renderTextColor = (baseStyle) => {
    this.props.workingDraft.coverImage
    return R.ifElse(
      R.identity,
      R.always([baseStyle, { color: Colors.snow }]),
      R.always(baseStyle),
    )(!!(this.props.workingDraft.coverImage || this.props.workingDraft.coverImage))
  }

  renderPlaceholderColor = (baseColor) => {
    return R.ifElse(
      R.identity,
      R.always('white'),
      R.always(baseColor)
    )(!!(this.props.workingDraft.coverImage || this.props.workingDraft.coverImage))
  }

  /*
  roundabout way to figure out if a draft has already been saved
  we want to know this because if it already has we do NOT want to
  delete it if they say no to _onLeft message and instead want to
  merely revert the values
  */
  isSavedDraft = () => {
    return this.props.originalDraft &&
      this.props.originalDraft.id &&
      this.props.originalDraft.id === this.props.workingDraft.id
  }

  _onLeftYes = () => {
    if (!this.isValid()) {
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
      this.props.discardDraft(this.props.workingDraft.id)
    } else {
      this.props.resetCreateStore()
    }
    this.navBack()
  }

  _onLeft = () => {
    if (this.draftHasChanged()){
      this.setState({ activeModal: 'cancel' })
    } else {
      // If there are no changes, just close without opening the modal
      this._onLeftNo()
    }
  }

  closeModal = () => {
    this.setState({ activeModal: undefined})
  }


  hasFieldChanged(field) {
    return !isEqual(this.props.workingDraft[field], this.props.originalDraft[field])
  }

  draftHasChanged = () => {
    const fieldsToCheck = ['title', 'description', 'coverCaption', 'coverImage', 'coverVideo', 'tripDate', 'location', 'type', 'categories']
    return !_.every([
      ...fieldsToCheck.map(field => !this.hasFieldChanged(field)),
      !this.state.contentTouched ,
    ])
  }

  renderCancel = () => {

    const isDraft = this.props.workingDraft.draft === true
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
          if (!this.isValid()) {
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
      !!this.props.workingDraft.coverImage || !!this.props.workingDraft.coverVideo,
      !!_.trim(this.props.workingDraft.title)
    ])
  }

  navBack = () => {
    this.props.dispatch(StoryCreateActions.resetCreateStore())
    if (this.props.navigatedFromProfile) {
      NavActions.tabbar({type: 'reset'})
      NavActions.profile()
    } else {
      NavActions.tabbar({type: 'reset'})
    }
  }


  // TODO
  _onRight = () => {
    const hasVideoSelected = !!this.state.coverVideo
    const hasImageSelected = !!this.state.coverImage
    const hasImageChanged = this.hasFieldChanged('coverImage')
    const hasVideoChanged = this.hasFieldChanged('coverVideo')
    const hasTitleChanged = this.hasFieldChanged('title')
    const hasDescriptionChanged = this.hasFieldChanged('description')
    const hasCoverCaptionChanged = this.hasFieldChanged('coverCaption')
    const nothingHasChanged = _.every([
      hasVideoSelected || hasImageSelected,
      !hasImageChanged,
      !hasVideoChanged,
      !hasTitleChanged,
      !hasDescriptionChanged,
      !hasCoverCaptionChanged
    ])
    // If nothing has changed, let the user go forward if they navigated back
    if (nothingHasChanged) {
      this.softSaveDraft()
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
    this.softSaveDraft()
      .then(() => {
        this.nextScreen()
      })
  }

  nextScreen() {
    NavActions.createStory_details()
  }

  cleanDraft(draft){
    if (this.hasFieldChanged('title')) draft.title = _.trim(draft.title)
    if (this.hasFieldChanged('description')) draft.description = _.trim(draft.description)
    if (this.hasFieldChanged('coverCaption')) draft.coverCaption = _.trim(draft.coverCaption)
    draft.draftjsContent = this.editor.getEditorStateAsObject()
  }

  // this only saves it at the redux level
  softSaveDraft() {
    const copy = _.merge({}, this.props.workingDraft)
    this.cleanDraft(copy)
    return Promise.resolve(this.props.updateWorkingDraft(copy))
  }

  // this does a hard save to the DB (if published) or to cache (if draft)
  saveStory() {
    const draft = this.props.workingDraft
    this.cleanDraft(draft)
    if (draft.draft) this.props.saveDraftToCache(draft)
    else this.props.update(draft.id, draft)
    return Promise.resolve({})
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
    const {activeModal} = this.state
    let renderProps;
    if (activeModal === 'saveFail') {
      renderProps = {
        closeModal: this.closeModal,
        title: 'Save Error',
        message: 'We experienced an error while trying to save your story. Please try again.',
        renderButtton: false,
      }
      modalWrapperStyles.height = 140
    }
    else {
      renderProps = {
        closeModal: this.navBack,
        title: 'Oops!',
        message: 'We were not able to create a story at this time. Please check your internet connection and try again.',
        renderButtton: true,
      }
      modalWrapperStyles.height = 160
    }
    return (
      <Modal
        closeModal={renderProps.closeModal}
        modalStyle={modalWrapperStyles}
      >
        <Text style={styles.modalTitle}>{renderProps.title}</Text>
        <Text style={[
          styles.modalMessage,
          renderProps.renderButtton ? {} : styles.failModalMessage,
        ]}>
          {renderProps.message}
        </Text>
        { renderProps.renderButtton &&
          <TouchableOpacity
            style={styles.modalBtn}
            onPress={renderProps.closeModal}
          >
            <Text style={styles.modalBtnText}>Close</Text>
          </TouchableOpacity>
        }
      </Modal>
    )
  }

  hasNoPhoto() {
    return !this.props.workingDraft.coverImage
  }

  hasNoVideo() {
    return !this.props.workingDraft.coverVideo
  }

  hasNoCover() {
    return this.hasNoPhoto() && this.hasNoVideo()
  }

  _contentAddCover = () => {
    this.setState({error: null})
    NavActions.mediaSelectorScreen({
      title: 'Add Cover',
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
    this.props.updateWorkingDraft({title})
  }


  setTitleAndFocus = (title) => {
    this.setTitle(title)
    this.jumpToTitle()
  }

  setCoverCaption = (coverCaption) => {
    this.props.updateWorkingDraft({coverCaption})
  }


  setDescription = (description) => {
    this.props.updateWorkingDraft({description})
  }

  setDescriptionAndFocus = (description) => {
    this.setDescription(description)
    this.jumpToTitle()
  }

  jumpToTop = () => {
    this.scrollViewRef.scrollTo({x:0, y: 0, amimated: true})
  }

  jumpToTitle = () => {
    this.scrollViewRef.scrollTo({x:0, y: coverHeight - 30, amimated: true})
  }

  renderContent () {
    const {imageMenuOpen, toolbarOpacity} = this.state
    return (
      <View style={this.hasNoCover() ? styles.lightGreyAreasBG : styles.contentWrapper}>
        {this.hasNoCover() &&
          <View style={[styles.addPhotoView]}>
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={this._contentAddCover}
            >
              <TabIcon name='cameraDark' style={{
                view: styles.cameraIcon,
                image: styles.cameraIconImage,
              }} />
              <Text style={this.renderTextColor([styles.baseTextColor, styles.coverPhotoText])}>
                + ADD COVER PHOTO OR VIDEO
              </Text>
            </TouchableOpacity>
          </View>
        }
        {!this.hasNoCover() && !imageMenuOpen &&
          <TouchableWithoutFeedback onPress={this._toggleImageMenu}>
            <View style={styles.coverHeight}/>
          </TouchableWithoutFeedback>
        }
        {!this.hasNoCover() && imageMenuOpen &&
            <TouchableWithoutFeedback onPress={this._toggleImageMenu}>
              <Animated.View style={[
                styles.imageMenuView,
                {opacity: toolbarOpacity}
              ]}>
                <TouchableOpacity
                  onPress={this._touchChangeCover}
                  style={styles.iconButton}
                >
                  <Icon name={'camera'} color={Colors.snow} size={30} />
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
        }
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
    this.editor.updateSelectionState({hasFocus: false})
    this.editor.insertImage(data)
    NavActions.pop()
  }

  handleAddVideo = (data) => {
    this.editor.updateSelectionState({hasFocus: false})
    const callback = (newSource) => {
      this.editor.insertVideo(newSource)
      NavActions.pop()
    }
    trimVideo(data, callback, this)
  }

  setHasFocus = (toolbarDisplay) => {
    if (this.toolbar && this.state.toolbarDisplay !== toolbarDisplay) {
      this.setState({toolbarDisplay})
    }
  }

  setBlockType = (blockType) => {
    if (this.toolbar) {
      this.toolbar.setBlockType(blockType)
    }
  }

  reportContentTouched = () => {
    this.setState({
      contentTouched: true
    })
  }

  renderEditor() {
    return (
      <View style={[styles.editor]}>
        {
          <NativeEditor
            ref={i => this.editor = i}
            style={{
              flex: 1,
              minWidth: Metrics.screenWidth
            }}
            customStyleMap={customStyles}
            onPressImage={this.handlePressAddImage}
            onPressVideo={this.handlePressAddVideo}
            storyId={this.props.workingDraft.id}
            {...this.getContent()}
            setHasFocus={this.setHasFocus}
            setBlockType={this.setBlockType}
            reportContentTouched={this.reportContentTouched}
          />
        }
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
      // adding the math.max to account for sizeChange when we add a coverPhoto that is less
      // tall than default size. This prevents scrolling to negative and displaying white
      this.scrollViewRef.scrollTo({x:0, y: Math.max(this.YOffset + diff, 5), amimated: true})
    }
    this.contentHeight = contentHeight
  }

  hasNoDraft(){
    return !this.props.workingDraft || !this.props.workingDraft.id
  }

  render () {
    const {error} = this.state
    const {
      title, coverCaption, description,
      coverImage, coverVideo
    } = this.props.workingDraft
    let showTooltip = false;
    if (this.props.user && this.state.file) {
      showTooltip = !isTooltipComplete(
        TooltipTypes.STORY_PHOTO_EDIT,
        this.props.user.introTooltips
      )
    }
    // if (this.scrollViewRef && this.state.isScrollDown) {
    //  this.setState({isScrollDown: false})
    //  this.scrollViewRef.scrollTo({x: 0, y: 0, animated: true})
    // }

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
            leftTitle='Close'
            onRight={this._onRight}
            rightIcon={'arrowRightRed'}
            isRightValid={this.isValid()}
            rightTitle='Next'
            rightTextStyle={styles.navBarRightTextStyle}
            style={styles.navBarStyle}
          />
          <KeyboardAvoidingView behavior='padding'>
            <View style={styles.coverHeight}>
              {error &&
                <ShadowButton
                  style={styles.errorButton}
                  onPress={this._touchError}
                  text={error} />
              }
              {this.isPhotoType() && this.renderCoverPhoto(coverImage)}
              {!this.isPhotoType() && this.renderCoverVideo(coverVideo)}
            </View>
            <View style={styles.titlesWrapper}>
              {!this.hasNoCover() &&
                <TextInput
                  style={[StoryReadingScreenStyles.caption, styles.coverCaption]}
                  placeholder='Add a caption...'
                  value={coverCaption}
                  onChangeText={this.setCoverCaption}
                  returnKeyType='done'
                  blurOnSubmit
                />
              }
              <TextInput
                style={[
                  styles.titleInput,
                  {height: this.state.titleHeight},
                ]}
                placeholder='Add a title'
                placeholderTextColor={Colors.background}
                value={title}
                onChangeText={this.setTitleAndFocus}
                onFocus={this.jumpToTitle}
                returnKeyType='done'
                maxLength={40}
                multiline={true}
                blurOnSubmit
                onContentSizeChange={this.setTitleHeight}
              />
              <TextInput
                style={styles.description}
                placeholder='Add a subtitle'
                placeholderTextColor={Colors.grey}
                value={description}
                onChangeText={this.setDescriptionAndFocus}
                onFocus={this.jumpToTitle}
                returnKeyType='done'
                maxLength={50}
                blurOnSubmit
              />
              <View style={styles.divider}/>
            </View>
            <View style={styles.editorWrapper}>
              {this.renderEditor()}
            </View>
          {showTooltip && this.renderTooltip()}
          {<View style={styles.toolbarAvoiding}></View>}
          </KeyboardAvoidingView>
        </ScrollView>
        {this.editor &&
          <KeyboardTrackingView
            style={styles.trackingToolbarContainer}
            trackInteractive={true}
          >
            {
            <Toolbar
              ref={i => this.toolbar = i}
              display={this.state.toolbarDisplay}
              onPress={this.editor.onToolbarPress}
            />
            }
          </KeyboardTrackingView>
        }
        {this.state.activeModal === 'cancel' && this.renderCancel()}
        {this.state.activeModal === 'saveFail' || (this.hasNoDraft() && this.props.error)
          && this.renderFailModal()
        }
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
        {this.hasNoDraft() && !this.props.error &&
          <Loader
            style={styles.loading}
            text='Initializing Draft'
            textStyle={styles.loaderText}
            tintColor='rgba(0,0,0,.9)' />
        }
      </View>
    )
  }

  _handleSelectCover = (path, isPhotoType, coverMetrics = {}) => {
    const file = pathAsFileObject(path)
    const draftUpdates = { coverCaption: '' }

    const callback = (newSource) => {
      const modifiedFile = {...file, uri: newSource }

      if (isPhotoType) {
        draftUpdates.coverImage = modifiedFile
        draftUpdates.coverVideo = undefined
      } else {
        draftUpdates.coverImage = undefined
        draftUpdates.coverVideo = modifiedFile
      }

      this.setState({
        file,
        isScrollDown: true,
      })
      this.props.updateWorkingDraft(draftUpdates)
      NavActions.pop() 
    }

    trimVideo(file.uri, callback, this)
  }
}

export default connect((state) => {
  return {
    accessToken: _.find(state.session.tokens, {type: 'access'}),
    user: state.entities.users.entities[state.session.userId],
    originalDraft: {...state.storyCreate.draft},
    workingDraft: {...state.storyCreate.workingDraft},
    error: state.storyCreate.error
  }
}, dispatch => ({
  updateWorkingDraft: (update) => dispatch(StoryCreateActions.updateWorkingDraft(update)),
  discardDraft: (draftId) =>
    dispatch(StoryCreateActions.discardDraft(draftId)),
  update: (id, attrs, doReset) =>
    dispatch(StoryCreateActions.updateDraft(id, attrs, doReset)),
  completeTooltip: (introTooltips) =>
    dispatch(UserActions.updateUser({introTooltips})),
  resetCreateStore: () => dispatch(StoryCreateActions.resetCreateStore()),
  saveDraftToCache: (draft) => dispatch(StoryActions.addDraft(draft)),
})
)(StoryCoverScreen)
