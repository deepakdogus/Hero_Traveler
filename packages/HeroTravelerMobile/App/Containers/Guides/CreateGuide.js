import PropTypes from 'prop-types'
import { Actions as NavActions } from 'react-native-router-flux'
import React, { Component } from 'react'
import {
  ScrollView,
  View,
} from 'react-native'
import { connect } from 'react-redux'

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
import createLocalGuideDraft from '../../Shared/Lib/createLocalGuideDraft'
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
    guide: PropTypes.object,
    fetching: PropTypes.bool,
    user: PropTypes.object,
    story: PropTypes.object,
    registerDraft: PropTypes.func,
    updateGuide: PropTypes.func,
    createGuide: PropTypes.func,
    error: PropTypes.object,
    dismissError: PropTypes.func,
    guideFailure: PropTypes.func,
  }

  constructor(props) {
    super(props)
  }

  state = {
    creating: false,
    guide: {
      id: undefined,
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
    this.props.dismissError()
  }

  isGuideValid = () => {
    const {coverImage, title, locations} = this.state.guide
    return !!coverImage && !!title && locations.length
  }

  onDone = () => {
    const {creating} = this.state
    const {updateGuide, createGuide, user, guideFailure} = this.props
    if (creating) return
    if (!this.isGuideValid()) {
      guideFailure(new Error(
        "Please ensure the guide has a photo, a title, and at least one location."
      ))
      return
    }

    const onDoneFunc = this.isExistingGuide() ? updateGuide : createGuide
    this.setState(
      {
        creating: true,
      },
      () => {
        let guide = this.state.guide
        onDoneFunc(guide, user.id)
      }
    )
  }

  componentWillMount() {
    const {guide} = this.props
    if (guide) {
      this.setState({
        guide,
      })
    } else {
      this.props.registerDraft(createLocalGuideDraft(this.props.user.id, this.props.story))
    }
  }

  componentDidUpdate = (prevProps) => {
    const {guide} = this.props
    if (
      this.state.creating &&
      prevProps.fetching && this.props.fetching === false
    ) {
      if (!prevProps.error && this.props.error) {
        this.setState({creating: false})
      }
      else {
        this.setState(
          {creating: false},
          () => {
            if (this.isExistingGuide()) NavActions.editGuideStories({guideId: guide.id})
            else NavActions.pop()
          }
        )
      }
    }
  }

  onLocationSelectionPress = () => {
    NavActions.locationSelectorScreen({
      onSelectLocation: this.updateLocations,
      locations: this.state.guide.locations,
      isMultiSelect: true,
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

  updateLocations = (locations) => {
    this.updateGuide({ locations })
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

  isExistingGuide = () => {
    const {guide} = this.state
    return guide && guide.id
  }

  render = () => {
    const { onDone, props, state, updateGuide } = this
    const { creating, guide } = state
    const { error, onCancel } = props
    const {
      cost,
      description,
      duration,
      isPrivate,
      title,
      coverImage,
    } = guide

    return (
      <View style={storyCoverStyles.root}>
        {creating && (
          <Loader
            style={styles.loader}
            tintColor={Colors.blackoutTint}
          />
        )}
        {!creating &&
          <ScrollView
            keyboardShouldPersistTaps="handled"
            bounces={false}
            stickyHeaderIndices={[0]}
            ref={this.setScrollViewRef}>
            <NavBar
              onLeft={creating ? noop : onCancel}
              leftTitle={'Cancel'}
              title={this.isExistingGuide() ? 'GUIDE DETAILS' : 'CREATE GUIDE'}
              isRightValid={this.isGuideValid() && !creating ? true : false}
              onRight={onDone}
              rightTitle={this.isExistingGuide() ? 'Next' : 'Create'}
              rightTextStyle={storyCoverStyles.navBarRightTextStyle}
              style={storyCoverStyles.navBarStyle}
            />
            <View style={styles.coverHeight}>
              {!!error && (
                <ShadowButton
                  style={styles.errorButton}
                  onPress={this.onErrorPress}
                  text={error.message}
                />
              )}
              <EditableCoverMedia
                isPhoto
                media={coverImage}
                mediaType='photo'
                clearError={error ? this.onErrorPress : noop}
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
        }
      </View>
    )
  }
}

const mapStateToProps = (state, props) => {
  const guides = state.entities.guides.entities

  return {
    user: state.entities.users.entities[state.session.userId],
    guide: guides[props.guideId],
    fetching: state.entities.guides.fetchStatus.fetching,
    error: state.entities.guides.error,
    loaded: state.entities.guides.fetchStatus.loaded,
    status: state.entities.guides.fetchStatus,
  }
}

const mapDispatchToProps = dispatch => ({
  registerDraft: (draft) => dispatch(GuideActions.registerDraftSuccess(draft)),
  createGuide: (guide, userId) => dispatch(GuideActions.createGuide(guide, userId)),
  updateGuide: guide => dispatch(GuideActions.updateGuide(guide)),
  guideFailure: error => dispatch(GuideActions.guideFailure(error)),
  dismissError: () => dispatch(GuideActions.dismissError()),
})

const ConnectedCreateGuide = connect(mapStateToProps, mapDispatchToProps)(CreateGuide)

export default ConnectedCreateGuide
