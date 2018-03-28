import PropTypes from 'prop-types'
import { Actions as NavActions } from 'react-native-router-flux'
import React, { Component } from 'react'
import {
  Image,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import { find } from 'lodash'
import SearchBar from '../../Components/SearchBar'

import StoryActions from '../../Shared/Redux/Entities/Stories'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import UserActions from '../../Shared/Redux/Entities/Users'

import ListItem from '../../Components/ListItem'
import TabIcon from '../../Components/TabIcon'
import GuideListItem from '../../Components/GuideListItem'
import ShadowButton from '../../Components/ShadowButton'
import CoverMedia from '../../Components/CoverMedia'
import FormInput from '../../Components/FormInput'
import storyCoverStyles from '../CreateStory/2_StoryCoverScreenStyles'
import NavBar from '../CreateStory/NavBar'

import { isPhotoType } from '../../Shared/Lib/mediaHelpers'

import { Fonts, Images, Colors, Metrics } from '../../Shared/Themes'

import { Checkbox, Form, MultilineInput } from './components'

import styles from '../Styles/CreateGuideStyles'

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

  state = {
    isPrivate: false,
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

  togglePrivacy = () => {
    this.setState({
      isPrivate: !this.state.isPrivate
    })
  }

  onCategorySelectionPress = () => {
    NavActions.setCategories({
      onDone: (categories) => {
        console.info(categories)
        NavActions.pop()
      },
      categories: this.props.workingDraft.categories || this.state.categories
    })
  }

  onLocationSelectionPress = () => {
    NavActions.setLocation({
      onSelectLocation: (location) => {
        console.info(location)
        NavActions.pop()
      },
      location: this.props.workingDraft.locationInfo || this.state.location
    })
  }

  render = () => {
    const { onError, props, state } = this
    const { isPrivate } = state
    const { error, onCancel, onDone, workingDraft, updateWorkingDraft } = props
    const { description, title, locationInfo } = workingDraft

    const options = []
    for (let i = 1; i < 31; i++) options.push({value: `${i}`, label: `${i}`})

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
          <Form>
            <FormInput
              icon={Images.iconInfoDark}
              onChangeText={() => {}}
              placeholder={'Title'}
              value={title}
            />
            <FormInput
              onPress={this.onLocationSelectionPress}
              icon={Images.iconLocation}
              placeholder={'Location(s)'}
              value={locationInfo ? locationInfo.name : null}
            />
            <FormInput
              onPress={this.onCategorySelectionPress}
              icon={Images.iconTag}
              placeholder={'Categories'}
              value={locationInfo ? locationInfo.name : null}
            />
            <FormInput
              onPress={() => {}}
              isDropdown={true}
              options={options}
              placeholder={'How many days is this guide?'}
              icon={Images.iconDate}
              value={title}
            />
            <FormInput
              value={title}
              icon={Images.iconGear}
              placeholder={'Cost (USD)'}
              onChangeText={() => {}}
              style={{
                marginBottom: Metrics.doubleBaseMargin * 2,
              }}
            />
            <MultilineInput
              label={'Overview'}
              placeholder={"What's your guide about?"}
              onContentChange={() => {}}
              value={title}
            />
            <Checkbox
              checked={isPrivate}
              label={'Make this guide private'}
              onPress={this.togglePrivacy}
            />
          </Form>
        </ScrollView>
      </View>
    )
  }
}

const ConnectedCreateGuide = connect(mapStateToProps, mapDispatchToProps)(
  CreateGuide
)

export default ConnectedCreateGuide
