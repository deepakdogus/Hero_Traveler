import { connect } from 'react-redux'

import {isStoryLiked, isStoryBookmarked} from '../Redux/Entities/Users'
import StoryPreview from '../Components/StoryPreview'

const mapStateToProps = (state, ownProps) => {
  const {session: {userId}, entities} = state
  const story = entities.stories.entities[ownProps.storyId]
  return {
    story,
    user: entities.users.entities[story.author],
    isLiked: isStoryLiked(entities.users, userId, story.id),
    isBookmarked: isStoryBookmarked(entities.users, userId, story.id)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryPreview)