import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {
  Animated,
} from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'

import StoryActions from '../Shared/Redux/Entities/Stories'
import GuideActions from '../Shared/Redux/Entities/Guides'
import {isStoryLiked, isStoryBookmarked} from '../Shared/Redux/Entities/Users'
import ReadingScreensOverlap from '../Components/ReadingScreensOverlap'
import ReadingDetails from '../Components/ReadingDetails'

class GuideReadingScreen extends React.Component {
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

  renderBody = () => {
    const {guide} =  this.props
    return (
      <Fragment>
        <ReadingDetails targetEntity={guide} />
      </Fragment>
    )
  }

  render () {
    const {
      guide, author, user, fetching, error,
      isBookmarked, isLiked,
    } = this.props

    return (
      <ReadingScreensOverlap
        author={author}
        user={user}
        targetEntity={guide}
        getTargetEntity={this.getGuide}
        fetching={fetching}
        error={error}
        isBookmarked={isBookmarked}
        isLiked={isLiked}
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GuideReadingScreen)
