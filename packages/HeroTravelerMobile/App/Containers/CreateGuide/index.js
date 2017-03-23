import PropTypes from 'prop-types'
import { Actions as NavActions } from 'react-native-router-flux'
import React, { Component } from 'react'
import { Image, ScrollView, View, Text } from 'react-native'
import { connect } from 'react-redux'
import { find } from 'lodash'
import SearchBar from '../../Components/SearchBar'

import StoryActions from '../../Shared/Redux/Entities/Stories'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import UserActions from '../../Shared/Redux/Entities/Users'

import ListItem from '../../Components/ListItem'
import GuideListItem from '../../Components/GuideListItem'
import ShadowButton from '../../Components/ShadowButton'
import CoverMedia from '../../Components/CoverMedia'
import storyCoverStyles from '../CreateStory/2_StoryCoverScreenStyles'
import NavBar from '../CreateStory/NavBar'

import { isPhotoType } from '../../Shared/Lib/mediaHelpers'

import { Images, Colors, Metrics } from '../../Shared/Themes'

import styles from '../Styles/CreateGuide'

const mapStateToProps = state => ({
  user: state.entities.users.entities[state.session.userId],
  accessToken: find(state.session.tokens, { type: 'access' }),
  error: state.storyCreate.error,
  originalDraft: { ...state.storyCreate.draft },
  workingDraft: { ...state.storyCreate.workingDraft },
})

const mapDispatchToProps = dispatch => ({
  updateWorkingDraft: update =>
    dispatch(StoryCreateActions.updateWorkingDraft(update)),
  discardDraft: draftId => dispatch(StoryCreateActions.discardDraft(draftId)),
  update: (id, attrs, doReset) =>
    dispatch(StoryCreateActions.updateDraft(id, attrs, doReset)),
  completeTooltip: introTooltips =>
    dispatch(UserActions.updateUser({ introTooltips })),
  resetCreateStore: () => dispatch(StoryCreateActions.resetCreateStore()),
  saveDraftToCache: draft => dispatch(StoryActions.addDraft(draft)),
})

class CreateGuide extends Component {
  static defaultProps = {
    onCancel: NavActions.pop,
    onDone: NavActions.pop,
  }

  static propTypes = {
    onCancel: PropTypes.func,
    onDone: PropTypes.func,
  }

  jumpToTop = () => {
    this.SCROLLVIEW.scrollTo({ x: 0, y: 0, amimated: true })
  }

  onErrorPress = () => {}

  onError = () => {
    this.setState({
      error:
        "There's an issue with the video you selected. Please try another.",
    })
    // jump to top to reveal error message
    this.jumpToTop()
  }

  render = () => {
    const { onError, props } = this
    const { error, onCancel, onDone, workingDraft, updateWorkingDraft } = props
    return (
      <View style={storyCoverStyles.root}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          bounces={false}
          stickyHeaderIndices={[0]}
          ref={s => (this.SCROLLVIEW = s)}>
          <NavBar
            onLeft={onCancel}
            leftTitle={'Cancel'}
            title={'CREATE GUIDE'}
            isRightValid={false}
            onRight={onDone}
            rightTitle={'Create'}
            rightTextStyle={storyCoverStyles.navBarRightTextStyle}
            style={storyCoverStyles.navBarStyle}
          />
          <View style={styles.coverHeight}>
            {error && (
              <ShadowButton
                style={styles.errorButton}
                onPress={this.onErrorPress}
                text={error}
              />
            )}
            {isPhotoType(workingDraft.coverVideo) && (
              <CoverMedia
                media={workingDraft.coverImage}
                isPhoto={true}
                onError={onError}
                onUpdate={updateWorkingDraft}
              />
            )}
            {!isPhotoType(workingDraft.coverVideo) && (
              <CoverMedia
                media={workingDraft.coverVideo}
                isPhoto={false}
                onError={onError}
                onUpdate={updateWorkingDraft}
              />
            )}
          </View>
        </ScrollView>
      </View>
    )
  }
}

const ConnectedCreateGuide = connect(mapStateToProps, mapDispatchToProps)(
  CreateGuide
)

export default ConnectedCreateGuide
