import { connect } from 'react-redux'
import R from 'ramda'

import StoryList from '../Components/StoryList'

const mapStateToProps = (state, ownProps) => {
  const {entities} = state

  let targetEntities
  if (ownProps.isStory) {
    const storyFromStoryId = (storyId) => entities.stories.entities[storyId]
    targetEntities = R.map(storyFromStoryId, ownProps.storiesById)
  }
  else {
    const guideFromGuideId = (guideId) => entities.guides.entities[guideId]
    targetEntities = R.map(guideFromGuideId, ownProps.storiesById)
  }

  return {
    targetEntities
  }

}

export default connect(
  mapStateToProps,
  null
)(StoryList)
