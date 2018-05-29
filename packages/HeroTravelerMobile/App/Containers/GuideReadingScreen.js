import React from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  View,
  Animated,
  RefreshControl
} from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'

import StoryActions from '../Shared/Redux/Entities/Stories'
import GuideActions from '../Shared/Redux/Entities/Guides'
import {isStoryLiked, isStoryBookmarked} from '../Shared/Redux/Entities/Users'
import formatCount from '../Shared/Lib/formatCount'
import ConnectedFeedItemPreview from './ConnectedFeedItemPreview'
import {Metrics} from '../Shared/Themes'
import StoryReadingToolbar from '../Components/StoryReadingToolbar'
import Loader from '../Components/Loader'
import FlagModal from '../Components/FlagModal'
import {styles, translations} from './Styles/StoryReadingScreenStyles'
import UserActions from '../Shared/Redux/Entities/Users'

class StoryReadingScreen extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    guideId: PropTypes.string,
    guide: PropTypes.object,
    fetching: PropTypes.bool,
    error: PropTypes.object,
  };

  constructor(props) {
    super(props)
    this.state = {
      showFlagModal: false,
      scrollY: new Animated.Value(0),
    }
    if (!this.props.story) {
      this.getGuide()
    }
  }

  _onPressBookmark = () => {
    const {toggleBookmark, user, storyId} = this.props
    toggleBookmark(user.id, storyId)
  }

  _onPressComment = () => {
    NavActions.storyComments({
      storyId: this.props.storyId
    })
  }

  _toggleLike = () => {
    this.props.toggleLike(this.props.user.id, this.props.story.id)
  }

  _toggleFlag = () => {
    this.setState({showFlagModal: !this.state.showFlagModal})
  }

  _flagStory = () => {
    this.props.flagStory(this.props.user.id, this.props.story.id)
    NavActions.pop()
  }

  getGuide = () => {
    this.props.requestGuide(this.props.guideId)
  }

  render () {
    const { guide, author, user } = this.props
    const { scrollY } = this.state
    if (!guide || !author) {
      return (
        <View style={[styles.darkRoot]}>
          {!guide &&
            <Loader style={styles.loader} />
          }
          { guide && !!guide.error &&
            <Text>{guide.error}</Text>
          }
        </View>
      )
    }

    const toolbarTranslation = scrollY.interpolate(translations.toolbar)

    return (
      <View style={[styles.root]}>
        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          style={[styles.scrollView]}
        >
          {!guide.draft &&
          <RefreshControl
            refreshing={this.props.fetching || false}
            onRefresh={this.getGuide}
          />
          }
          <ConnectedFeedItemPreview
            isFeed={false}
            onPressLike={this._toggleLike}
            showLike={false}
            gradientColors={['rgba(0,0,0,.65)', 'transparent', 'transparent', 'rgba(0,0,0,.65)']}
            gradientLocations={[0,.25,.5,1]}
            key={guide.id}
            height={Metrics.screenHeight}
            feedItem={guide}
            userId={user.id}
            autoPlayVideo={true}
            allowVideoPlay={true}
            isReadingScreen={true}
          />
          <View style={styles.divider}/>
        </Animated.ScrollView>
        <Animated.View
          style={[
            styles.toolBar,
            { transform: [{ translateY: toolbarTranslation }] },
          ]}>
          <StoryReadingToolbar
            likeCount={formatCount(guide.counts.likes)}
            commentCount={formatCount(guide.counts.comments)}
            boomarkCount={formatCount(guide.counts.bookmarks)}
            isBookmarked={this.props.isBookmarked}
            isLiked={this.props.isLiked}
            userId={this.props.user.id}
            storyId={guide.id}
            onPressLike={this._toggleLike}
            onPressFlag={this._toggleFlag}
            onPressBookmark={this._onPressBookmark}
            onPressComment={this._onPressComment}
          />
        </Animated.View>
        {/* Plus button for adding to Guide */}
        {
          <FlagModal
            closeModal={this._toggleFlag}
            showModal={this.state.showFlagModal}
            flagStory={this._flagStory}
          />
        }
      </View>
    )
  }
}

const mapStateToProps = (state, props) => {
  const {session: {userId}} = state
  let { fetching, entities: guides, error } = state.entities.guides
  const guide = guides[props.guideId]

  return {
    author: guide ? state.entities.users.entities[guide.author] : undefined,
    user: state.entities.users.entities[userId],
    fetching,
    guide,
    error,
    isLiked: isStoryLiked(state.entities.users, userId, props.guideId),
    isBookmarked: isStoryBookmarked(state.entities.users, userId, props.guideId),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleLike: (userId, guideId) => dispatch(StoryActions.storyLike(userId, guideId)),
    toggleBookmark: (userId, guideId) => dispatch(StoryActions.storyBookmark(userId, guideId)),
    requestGuide: (guideId) => dispatch(GuideActions.getGuideRequest(guideId)),
    flagStory: (userId, guideId) => dispatch(StoryActions.flagStory(userId, guideId)),
    completeTooltip: (introTooltips) => dispatch(UserActions.updateUser({introTooltips}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryReadingScreen)
