import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Animated,
  Text,
} from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'

import StoryActions from '../Shared/Redux/Entities/Stories'
import GuideActions from '../Shared/Redux/Entities/Guides'
import {isStoryLiked, isStoryBookmarked, isGuideLiked} from '../Shared/Redux/Entities/Users'
import ReadingScreensOverlap from '../Components/ReadingScreensOverlap'
import ReadingDetails from '../Components/ReadingDetails'
import TabBar from '../Components/TabBar'
import {navToProfile} from '../Navigation/NavigationRouter'
import GuideStoriesOfType from '../Components/GuideStoriesOfType'
import {styles} from './Styles/StoryReadingScreenStyles'

export const tabTypes = {
  overview: 'overview',
  see: 'see',
  do: 'do',
  eat: 'eat',
  stay: 'stay',
}

class GuideReadingScreen extends React.Component {
  static propTypes = {
    sessionUser: PropTypes.object,
    guideId: PropTypes.string,
    guide: PropTypes.object,
    fetching: PropTypes.bool,
    error: PropTypes.object,
    isGuideLiked: PropTypes.bool,
    onPressGuideLike: PropTypes.func,
    onPressGuideUnlike: PropTypes.func,
  };

  constructor(props) {
    super(props)
    this.state = {
      showFlagModal: false,
      scrollY: new Animated.Value(0),
      selectedTab: 'overview',
    }
    if (!this.props.story) {
      this.getGuide()
    }
  }

  _onPressBookmark = () => {
    const {toggleBookmark, sessionUser, storyId} = this.props
    toggleBookmark(sessionUser.id, storyId)
  }

  _onPressComment = () => {
    NavActions.storyComments({
      storyId: this.props.storyId
    })
  }

  _toggleLike = () => {
    const {
      guideId, sessionUser, isGuideLiked,
      onPressGuideLike, onPressGuideUnlike,
    } = this.props
    if (isGuideLiked) onPressGuideUnlike(guideId, sessionUser.id)
    else onPressGuideLike(guideId, sessionUser.id)
  }

  _toggleFlag = () => {
    this.setState({showFlagModal: !this.state.showFlagModal})
  }

  _flagStory = () => {
    this.props.flagStory(this.props.sessionUser.id, this.props.story.id)
    NavActions.pop()
  }

  getGuide = () => {
    this.props.requestGuide(this.props.guideId)
  }

  selectTab = (tab) => {
    if (this.state.selectedTab !== tab) {
      this.setState({selectedTab: tab})
    }
  }

  onPressAuthor = (authorId) => {
    const {sessionUser} = this.props
    if (authorId === sessionUser.id) navToProfile()
    else NavActions.readOnlyProfile({userId: authorId})
  }

  getStoriesAndAuthorsByType = (type) => {
    const {guideStories, users} = this.props
    const authors = {}
    const storiesOfType = guideStories.filter(story => {
      if (story.type === type) {
        if (!authors[story.author]) authors[story.author] = users[story.author]
        return true
      }
      else return false
    })
    return {
      stories: storiesOfType,
      authors: authors
    }
  }

  shouldDisplay = (type) => {
    const {selectedTab} = this.state
    return selectedTab === tabTypes.overview || selectedTab === type
  }

  renderBody = () => {
    const {guide} =  this.props
    const {selectedTab} = this.state

    return (
      <Fragment>
        <TabBar
          tabs={tabTypes}
          activeTab={selectedTab}
          onClickTab={this.selectTab}
          tabStyle={styles.tabStyle}
        />
        {this.shouldDisplay(tabTypes.overview) &&
          <Fragment>
            <Text style={[
              styles.description,
              styles.guideDescription,
            ]}>
              {guide.description}
            </Text>
            {!!guide.description && <View style={styles.divider} />}
            <ReadingDetails targetEntity={guide} />
          </Fragment>
        }
        {this.shouldDisplay(tabTypes.see) &&
          <GuideStoriesOfType
            type={tabTypes.see}
            label={'THINGS TO SEE'}
            onPressAll={this.selectTab}
            onPressAuthor={this.onPressAuthor}
            isShowAll={selectedTab === tabTypes.see}
            {...this.getStoriesAndAuthorsByType(tabTypes.see)}
          />
        }
        {this.shouldDisplay(tabTypes.do) &&
          <GuideStoriesOfType
            type={tabTypes.do}
            label={'THINGS TO DO'}
            onPressAll={this.selectTab}
            onPressAuthor={this.onPressAuthor}
            isShowAll={selectedTab === tabTypes.do}
            {...this.getStoriesAndAuthorsByType(tabTypes.do)}
          />
        }
        {this.shouldDisplay(tabTypes.eat) &&
          <GuideStoriesOfType
            type={tabTypes.eat}
            label={'PLACES TO EAT'}
            onPressAll={this.selectTab}
            onPressAuthor={this.onPressAuthor}
            isShowAll={selectedTab === tabTypes.eat}
            {...this.getStoriesAndAuthorsByType(tabTypes.eat)}
          />
        }
        {this.shouldDisplay(tabTypes.stay) &&
          <GuideStoriesOfType
            type={tabTypes.stay}
            label={'PLACES TO STAY'}
            onPressAll={this.selectTab}
            onPressAuthor={this.onPressAuthor}
            isShowAll={selectedTab === tabTypes.stay}
            {...this.getStoriesAndAuthorsByType(tabTypes.stay)}
          />
        }
      </Fragment>
    )
  }

  render () {
    const {
      guide, author, sessionUser, fetching, error,
      isBookmarked, isGuideLiked,
    } = this.props

    return (
      <ReadingScreensOverlap
        author={author}
        user={sessionUser}
        targetEntity={guide}
        getTargetEntity={this.getGuide}
        fetching={fetching}
        error={error}
        isBookmarked={isBookmarked}
        isLiked={isGuideLiked}
        onPressLike={this._toggleLike}
        onPressBookmark={this._onPressBookmark}
        onPressComment={this._onPressComment}
        flagTargetEntity={this._flagStory}
        renderBody={this.renderBody}
      />
    )
  }
}

const mapStateToProps = (state, props) => {
  const {session: {userId}} = state
  let { fetching, entities: guides, error } = state.entities.guides
  const users = state.entities.users.entities
  const stories = state.entities.stories.entities
  const guide = guides[props.guideId]
  const guideStories = guide ? guide.stories.map(storyId => {
    return stories[storyId]
  }) : {}

  return {
    author: guide ? users[guide.author] : undefined,
    sessionUser: users[userId],
    users,
    fetching,
    guide,
    guideStories,
    error,
    isGuideLiked: isGuideLiked(state.entities.users, userId, props.guideId),
    isBookmarked: isStoryBookmarked(state.entities.users, userId, props.guideId),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleLike: (userId, guideId) => dispatch(StoryActions.storyLike(userId, guideId)),
    toggleBookmark: (userId, guideId) => dispatch(StoryActions.storyBookmark(userId, guideId)),
    onPressGuideLike: (guideId, sessionUserId) => {
      dispatch(GuideActions.likeGuideRequest(guideId, sessionUserId))
    },
    onPressGuideUnlike: (guideId, sessionUserId) => {
      dispatch(GuideActions.unlikeGuideRequest(guideId, sessionUserId))
    },
    requestGuide: (guideId) => dispatch(GuideActions.getGuideRequest(guideId)),
    flagStory: (userId, guideId) => dispatch(StoryActions.flagStory(userId, guideId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GuideReadingScreen)
