import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {Text, View, Animated, TouchableOpacity, Image} from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'
import StarRating from 'react-native-star-rating'
import _ from 'lodash'

import StoryActions from '../Shared/Redux/Entities/Stories'
import {isStoryLiked, isStoryBookmarked} from '../Shared/Redux/Entities/Users'
import {Images} from '../Shared/Themes'
import {styles, rendererStyles, translations} from './Styles/StoryReadingScreenStyles'
import ReadingScreensOverlap from '../Components/ReadingScreensOverlap'
import ReadingDetails from '../Components/ReadingDetails'
import RoundedButton from '../Components/RoundedButton'
import isTooltipComplete, {Types as TooltipTypes} from '../Shared/Lib/firstTimeTooltips'
import UserActions from '../Shared/Redux/Entities/Users'
import {
  createShareDialog,
} from '../Lib/sharingMobile'

class SlideshowReadingScreen extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    author: PropTypes.object,
    storyId: PropTypes.string,
    story: PropTypes.object,
    fetching: PropTypes.bool,
    error: PropTypes.object,
    onPressBookmark: PropTypes.func,
    onPressRemoveBookmark: PropTypes.func,
    isBookmarked: PropTypes.bool,
    onPressStoryLike: PropTypes.func,
    onPressStoryUnlike: PropTypes.func,
    isLiked: PropTypes.bool,
    flagStory: PropTypes.func,
    completeTooltip: PropTypes.func,
    requestStory: PropTypes.func,
  };

  constructor(props) {
    super(props)
    this.state = {
      showFlagModal: false,
      scrollY: new Animated.Value(0),
    }
    if (!this.props.story) {
      this.getStory()
    }
  }

  _onPressBookmark = () => {
    const {
      onPressRemoveBookmark, onPressBookmark,
      isBookmarked, storyId,
    } = this.props
    if (isBookmarked) return onPressRemoveBookmark(storyId)
    return onPressBookmark(storyId)
  }

  _onPressComment = () => {
    NavActions.comments({
      storyId: this.props.storyId,
    })
  }

  _toggleLike = () => {
    const {
      story, user, isLiked,
      onPressStoryLike, onPressStoryUnlike,
    } = this.props
    if (isLiked) onPressStoryUnlike(story.id, user.id)
    else onPressStoryLike(story.id, user.id)
  }

  _toggleFlag = () => {
    this.setState({showFlagModal: !this.state.showFlagModal})
  }

  _pressAddToGuide = () => {
     const { story } = this.props
     NavActions.AddStoryToGuides({
      storyId: story.id,
      story,
    })
  }

  _onPressShare = () =>{
    createShareDialog(this.props.story, 'story')
  }

  renderHashtags = () => {
    let hashtags = _.compact(this.props.story.hashtags.map((hashtag) => {
      return '#' + hashtag.title
    }))
    return <Text style={[rendererStyles.unstyled, styles.sectionTextHighlight]}>{hashtags.join(', ')}</Text>
  }

  _flagStory = () => {
    this.props.flagStory(this.props.user.id, this.props.story.id)
    NavActions.pop()
  }

  _onButtonPress = () => {
    console.log('button was pressed')
  }

  hasLocationInfo() {
    const {locationInfo} = this.props.story
    return (
      !!locationInfo && !!locationInfo.name
      && !!locationInfo.latitude
      && !!locationInfo.longitude
    )
  }

  dismissTooltip = () => {
    const updatedTooltips = this.props.user.introTooltips.concat({
      name: TooltipTypes.ADD_TO_GUIDE,
      seen: true,
    })
    this.props.completeTooltip(updatedTooltips)
  }

  getStory = () => {
    this.props.requestStory(this.props.storyId)
  }

  renderBody = () => {
    const {story} = this.props
    return (
      <Fragment>
        <View style={styles.textBlock}>
          <Text style={styles.overallExperienceText}>Overall Experience:</Text>
          <View style={styles.starsContainer}>
            <StarRating
              containerStyle={{
                marginTop: -5,
                marginLeft: 25,
                marginBottom: 10,
                flex: 1,
              }}
              disabled
              emptyStar={'ios-star'}
              fullStar={'ios-star'}
              halfStar={'ios-star-half'}
              iconSet={'Ionicons'}
              maxStars={5}
              starSize={25}
              rating={story.rating}
              fullStarColor={'red'}
            />
          </View>
        </View>
        <View style={styles.divider}/>
        <View style={styles.textBlock}>
          <Text style={styles.description}>
            {story.description}
          </Text>
        </View>
        <View style={styles.content}>
          {!!this.props.story.hashtags && (
            this.renderHashtags()
          )}
          {!!story.videoDescription && (
            <View style={styles.videoDescription}>
              <Text style={styles.videoDescriptionText}>{story.videoDescription}</Text>
            </View>
          )}
          <RoundedButton
            onPress={this._onButtonPress}
            text="More Info"
          />
          <View style={styles.divider}/>
          <ReadingDetails targetEntity={story} />
        </View>
      </Fragment>
    )
  }

  renderPlusButton = (scrollY) => {
    const plusButtonTranslation = scrollY.interpolate(translations.plusButton)
    return (
      <Animated.View
        key='plusButton'
        style={[
          {
            transform: [
              {
                translateY: plusButtonTranslation,
              },
            ],
          },
          styles.plusButton,
        ]}>
        <TouchableOpacity
          onPress={this._pressAddToGuide}
          style={styles.plusButtonTouchable}>
          <Image
            source={Images.iconContentPlusWhite}
            style={styles.plusButtonIcon}
          />
        </TouchableOpacity>
      </Animated.View>
    )
  }

  renderToolTip = (scrollY) => {
    const {user} = this.props
    const tooltipOpacity = scrollY.interpolate(translations.tooltip)
    const showNextTooltip = !!user && !isTooltipComplete(
      TooltipTypes.ADD_TO_GUIDE,
      user.introTooltips,
    )
    if (!showNextTooltip) return null

    return (
      <TouchableOpacity
        key={'tooltip'}
        onPress={this.dismissTooltip}
      >
        <Animated.View
          style={[
            { opacity: tooltipOpacity },
            styles.addToGuideTooltip,
          ]}>
          <Text style={{ color: 'white' }}>
            {`Tap to add story\nto a travel guide`}
          </Text>
          <View style={styles.addToGuideTooltipArrow} />
        </Animated.View>
      </TouchableOpacity>
    )
  }

  render () {
    const {
      story, author, user, fetching, error,
      isBookmarked, isLiked,
    } = this.props
    return (
      <ReadingScreensOverlap
        author={author}
        user={user}
        targetEntity={story}
        getTargetEntity={this.getStory}
        fetching={fetching}
        error={error}
        isBookmarked={isBookmarked}
        isLiked={isLiked}
        isStory
        hideDescription
        onPressLike={this._toggleLike}
        onPressBookmark={this._onPressBookmark}
        onPressComment={this._onPressComment}
        onPressShare={this._onPressShare}
        flagTargetEntity={this._flagStory}
        renderBody={this.renderBody}
        animatedViews={[
          this.renderPlusButton,
          this.renderToolTip,
        ]}
      />
    )
  }
}

