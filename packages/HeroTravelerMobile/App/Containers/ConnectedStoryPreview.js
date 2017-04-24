import { connect } from 'react-redux'

import {isStoryLiked} from '../Redux/Entities/Users'
import StoryPreview from '../Components/StoryPreview'

const mapStateToProps = (state, ownProps) => {
  const {session: {userId}, entities} = state
  const story = entities.stories.entities[ownProps.storyId]
  return {
    story,
    user: entities.users.entities[story.author],
    isLiked: isStoryLiked(state.session, userId, story.id)
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