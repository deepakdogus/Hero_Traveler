import React , { Component, Fragment } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import Immutable from 'seamless-immutable'
import { ImageCrop } from 'react-native-image-cropper'
import { Actions as NavActions } from 'react-native-router-flux'

import NavBar from './NavBar'
import CameraRollPicker from '../../Components/CameraRollPicker/CameraRollPicker'
import coverScreenStyles, {modalWrapperStyles} from './2_StoryCoverScreenStyles'

import { getPendingDraftById } from '../../Shared/Lib/getPendingDrafts'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import UserActions from '../../Shared/Redux/Entities/Users'
import Modal from '../../Components/Modal'

import {
  isFieldSame,
  haveFieldsChanged,
  hasChangedSinceSave,
} from '../../Shared/Lib/draftChangedHelpers'
import isLocalDraft from '../../Shared/Lib/isLocalDraft'
import navbarStyles from './2_StoryCoverScreenStyles'
import TabIcon from '../../Components/TabIcon'

import styles from './SlideshowCoverStyles'
import coverImageStyles from '../../Components/Styles/EditableCoverMediaStyles'
import Metrics from '../../Themes/Metrics'

class SlideshowCover extends Component{
  constructor(props) {
    super(props)

    const { slideshow = [] } = Immutable.asMutable(this.props.workingDraft, { deep: true })
    const hasPendingUpdate = props.pendingUpdate && !isLocalDraft(props.storyId)

    this.state = {
      galleryImagePath: slideshow[0],
      activeModal: hasPendingUpdate ? 'existingUpdateWarning' : undefined,
    }
  }

  getSelectedImages = (image, current) => {
    const { slideshow = [] } = Immutable.asMutable(this.props.workingDraft, { deep: true })
    if (slideshow.length >= 8) return
    let galleryImagePath = current.uri
    console.log("====image path ===", galleryImagePath)
    const existingIndex = slideshow.indexOf(galleryImagePath)
    if (existingIndex >= 0) {
      slideshow.splice(existingIndex, 1)
      galleryImagePath = _.last(slideshow)
    }
    else {
      slideshow.push(current.uri)
    }
    this.setState({
      galleryImagePath,
    })
    this.props.updateWorkingDraft({ slideshow })
  }

  isValid() {
    const {slideshow} = this.props.workingDraft
    return !_.isEmpty(slideshow)
  }

  isSavedDraft = () => {
    return this.props.originalDraft
      && this.props.originalDraft.id
      && this.props.originalDraft.id === this.props.workingDraft.id
  }

  navBack = () => {
    // this.props.resetCreateStore()
    if (this.props.navigatedFromProfile) {
      NavActions.tabbar({type: 'reset'})
      NavActions.profile()
    }
    else {
      NavActions.tabbar({type: 'reset'})
    }
  }

  _onRight = () => {
    if (!this.isValid()) {
      this.setState({validationError: 'Please choose at least one photo'})
      return
    }
    this.softSaveDraft()
      .then(() => {
        this.nextScreen()
      })
  }

