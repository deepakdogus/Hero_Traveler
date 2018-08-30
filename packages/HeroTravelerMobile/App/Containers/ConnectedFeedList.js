import { connect } from 'react-redux'
import R from 'ramda'

import FeedList from '../Components/FeedList'

const mapStateToProps = (state, ownProps) => {
  const {entities} = state

  // mapping Ids to actual stories or guides
  let mapFunc;
  if (ownProps.isStory) mapFunc = (storyId) => entities.stories.entities[storyId]
  else mapFunc = (guideId) => entities.guides.entities[guideId]

  return {
    targetEntities: R.map(mapFunc, ownProps.entitiesById),
    isLoggedOut: state.session.isLoggedOut,
    isResumingSession: state.session.isResumingSession,
  }

}

export default connect(
  mapStateToProps,
  null
)(FeedList)