const mapStateToProps = (state, props) => {
  const {session: {userId}} = state
  let { fetching, entities: stories, error } = state.entities.stories
  const story = stories[props.storyId]
  return {
    author: story ? state.entities.users.entities[story.author] : undefined,
    user: state.entities.users.entities[userId],
    fetching,
    story,
    error,
    isLiked: isStoryLiked(state.entities.users, userId, props.storyId),
    isBookmarked: isStoryBookmarked(state.entities.users, userId, props.storyId),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onPressStoryLike: (story, sessionUserId) => {
      dispatch(StoryActions.likeStoryRequest(story, sessionUserId))
    },
    onPressStoryUnlike: (story, sessionUserId) => {
      dispatch(StoryActions.unlikeStoryRequest(story, sessionUserId))
    },
    onPressBookmark: (feedItemId) =>
      dispatch(StoryActions.bookmarkStoryRequest(feedItemId)),
    onPressRemoveBookmark: (feedItemId) =>
      dispatch(StoryActions.removeStoryBookmarkRequest(feedItemId)),
    requestStory: (storyId) => dispatch(StoryActions.storyRequest(storyId)),
    flagStory: (userId, storyId) => dispatch(StoryActions.flagStory(userId, storyId)),
    completeTooltip: (introTooltips) => dispatch(UserActions.updateUser({introTooltips})),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SlideshowReadingScreen)
