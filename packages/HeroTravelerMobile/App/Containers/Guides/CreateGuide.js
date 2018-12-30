import { Actions as NavActions } from 'react-native-router-flux'
import React from 'react'
import {
  ScrollView,
  View,
} from 'react-native'
import { connect } from 'react-redux'

import {
  SharedCreateGuide,
  mapStateToProps,
  mapDispatchToProps,
} from '../../Shared/Lib/CreateGuideHelpers'
import Loader from '../../Components/Loader'
import ShadowButton from '../../Components/ShadowButton'
import EditableCoverMedia from '../../Components/EditableCoverMedia'
import FormInput from '../../Components/FormInput'
import storyCoverStyles from '../CreateStory/2_StoryCoverScreenStyles'
import NavBar from '../CreateStory/NavBar'
import { Images, Colors} from '../../Shared/Themes'
import Checkbox from '../../Components/Checkbox'
import DropdownMenu from '../../Components/DropdownMenu'
import Form from '../../Components/Form'
import Tooltip from '../../Components/Tooltip'
import isTooltipComplete, {Types as TooltipTypes} from '../../Shared/Lib/firstTimeTooltips'
import TouchableMultilineInput from '../../Components/TouchableMultilineInput'
import styles from '../Styles/CreateGuideStyles'

const noop = () => {}
const options = []
for (let i = 1; i < 31; i++) options.push({ value: `${i}`, label: `${i}` })

class CreateGuide extends SharedCreateGuide {
  static defaultProps = {
    onCancel: NavActions.pop,
  }

  jumpToTop = () => {
    this.scrollViewRef.scrollTo({ x: 0, y: 0, amimated: true })
  }

  onErrorPress = () => {
    this.props.dismissError()
  }

  componentWillMount() {
    const {guide} = this.props
    if (guide) {
      this.setState({
        guide,
      })
    }
  }

  onSuccessfullSave = () => {
    const {guide} = this.props
    if (this.isExistingGuide()) NavActions.editGuideStories({guideId: guide.id})
    else NavActions.pop()
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
    }).join(', ')
  }

  getCategoriesValue = () => {
    const {categories} = this.state.guide
    if (!categories.length) return
    return categories.map(category => {
      return category.title
    }).join(', ')
  }

  isShowTooltip = () => {
    return !isTooltipComplete(
      TooltipTypes.GUIDE_IS_VERIFIED,
      this.props.user.introTooltips,
    )
  }

  _completeTooltip = () => {
    const tooltips = this.props.user.introTooltips.concat({
      name: TooltipTypes.GUIDE_IS_VERIFIED,
      seen: true,
    })
    this.props.completeTooltip(tooltips)
  }

  togglePrivacy = () => {
    this.updateGuide({ isPrivate: !this.state.guide.isPrivate })
  }

  render() {
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
        {!creating && (
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
                checked={!isPrivate}
                label={'Verified'}
                onPress={this.togglePrivacy}
              />
              {this.isShowTooltip() && (
                <Tooltip
                  position='bottom-center'
                  style={{
                    container: styles.tooltipContainer,
                    tip: styles.tooltipTip,
                  }}
                  isSmallButton
                  text={'Verified Guides are trips you’ve taken, not ones you are planning. Other users will only see Guides that are verified.'}
                  onDismiss={this._completeTooltip}
                />
              )}
            </Form>
          </ScrollView>
        )}
      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateGuide)
