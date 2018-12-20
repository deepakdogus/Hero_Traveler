import _ from 'lodash'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Actions as NavActions } from 'react-native-router-flux'
import React, { Component } from 'react'
import {
  Animated,
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'
import Swipeout from 'react-native-swipeout'

import storyCoverStyles from '../CreateStory/2_StoryCoverScreenStyles'
import GuideActions from '../../Shared/Redux/Entities/Guides'
import UserActions from '../../Shared/Redux/Entities/Users'
import NavBar from '../CreateStory/NavBar'
import GuideListItem from '../../Components/GuideListItem'
import {imageHeight, imageWidth} from '../../Components/Styles/GuideListItemStyles'
import {
  Metrics,
  Colors,
} from '../../Shared/Themes'
import { getStoryImageUrl } from '../../Components/GuideStoriesOfType'
import isTooltipComplete, {Types as TooltipTypes} from '../../Shared/Lib/firstTimeTooltips'

const deleteBtnParams = {
  text: 'Delete',
  backgroundColor : Colors.redHighlights,
  underlayColor : Colors.redHighlights,
}

const videoImageUrlOptions = {
  height: imageHeight,
  width: imageWidth,
  video: true,
}

const imageUrlOptions = {
  height: imageHeight,
  width: imageWidth,
}

class EditGuideStories extends Component {
  static propTypes = {
    user: PropTypes.object,
    updateGuide: PropTypes.func,
    stories: PropTypes.arrayOf(PropTypes.object),
    guide: PropTypes.object,
    completeTooltip: PropTypes.func,
  }

  onDone = () => {
    NavActions.tabbar({type: 'reset'})
    NavActions.profile()
  }

  onLeft = () => {
    NavActions.pop()
  }

  removeStoryFromGuide = (storyIdToRemove) => {
    const {updateGuide, guide} = this.props
    return () => {
      const filteredStories = guide.stories.filter((storyId) => storyIdToRemove !== storyId)
      updateGuide({
        id: guide.id,
        stories: filteredStories,
      })
    }
  }

  dismissTooltip = () => {
    const updatedTooltips = this.props.user.introTooltips.concat({
      name: TooltipTypes.SLIDE_DELETE_GUIDE,
      seen: true,
    })
    this.props.completeTooltip(updatedTooltips)
  }

  renderToolTip = () => {
    const {user} = this.props
    const showNextTooltip = !!user && !isTooltipComplete(
      TooltipTypes.SLIDE_DELETE_GUIDE,
      user.introTooltips,
    )
    if (!showNextTooltip) return null

    return (
      <TouchableOpacity key={'tooltip'} style={{zIndex: 100}} onPress={this.dismissTooltip}>
        <Animated.View
          style={[
            storyCoverStyles.addToGuideTooltip,
          ]}>
          <Text style={{ color: 'white' }}>
            {`Swipe left on a\nstory to delete`}
          </Text>
          <View style={storyCoverStyles.addToGuideTooltipArrow} />
        </Animated.View>
      </TouchableOpacity>
    )
  }

  render = () => {
    const {stories} = this.props
    return (
      <View style={storyCoverStyles.root}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          bounces={false}
          stickyHeaderIndices={[0]}
          ref={this.setScrollViewRef}>
          <NavBar
            onLeft={this.onLeft}
            leftTitle={'Back'}
            title={'Guide Stories'}
            onRight={this.onDone}
            rightTitle={'Next'}
            rightTextStyle={storyCoverStyles.navBarRightTextStyle}
            style={storyCoverStyles.navBarStyle}
          />
          <View style={styles.storyWrapper}>
            {this.renderToolTip()}
            {!!stories.length &&
              stories.map((story, idx) => {

                const coverUrl = getStoryImageUrl(
                  story,
                  videoImageUrlOptions,
                  imageUrlOptions,
                )
                return (
                  <Swipeout
                    style={{backgroundColor: 'white'}}
                    key={`story-${idx}`}
                    right={[{
                      ...deleteBtnParams,
                      onPress: this.removeStoryFromGuide(story.id),
                    }]}
                  >
                    <GuideListItem
                      imageUri={{ uri: coverUrl }}
                      label={story.title}
                      guideId={story.id}
                    />
                  </Swipeout>
                )
              })
            }
            
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state, props) => {
  const guide = state.entities.guides.entities[props.guideId]
  const allStories = state.entities.stories.entities
  const stories = _.compact(guide.stories.map((storyId) => allStories[storyId]))
  const {session: {userId}} = state

  return {
    guide,
    stories,
    user: state.entities.users.entities[userId],
  }
}

const mapDispatchToProps = dispatch => ({
  updateGuide: guide => dispatch(GuideActions.updateGuide(guide)),
  completeTooltip: (introTooltips) => dispatch(UserActions.updateUser({introTooltips})),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditGuideStories)

const styles = StyleSheet.create({
  storyWrapper: {
    paddingHorizontal: Metrics.marginHorizontal,
  }
})

