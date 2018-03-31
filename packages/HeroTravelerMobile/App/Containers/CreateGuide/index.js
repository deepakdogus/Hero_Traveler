import PropTypes from 'prop-types'
import { Actions as NavActions } from 'react-native-router-flux'
import React, { Component } from 'react'
import {
  ActivityIndicator,
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
import GuideActions from '../../Shared/Redux/Entities/Guides'
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

const noop = () => {}

const mapStateToProps = state => {
  return {
    user: state.entities.users.entities[state.session.userId],
    accessToken: find(state.session.tokens, { type: 'access' }),
    guides: { ...state.entities.guides.entities },
    fetching: state.entities.guides.fetchStatus.fetching,
    loaded: state.entities.guides.fetchStatus.loaded,
    status: state.entities.guides.fetchStatus,
  }
}

const mapDispatchToProps = dispatch => ({
  createGuide: guide => dispatch(GuideActions.createGuide(guide)),
})

class CreateGuide extends Component {
  static defaultProps = {
    onCancel: NavActions.pop,
  }

  static propTypes = {
    onCancel: PropTypes.func,
  }

  state = {
    creating: false,
    guide: {
      title: undefined,
      description: undefined,
      author: this.props.user.id,
      stories: undefined,
      categories: undefined,
      location: undefined,
      flagged: undefined,
      counts: undefined,
      coverImage: undefined,
      isPrivate: undefined,
      cost: undefined,
      duration: undefined,
      stories: [this.props.story],
    },
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

  onCategorySelectionPress = () => {
    NavActions.setCategories({
      onDone: categories => {
        NavActions.pop()
        this.updateGuide({ categories })
      },
      categories: this.state.guide.categories,
    })
  }

  onDone = () => {
    this.setState(
      {
        creating: true,
      },
      () => {
        this.props.createGuide(this.state.guide)
      }
    )
  }

  componentWillReceiveProps = nextProps => {
    if (
      this.state.creating &&
      this.props.fetching &&
      nextProps.fetching === false
    ) {
      NavActions.pop()
    }
  }

  // Quick win for not updating unmounted components on guide creation
  shouldComponentUpdate = () => !this.state.creating

  onLocationSelectionPress = () => {
    NavActions.setLocation({
      onSelectLocation: location => {
        NavActions.pop()
        this.updateGuide({ location })
      },
      location: this.state.guide.location
        ? this.state.guide.location.name
        : null,
    })
  }

  updateGuide = updates => {
    const newGuide = Object.assign({}, this.state.guide, updates)
    this.setState({
      guide: newGuide,
    })
  }

  render = () => {
    const { onDone, onError, props, state, updateGuide } = this
    const { creating, guide } = state
    const { error, fetching, onCancel} = props
    const {
      categories,
      cost,
      description,
      duration,
      isPrivate,
      title,
      location,
      coverVideo,
      coverImage,
    } = guide
    const guideRequirementsMet = title && description
    const options = []
    for (let i = 1; i < 31; i++) options.push({ value: `${i}`, label: `${i}` })
    let categoriesValue
    if (categories && categories.length) {
      categoriesValue = ''
      categories.map(
        (c, idx) =>
          (categoriesValue += `${c.title}${
            idx === categories.length - 1 ? '' : ', '
          }`)
      )
    }

    return (
      <View style={storyCoverStyles.root}>
        <ActivityIndicator
          style={creating ? {
            position: 'absolute',
            flex: 1,
            zIndex: 2,
            top: Metrics.mainNavHeight,
            right: 0,
            bottom: 0,
            left: 0,
          } : {
            position: 'absolute',
          }}
          animating={creating}
          hidesWhenStopped={true}
          size={'large'}
          color={Colors.redHighlights}
        />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          bounces={false}
          stickyHeaderIndices={[0]}
          ref={s => (this.SCROLLVIEW = s)}>
          <NavBar
            onLeft={creating ? noop : onCancel}
            leftTitle={'Cancel'}
            title={'CREATE GUIDE'}
            isRightValid={guideRequirementsMet ? true : false}
            onRight={guideRequirementsMet && !creating ? onDone : noop}
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
            {isPhotoType(coverVideo) && (
              <CoverMedia
                media={coverImage}
                isPhoto={true}
                onError={onError}
                onUpdate={updateGuide}
              />
            )}
            {!isPhotoType(coverVideo) && (
              <CoverMedia
                media={coverVideo}
                isPhoto={false}
                onError={onError}
                onUpdate={updateGuide}
              />
            )}
          </View>
          <Form>
            <FormInput
              icon={Images.iconInfoDark}
              onChangeText={title => updateGuide({ title })}
              placeholder={'Title'}
              value={title}
            />
            <FormInput
              onPress={this.onLocationSelectionPress}
              icon={Images.iconLocation}
              placeholder={'Location(s)'}
              value={location ? location.name : null}
            />
            <FormInput
              onPress={this.onCategorySelectionPress}
              icon={Images.iconTag}
              placeholder={'Categories'}
              value={categoriesValue}
            />
            <FormInput
              onPress={() => {}}
              isDropdown={true}
              options={options}
              placeholder={'How many days is this guide?'}
              icon={Images.iconDate}
              onValueChange={duration => updateGuide({ duration })}
              value={
                duration
                  ? `${duration} ${duration > 1 ? 'Days' : 'Day'}`
                  : undefined
              }
            />
            <FormInput
              value={cost}
              icon={Images.iconGear}
              placeholder={'Cost (USD)'}
              onChangeText={cost => updateGuide({ cost })}
              style={{
                marginBottom: Metrics.doubleBaseMargin * 2,
              }}
            />
            <MultilineInput
              label={'Overview'}
              placeholder={"What's your guide about?"}
              onChangeText={description => updateGuide({ description })}
              value={description}
            />
            <Checkbox
              checked={isPrivate}
              label={'Make this guide private'}
              onPress={() => updateGuide({ isPrivate: !isPrivate })}
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
