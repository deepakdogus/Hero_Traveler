import React , { Component } from 'react'
import {
  View,
  Text,
  Image,
  Alert,
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import ParallaxScrollView from 'react-native-parallax-scroll-view'

import NavBar from './NavBar'
import CameraRollPicker from '../../Components/CameraRollPicker/CameraRollPicker'

import { getPendingDraftById } from '../../Shared/Lib/getPendingDrafts'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import UserActions from '../../Shared/Redux/Entities/Users'

import {
  haveFieldsChanged,
  hasChangedSinceSave,
} from '../../Shared/Lib/draftChangedHelpers'
import navbarStyles from './2_StoryCoverScreenStyles'

import styles from './SlideshowCoverStyles'

class SlideshowCover extends Component{
  constructor(props) {
    super(props)
    this.state = {
      selectedImages: [],
      galleryImagePath:false,
    }
  }

  getSelectedImages = (image, current) => {
    const { selectedImages } = this.state
    console.log("====image path ===", current.uri)
    this.setState({
      galleryImagePath:current.uri,
      selectedImages: [...selectedImages, current.uri],
    })
  }

  isValid() {
    const {coverImage, coverVideo, title} = this.props.workingDraft
    return _.every([
      !!coverImage || !!coverVideo,
      !!_.trim(title),
    ])
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

  renderSelectedImage = () => {
    return (
      <View style={styles.galleryView}>
        <View style={styles.imagePreview}>
          {
            this.state.galleryImagePath
            && <Image
                source={{uri: this.state.galleryImagePath}}
                style={{ height:400 }}
              />
          }
        </View>
      </View>
    )
  }

  renderHeader = () => {
    return (
      <NavBar
        title='SAVE'
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
    console.log('item', item)
    const { selectedImages } = this.state
    console.log('selectedImages', selectedImages)
    const uri = _.get(item, 'node.image.uri')
    const number = _.findIndex(selectedImages, uri)
    return (<View><Text>{number}</Text></View>)
  }

  render(){
    return(
      <View style={{ flex: 1 }}>
          <ParallaxScrollView
            style={{ flex: 1, backgroundColor: 'hotpink', overflow: 'hidden' }}
            renderBackground={this.renderSelectedImage}
            renderFixedHeader={this.renderHeader}
            parallaxHeaderHeight={ 350 }
            stickyHeaderHeight={55}
          >
            <View style={{ alignItems: 'center' }}>
              <CameraRollPicker
                scrollRenderAheadDistance={100}
                initialListSize={1}
                pageSize={3}
                removeClippedSubviews={true}
                groupTypes='SavedPhotos'
                maximum={8}
                assetType='Photos'
                selectedMarker={this.renderIcon}
                imagesPerRow={4}
                imageMargin={1}
                callback={this.getSelectedImages}
              />
            </View>
          </ParallaxScrollView>
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
