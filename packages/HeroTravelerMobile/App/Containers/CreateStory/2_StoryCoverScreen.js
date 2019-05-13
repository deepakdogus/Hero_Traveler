import _ from 'lodash'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  TouchableOpacity,
  View,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import Immutable from 'seamless-immutable'

import {styles as StoryReadingScreenStyles} from '../Styles/StoryReadingScreenStyles'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import ShadowButton from '../../Components/ShadowButton'
import Loader from '../../Components/Loader'
import {Colors, Metrics} from '../../Shared/Themes'
import styles, {customStyles, modalWrapperStyles} from './2_StoryCoverScreenStyles'
import NavBar from './NavBar'
import getRelativeHeight, {extractCoverMetrics} from '../../Shared/Lib/getRelativeHeight'
import isTooltipComplete, {Types as TooltipTypes} from '../../Shared/Lib/firstTimeTooltips'
import { getPendingDraftById } from '../../Shared/Lib/getPendingDrafts'
import isLocalDraft from '../../Shared/Lib/isLocalDraft'
import {trimVideo} from '../../Shared/Lib/mediaHelpers'
import UserActions from '../../Shared/Redux/Entities/Users'
import Modal from '../../Components/Modal'
import Tooltip from '../../Components/Tooltip'
import EditableCoverMedia from '../../Components/EditableCoverMedia'

import NativeEditor from '../../Components/NativeEditor/Editor'
import Toolbar from '../../Components/NativeEditor/Toolbar'
import {KeyboardTrackingView} from 'react-native-keyboard-tracking-view'

import {
  isFieldSame,
  haveFieldsChanged,
  hasChangedSinceSave,
} from '../../Shared/Lib/draftChangedHelpers'

const MediaTypes = {
  video: 'video',
  photo: 'photo',
}

/*
Utility functions
*/

class StoryCoverScreen extends Component {
  static propTypes = {
    mediaType: PropTypes.oneOf([MediaTypes.video, MediaTypes.photo]),
    user: PropTypes.object,
    story: PropTypes.object,
    storyId: PropTypes.string,
    pendingUpdate: PropTypes.object,
    navigatedFromProfile: PropTypes.bool,
    shouldLoadStory: PropTypes.bool,
    update: PropTypes.func,
    discardDraft: PropTypes.func,
    completeTooltip: PropTypes.func,
    resetCreateStore: PropTypes.func,
    workingDraft: PropTypes.object,
    originalDraft: PropTypes.object,
    updateWorkingDraft: PropTypes.func,
    saveDraft: PropTypes.func,
    error: PropTypes.string,
    draftToBeSaved: PropTypes.object,
    setWorkingDraft: PropTypes.func,
    draftIdToDBId: PropTypes.object,
  }

  static defaultProps = {
    mediaType: MediaTypes.photo,
    navigatedFromProfile: false,
    shouldLoadStory: true,
  }

  constructor(props) {
    super(props)
    this.timeout = null

    const hasPendingUpdate = props.pendingUpdate && !isLocalDraft(props.storyId)

    this.state = {
      file: null,
      updating: false,
      originalStory: props.workingDraft,
      imageUploading: false,
      videoUploading: false,
      isScrollDown: !!props.workingDraft.coverImage | !!props.workingDraft.coverVideo,
      titleHeight: 37,
      activeModal: hasPendingUpdate ? 'existingUpdateWarning' : undefined,
      toolbarDisplay: false,
      contentTouched: false,
      coverMetrics: {},
    }
  }

  isUploading() {
    return this.state.imageUploading || this.state.videoUploading
  }

