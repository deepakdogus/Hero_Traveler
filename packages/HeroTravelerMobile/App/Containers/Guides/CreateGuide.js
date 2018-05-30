import PropTypes from 'prop-types'
import { Actions as NavActions } from 'react-native-router-flux'
import React, { Component } from 'react'
import {
  ScrollView,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import { find } from 'lodash'

import Loader from '../../Components/Loader'
import GuideActions from '../../Shared/Redux/Entities/Guides'
import ShadowButton from '../../Components/ShadowButton'
import EditableCoverMedia from '../../Components/EditableCoverMedia'
import FormInput from '../../Components/FormInput'
import storyCoverStyles from '../CreateStory/2_StoryCoverScreenStyles'
import NavBar from '../CreateStory/NavBar'
import { Images, Colors} from '../../Shared/Themes'
import Checkbox from '../../Components/Checkbox'
import DropdownMenu from '../../Components/DropdownMenu'
import Form from '../../Components/Form'
import TouchableMultilineInput from '../../Components/TouchableMultilineInput'
import styles from '../Styles/CreateGuideStyles'

const noop = () => {}
const options = []
for (let i = 1; i < 31; i++) options.push({ value: `${i}`, label: `${i}` })

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
      categories: [],
      locations: [],
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
    this.scrollViewRef.scrollTo({ x: 0, y: 0, amimated: true })
  }

  onErrorPress = () => {
    this.setState({error: null})
  }

  onError = () => {
    this.setState({
      error:
        "There's an issue with the video you selected. Please try another.",
    })
    // jump to top to reveal error message
    this.jumpToTop()
  }

  onDone = () => {
    this.setState(
      {
        creating: true,
      },
      () => {
        let guide = this.state.guide
        // Think ht-core needs updating before it can use story cover as default
        // if (!guide.coverImage) {
        //   guide = Object.assign({}, guide, {
        //     coverImage: this.props.story.coverImage,
        //   })
        // }
        this.props.createGuide(guide)
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
    NavActions.locationSelectorScreen({
      navBack: NavActions.pop,
      onSelectLocation: this.setLocation,
      location: this.state.guide.location
        ? this.state.guide.location.name
        : "",
    })
  }

  onCategorySelectionPress = () => {
    NavActions.tagSelectorScreen({
      onDone: this.setCategories,
      tags: this.state.guide.categories,
      tagType: 'category',
    })
  }


  updateGuide = updates => {
    const newGuide = Object.assign({}, this.state.guide, updates)
    this.setState({
      guide: newGuide,
    })
  }

  setScrollViewRef = (ref) => this.scrollViewRef = ref
  setTitle = (title) => this.updateGuide({ title })
  setDuration = (duration) => this.updateGuide({ duration })
  setCost = (cost) => this.updateGuide({ cost })
  setDescription = (description) => {
    this.updateGuide({ description })
    NavActions.pop()
  }

  setCategories = (categories) => {
    this.updateGuide({ categories })
    NavActions.pop()
  }

  setLocation = (location) => {
    this.updateGuide({ locations: [location] })
    NavActions.pop()
  }

  getLocationsValue = () => {
    const {locations} = this.state.guide
    if (!locations.length) return
    return locations.map(location => {
      return location.name
    }).join(", ")
  }

  getCategoriesValue = () => {
    const {categories} = this.state.guide
    if (!categories.length) return
    return categories.map(category => {
      return category.title
    }).join(", ")
  }

  togglePrivacy = () => {
    this.updateGuide({ isPrivate: !this.state.guide.isPrivate })
  }

  render = () => {
    const { onDone, onError, props, state, updateGuide } = this
    const { creating, guide } = state
    const { error, fetching, onCancel } = props
    const {
      cost,
      description,
      duration,
      isPrivate,
      title,
      locations,
      coverImage,
    } = guide

    const guideRequirementsMet = title && locations && coverImage

    return (
      <View style={storyCoverStyles.root}>
        {creating && (
          <Loader
            style={styles.loader}
            tintColor={Colors.blackoutTint}
          />
        )}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          bounces={false}
          stickyHeaderIndices={[0]}
          ref={this.setScrollViewRef}>
          <NavBar
            onLeft={creating ? noop : onCancel}
            leftTitle={'Cancel'}
            title={'CREATE GUIDE'}
            isRightValid={guideRequirementsMet && !creating ? true : false}
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
            <EditableCoverMedia
              isPhoto
              media={coverImage}
              clearError={this.onErrorPress}
              onUpdate={updateGuide}
            />
          </View>
          <Form>
            <FormInput
              onChangeText={this.setTitle}
              iconName='info'
              value={title}
              placeholder='Title'
            />
            <FormInput
              onPress={this.onLocationSelectionPress}
              iconName='location'
              value={this.getLocationsValue()}
              placeholder='Location(s)'
            />
            <FormInput
              onPress={this.onCategorySelectionPress}
              iconName='tag'
              value={this.getCategoriesValue()}
              placeholder={'Categories'}
            />
            <DropdownMenu
              options={options}
              placeholder={'How many days is this guide?'}
              icon={Images.iconDate}
              onValueChange={this.setDuration}
              value={
                duration
                  ? `${duration} ${duration > 1 ? 'Days' : 'Day'}`
                  : undefined
              }
            />
            <FormInput
              onChangeText={this.setCost}
              iconName='gear'
              value={cost}
              placeholder={'Cost (USD)'}
            />
            <TouchableMultilineInput
              onDone={this.setDescription}
              title={'OVERVIEW'}
              label={'Overview'}
              value={description}
              placeholder={"What's your guide about?"}
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

const ConnectedCreateGuide = connect(mapStateToProps, mapDispatchToProps)(
  CreateGuide
)

export default ConnectedCreateGuide