  _onLeftYes = () => {
    this.saveStory().then(() => {
      this.navBack()
    })
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

  nextScreen() {
    console.log('nextScreen is called')
    NavActions.createStory_slideshow_details()
  }

  cleanDraft(){
    const {workingDraft, originalDraft, draftIdToDBId} = this.props
    const draft = _.merge({}, workingDraft)
    if (!isFieldSame('title', workingDraft, originalDraft)) draft.title = _.trim(draft.title)
    if (!isFieldSame('description', workingDraft, originalDraft)) draft.description = _.trim(draft.description)
    if (!isFieldSame('coverCaption', workingDraft, originalDraft)) draft.coverCaption = _.trim(draft.coverCaption)
    if (draftIdToDBId[workingDraft.id]) draft.id = draftIdToDBId[workingDraft.id]
    return draft
  }

  // this does a create or update depending on whether it is a local draft
  saveStory() {
    const cleanedDraft = this.cleanDraft()

    if (isLocalDraft(cleanedDraft.id)) {
      console.log('calling this.props.saveDraft', cleanedDraft)
      this.props.saveDraft(cleanedDraft, true)
    }
    else {
      console.log('calling this.props.update', cleanedDraft)
      this.props.update(cleanedDraft.id, cleanedDraft)
    }
    return Promise.resolve({})
  }

  softSaveDraft() {
    const cleanedDraft = this.cleanDraft()
    return Promise.resolve(this.props.updateWorkingDraft(cleanedDraft))
  }

  renderImageCropper = () => {
    return (
      <Fragment>
        <ImageCrop 
          ref={'cropper'}
          image={this.state.galleryImagePath}
          cropHeight={300}
          cropWidth={Metrics.screenWidth}
          maxZoom={80}
          minZoom={20}
          panToMove={true}
          pinchToZoom={true}
        />
        <View style={styles.horizontalGrid} />
        <View style={styles.verticalGrid} />
      </Fragment>
    )
  }

  renderSelectedImage = () => {
    return (
      <View style={styles.imagePreview}>
        {
          this.state.galleryImagePath
          ? this.renderImageCropper()
          : <View style={[styles.addPhotoView]}>
          <View
            style={styles.addPhotoButton}
          >
            <TabIcon
              name='cameraDark'
              style={{
                view: coverImageStyles.cameraIcon,
                image: coverImageStyles.cameraIconImage,
              }}
            />
            <Text style={[coverImageStyles.baseTextColor, coverImageStyles.coverPhotoText]}>
              CHOOSE COVER PHOTO OR VIDEO
            </Text>
          </View>
        </View>
        }
      </View>
    )
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
        <Text style={coverScreenStyles.modalTitle}>{title}</Text>
        <Text style={coverScreenStyles.modalMessage}>{message}</Text>
        <View style={coverScreenStyles.modalBtnWrapper}>
          <TouchableOpacity
            style={[coverScreenStyles.modalBtn, coverScreenStyles.modalBtnLeft]}
            onPress={this._onLeftYes}
          >
            <Text style={coverScreenStyles.modalBtnText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={coverScreenStyles.modalBtn}
            onPress={this._onLeftNo}
          >
            <Text style={coverScreenStyles.modalBtnText}>No</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }

  renderHeader = () => {
    return (
      <NavBar
        title='ALL PHOTOS'
        onLeft={this._onLeft}
        leftTitle='Close'
        onRight={this._onRight}
        rightIcon={'arrowRightRed'}
        isRightValid={this.isValid()}
        rightTitle='Next'
        rightTextStyle={navbarStyles.navBarRightTextStyle}
        style={navbarStyles.navBarStyle}
      />
    )
  }

  renderIcon = (item) => {
    const workingDraft = Immutable.asMutable(this.props.workingDraft, { deep: true })
    const { slideshow = [] } = workingDraft
    const uri = _.get(item, 'node.image.uri')
    const existingIndex = slideshow.indexOf(uri)
    const number = existingIndex + 1
    if (existingIndex < 0) return null
    return (
      <Fragment>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{number}</Text>
        </View>
        {number === slideshow.length
          && <View style={styles.overlay} />
        }
      </Fragment>
    )
  }

  render(){
    return(
      <View style={{ flex: 1 }}>
        {this.renderHeader()}
        {this.renderSelectedImage()}
        <View style={{ alignItems: 'center' }}>
          <CameraRollPicker
            scrollRenderAheadDistance={100}
            initialListSize={1}
            pageSize={3}
            removeClippedSubviews={true}
            groupTypes='SavedPhotos'
            maximum={8}
            assetType='All'
            selectedMarker={this.renderIcon}
            imagesPerRow={4}
            imageMargin={1}
            callback={this.getSelectedImages}
          />
        </View>
        {this.state.activeModal === 'cancel' && this.renderCancel()}
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
)(SlideshowCover)