  getContent() {
    if (_.keys(this.props.workingDraft.draftjsContent).length) {
      const content = Immutable.asMutable(this.props.workingDraft.draftjsContent, {deep: true})
      if (!content.entityMap) content.entityMap = {}
      return {value: content}
    }
    else {
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

  onTrimError = () => {
    this.setState({
      error: 'There\'s an issue with the video you selected. Please try another.',
    })
  }

  /*
  roundabout way to figure out if a draft has already been saved
  we want to know this because if it already has we do NOT want to
  delete it if they say no to _onLeft message and instead want to
  merely revert the values
  */
  isSavedDraft = () => {
    return this.props.originalDraft
      && this.props.originalDraft.id
      && this.props.originalDraft.id === this.props.workingDraft.id
  }

  _onLeftYes = () => {
    if (!this.isValid()) {
      this.setState({
        validationError: 'Please add a cover and title to continue',
        activeModal: undefined,
      })
    }
    else {
      this.saveStory().then(() => {
        this.navBack()
      })
    }
  }

  _onLeftNo = () => {
    if (!this.isSavedDraft()) {
      this.props.discardDraft(this.props.workingDraft.id)
    }
    else {
      this.props.resetCreateStore()
    }
    this.navBack()
  }

  _onLeft = () => {
    const {workingDraft, originalDraft, draftToBeSaved} = this.props
    const cleanedDraft = this.cleanDraft(workingDraft)
    if (
      haveFieldsChanged(cleanedDraft, originalDraft)
      || hasChangedSinceSave(cleanedDraft, draftToBeSaved)
    ) {
      this.setState({ activeModal: 'cancel' })
    }
    else {
      // If there are no changes, just close without opening the modal
      this._onLeftNo()
    }
  }

  closeModal = () => {
    this.setState({ activeModal: undefined})
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

  renderExistingUpdateModal = () => {
    const customizedModalWrapperStyles = {
      ...modalWrapperStyles,
      height: 165,
    }
    return (
      <Modal
        closeModal={this.closeModal}
        modalStyle={customizedModalWrapperStyles}
      >
        <Text style={styles.modalTitle}>You have an existing edit to this story.</Text>
        <Text style={styles.modalMessage}>Do you want to discard these changes or continue from your last edit?</Text>
        <View style={styles.modalBtnWrapper}>
          <TouchableOpacity
            style={[styles.modalBtn, styles.modalBtnLeft]}
            onPress={this.closeModal}
          >
            <Text style={styles.modalBtnText}>Discard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalBtn}
            onPress={this._setWorkingDraft}
          >
            <Text style={styles.modalBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }

  _setWorkingDraft = () => {
    this.props.setWorkingDraft(this.props.pendingUpdate)
    this.closeModal()
  }

  _onTitle = () => {
    if (!this.isValid()) {
      this.setState({validationError: 'Please add a cover and title to continue'})
      return
    }
    this.saveStory()
  }

  isValid() {
    const {coverImage, coverVideo, title} = this.props.workingDraft
    return _.every([
      !!coverImage || !!coverVideo,
      !!_.trim(title),
    ])
  }

  navBack = () => {
    this.props.resetCreateStore()
    if (this.props.navigatedFromProfile) {
      NavActions.tabbar({type: 'reset'})
      NavActions.profile()
    }
    else {
      NavActions.tabbar({type: 'reset'})
    }
  }

  _onRight = () => {
    const {workingDraft, originalDraft} = this.props
    const hasVideoSelected = !!this.state.coverVideo
    const hasImageSelected = !!this.state.coverImage
    const isImageSame = isFieldSame('coverImage', workingDraft, originalDraft)
    const isVideoSame = isFieldSame('coverVideo', workingDraft, originalDraft)
    const isTitleSame = isFieldSame('title', workingDraft, originalDraft)
    const isDescriptionSame = isFieldSame('description', workingDraft, originalDraft)
    const isCoverCaptionSame = isFieldSame('coverCaption', workingDraft, originalDraft)
    const nothingHasChanged = _.every([
      hasVideoSelected || hasImageSelected,
      isImageSame,
      isVideoSame,
      isTitleSame,
      isDescriptionSame,
      isCoverCaptionSame,
    ])
    // If nothing has changed, let the user go forward if they navigated back
    if (nothingHasChanged) {
      this.softSaveDraft()
        .then(() => {
          this.nextScreen()
        })
    }
    if (!this.isValid()) {
      this.setState({validationError: 'Please add a cover and title to continue'})
      return
    }
    if (
      (hasImageSelected || hasVideoSelected)
      && (isVideoSame || isImageSame)
      && !this.state.file
    ) {
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

  cleanDraft(){
    const {workingDraft, originalDraft, draftIdToDBId} = this.props
    const draft = _.merge({}, workingDraft)
    if (!isFieldSame('title', workingDraft, originalDraft)) draft.title = _.trim(draft.title)
    if (!isFieldSame('description', workingDraft, originalDraft)) draft.description = _.trim(draft.description)
    if (!isFieldSame('coverCaption', workingDraft, originalDraft)) draft.coverCaption = _.trim(draft.coverCaption)
    if (draftIdToDBId[workingDraft.id]) draft.id = draftIdToDBId[workingDraft.id]
    draft.draftjsContent = this.editor.getEditorStateAsObject()
    return draft
  }

  // this only saves it at the redux level
  softSaveDraft() {
    const cleanedDraft = this.cleanDraft()
    return Promise.resolve(this.props.updateWorkingDraft(cleanedDraft))
  }

  // this does a create or update depending on whether it is a local draft
  saveStory() {
    const cleanedDraft = this.cleanDraft()

    if (isLocalDraft(cleanedDraft.id)) {
      this.props.saveDraft(cleanedDraft, true)
    }
    else this.props.update(cleanedDraft.id, cleanedDraft)
    return Promise.resolve({})
  }

  renderFailModal = () => {
    const {activeModal} = this.state
    let renderProps
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
        { renderProps.renderButtton && (
          <TouchableOpacity
            style={styles.modalBtn}
            onPress={renderProps.closeModal}
          >
            <Text style={styles.modalBtnText}>Close</Text>
          </TouchableOpacity>
        )}
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

  clearError = () => {
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
    this.scrollViewRef.scrollTo({x:0, y: this._getCoverHeight() - 30, amimated: true})
  }

  _completeIntroTooltip = () => {
    const tooltips = this.props.user.introTooltips.concat({
      name: TooltipTypes.STORY_PHOTO_EDIT,
      seen: true,
    })
    this.props.completeTooltip(tooltips)
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
      onSelectMedia: this.handleAddImage,
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
      onSelectMedia: this.handleAddVideo,
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
    trimVideo(data, callback, this.props.workingDraft.id, this)
  }

  setHasFocus = (toolbarDisplay) => {
    if (this.toolbar && this.state.toolbarDisplay !== toolbarDisplay) {
      this.setState({toolbarDisplay})
    }
  }

  setBlockType = (blockType) => {
    if (this.toolbar && blockType) {
      this.toolbar.setBlockType(blockType)
    }
  }

  reportContentTouched = () => {
    this.setState({
      contentTouched: true,
    })
  }

  setEditorRef = (ref) => this.editor = ref
  setScrollViewRef = (ref) => this.scrollViewRef = ref
  setToolbarRef = (ref) => this.toolbar = ref

  renderEditor() {
    return (
      <View style={[styles.editor]}>
        {
          <NativeEditor
            ref={this.setEditorRef}
            style={{
              flex: 1,
              minWidth: Metrics.screenWidth,
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
    const newYOffset = (event.nativeEvent.contentOffset.y / 10).toFixed() * 10
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
      this.scrollViewRef.scrollTo({
        x:0,
        y: Math.max(this.YOffset + diff, 5),
        amimated: true,
      })
    }
    this.contentHeight = contentHeight
  }

  hasNoDraft(){
    return !this.props.workingDraft || !this.props.workingDraft.id
  }

  _getCoverHeight() {
    const { coverImage, coverVideo } = this.props.workingDraft
    const cover = coverImage || coverVideo

    if (cover) {
      return Math.min(
        Metrics.storyCover.fullScreen.height,
        getRelativeHeight(Metrics.screenWidth, extractCoverMetrics(cover)),
      )
    }

    return Metrics.storyCover.fullScreen.height
  }

  _getCoverStyle () {
    return {
      height: this._getCoverHeight(),
    }
  }

  _dismissTooltip = () => {
    this.setState({validationError: null})
  }

  render () {
    const {error, validationError} = this.state
    const {
      title, coverCaption, description,
      coverImage, coverVideo, id,
    } = this.props.workingDraft
    const {updateWorkingDraft} = this.props

    let showIntroTooltip = false
    if (this.props.user && (coverImage || coverVideo)) {
      showIntroTooltip = !isTooltipComplete(
        TooltipTypes.STORY_PHOTO_EDIT,
        this.props.user.introTooltips,
      )
    }

    return (
      <View style={styles.root}>
        <ScrollView
          ref={this.setScrollViewRef}
          keyboardShouldPersistTaps='handled'
          stickyHeaderIndices={[0]}
          onScroll={this.onScroll}
          scrollEventThrottle={16}
          onContentSizeChange={this.onContentSizeChange}
          bounces={false}
        >
          <NavBar
            title='SAVE'
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
          <View style={this._getCoverStyle()}>
            {error && (
              <ShadowButton
                style={styles.errorButton}
                onPress={this.clearError}
                text={error}
              />
            )}
            <EditableCoverMedia
              isPhoto={this.isPhotoType()}
              media={coverImage || coverVideo}
              clearError={this.clearError}
              targetId={id}
              onUpdate={updateWorkingDraft}
              onTrimError={this.onTrimError}
              jumpToTop={this.jumpToTop}
            />
          </View>
          <View style={styles.titlesWrapper}>
            {!this.hasNoCover() && (
              <TextInput
                style={[StoryReadingScreenStyles.caption, styles.coverCaption]}
                placeholder='Add a caption...'
                value={coverCaption}
                onChangeText={this.setCoverCaption}
                returnKeyType='done'
                blurOnSubmit
              />
            )}
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
          {<View style={styles.toolbarAvoiding}></View>}
        </ScrollView>
        {showIntroTooltip && (
          <Tooltip
            type='image-edit'
            onDismiss={this._completeIntroTooltip}
            dimBackground={true}
          />
        )}
        {this.editor && (
          <KeyboardTrackingView
            style={styles.trackingToolbarContainer}
            trackInteractive={true}
          >
            {
              <Toolbar
                ref={this.setToolbarRef}
                display={this.state.toolbarDisplay}
                onPress={this.editor.onToolbarPress}
              />
            }
          </KeyboardTrackingView>
        )}
        {this.state.activeModal === 'cancel' && this.renderCancel()}
        {this.state.activeModal === 'saveFail' || (this.hasNoDraft() && !!this.props.error)
          && this.renderFailModal()
        }
        {this.state.activeModal === 'existingUpdateWarning' && (
          this.renderExistingUpdateModal()
        )}
        {this.isUploading() && (
          <Loader
            style={styles.loading}
            text={this.state.imageUploading ? 'Saving image...' : 'Saving video...'}
            textStyle={styles.loadingText}
            tintColor='rgba(0,0,0,.9)' />
        )}
        {this.state.updating && (
          <Loader
            style={styles.loading}
            text='Saving progress...'
            textStyle={styles.loaderText}
            tintColor='rgba(0,0,0,.9)' />
        )}
        {this.hasNoDraft() && !this.props.error && (
          <Loader
            style={styles.loading}
            text='Initializing Draft'
            textStyle={styles.loaderText}
            tintColor='rgba(0,0,0,.9)' />
        )}
        {validationError && (
          <Tooltip
            onPress={this.clearError}
            position='title'
            text={validationError}
            onDismiss={this._dismissTooltip}
          />
        )}
      </View>
    )
  }
}

export default connect((state) => {
  const originalDraft = {...state.storyCreate.draft}
  return {
    user: state.entities.users.entities[state.session.userId],
    originalDraft,
    workingDraft: {...state.storyCreate.workingDraft},
    pendingUpdate: getPendingDraftById(state, originalDraft.id),
    draftToBeSaved: {...state.storyCreate.draftToBeSaved},
    error: state.storyCreate.error || '',
    draftIdToDBId: state.storyCreate.draftIdToDBId,
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
  saveDraft: (draft, saveAsDraft) => dispatch(StoryCreateActions.saveLocalDraft(draft, saveAsDraft)),
  setWorkingDraft: (story) => dispatch(StoryCreateActions.editStorySuccess(story)),
}),
)(StoryCoverScreen)
