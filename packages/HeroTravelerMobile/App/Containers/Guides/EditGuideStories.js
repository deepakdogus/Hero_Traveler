import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Actions as NavActions } from 'react-native-router-flux'
import React, { Component } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native'
import Swipeout from 'react-native-swipeout'

import storyCoverStyles from '../CreateStory/2_StoryCoverScreenStyles'
import GuideActions from '../../Shared/Redux/Entities/Guides'
import NavBar from '../CreateStory/NavBar'
import GuideListItem from '../../Components/GuideListItem'
import {
  Metrics,
  Colors,
} from '../../Shared/Themes'
import { getStoryImageUrl } from '../../Components/GuideStoriesOfType'

const deleteBtnParams = {
  text: 'Delete',
  backgroundColor : Colors.redHighlights,
  underlayColor : Colors.redHighlights,
}

class EditGuideStories extends Component {
  static propTypes = {
    updateGuide: PropTypes.func,
    stories: PropTypes.arrayOf(PropTypes.object),
    guide: PropTypes.object,
  }

  onDone = () => {
    NavActions.tabbar({type: 'reset'})
    NavActions.myFeed()
  }

  onLeft = () => {
    NavActions.pop()
  }

  removeStoryFromGuide = (storyIdToRemove) => {
    const {updateGuide, guide} = this.props
    return () => {
      const filetedStories = guide.stories.filter((storyId) => storyIdToRemove !== storyId)
      updateGuide({
        id: guide.id,
        stories: filetedStories,
      })
    }
  }

  noop = () => undefined

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
            rightTitle={'Save'}
            rightTextStyle={storyCoverStyles.navBarRightTextStyle}
            style={storyCoverStyles.navBarStyle}
          />
          <View style={styles.storyWrapper}>
            {!!stories.length &&
              stories.map((story, idx) => {
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
                      imageUri={{ uri: getStoryImageUrl(story) }}
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
  const stories = guide.stories.map((storyId) => allStories[storyId])

  return {
    guide,
    stories,
  }
}

const mapDispatchToProps = dispatch => ({
  updateGuide: guide => dispatch(GuideActions.updateGuide(guide)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditGuideStories)

const styles = StyleSheet.create({
  storyWrapper: {
    paddingHorizontal: Metrics.marginHorizontal,
  }
})

