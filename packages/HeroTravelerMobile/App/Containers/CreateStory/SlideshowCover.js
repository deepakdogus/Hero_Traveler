import React , { Component, Fragment } from 'react'
import {
  View,
  Text,
  Alert,
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import { ImageCrop } from 'react-native-image-cropper'
import { Actions as NavActions } from 'react-native-router-flux'

import NavBar from './NavBar'
import CameraRollPicker from '../../Components/CameraRollPicker/CameraRollPicker'

import { getPendingDraftById } from '../../Shared/Lib/getPendingDrafts'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import UserActions from '../../Shared/Redux/Entities/Users'

import {
  isFieldSame,
  haveFieldsChanged,
  hasChangedSinceSave,
} from '../../Shared/Lib/draftChangedHelpers'
import navbarStyles from './2_StoryCoverScreenStyles'
import TabIcon from '../../Components/TabIcon'

import styles from './SlideshowCoverStyles'
import coverImageStyles from '../../Components/Styles/EditableCoverMediaStyles'
import Metrics from '../../Themes/Metrics'

class SlideshowCover extends Component{
  constructor(props) {
    super(props)
    this.state = {
      selectedImages: [],
      galleryImagePath: null,
    }
  }

  getSelectedImages = (image, current) => {
    const { selectedImages } = this.state
    if (selectedImages.length >= 8) return
    let galleryImagePath = current.uri
    console.log("====image path ===", galleryImagePath)
    const existingIndex = selectedImages.indexOf(galleryImagePath)
    if (existingIndex >= 0) {
      selectedImages.splice(existingIndex, 1)
      galleryImagePath = _.last(selectedImages)
    }
    else {
      selectedImages.push(current.uri)
    }
    this.setState({
      galleryImagePath,
      selectedImages,
    })
  }

  isValid() {
    const {coverImage, coverVideo, title} = this.props.workingDraft
    return _.every([
      !!coverImage || !!coverVideo,
      !!_.trim(title),
    ])
  }

  isSavedDraft = () => {
    return this.props.originalDraft
      && this.props.originalDraft.id
      && this.props.originalDraft.id === this.props.workingDraft.id
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

  _onTitle = () => {
    const title = 'Save Progess'
    const message = 'Do you want to save your progress?'
    if (!this.isValid()) {
      this.setState({validationError: 'Please add a cover and title to continue'})
      return
    }
    Alert.alert(
      title,
      message,
      [{
        text: 'Yes',
        onPress: () => {
          if (!this.isValid()) {
            this.setState({validationError: 'Please add a cover and title to save'})
          }
          else {
            this.saveStory()
          }
        },
      }, {
        text: 'Cancel',
        onPress: () => null,
      }],
    )
  }

  _onRight = () => {
    console.log('onRight is clicked')
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

  cleanDraft(){
    const {workingDraft, originalDraft, draftIdToDBId} = this.props
    const draft = _.merge({}, workingDraft)
    if (!isFieldSame('title', workingDraft, originalDraft)) draft.title = _.trim(draft.title)
    if (!isFieldSame('description', workingDraft, originalDraft)) draft.description = _.trim(draft.description)
    if (!isFieldSame('coverCaption', workingDraft, originalDraft)) draft.coverCaption = _.trim(draft.coverCaption)
    if (draftIdToDBId[workingDraft.id]) draft.id = draftIdToDBId[workingDraft.id]
    return draft
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

  renderHeader = () => {
    return (
      <NavBar
        title='ALL PHOTOS'
        onTitle={this._onTitle}
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
    const { selectedImages } = this.state
    const uri = _.get(item, 'node.image.uri')
    const number = selectedImages.indexOf(uri) + 1
    return (
      <Fragment>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{number}</Text>
        </View>
        {number === selectedImages.length
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
