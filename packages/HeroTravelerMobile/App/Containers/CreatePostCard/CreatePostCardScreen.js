import { connect } from 'react-redux'
import PostCardScreen from '../.../../Components/PostCard/PostCardScreScreen

function mapDispatchToProps(dispatch) {
  // return {
  //   addLocalDraft: (draft) => dispatch(StoryCreateActions.addLocalDraft(draft)),
  //   loadDraft: (draftId, story) => dispatch(StoryCreateActions.editStory(draftId, story)),
  //   setWorkingDraft: (story) => dispatch(StoryCreateActions.editStorySuccess(story)),
  //   discardDraft: (draftId) => dispatch(StoryCreateActions.discardDraft(draftId)),
  //   resetCreateStore: () => dispatch(StoryCreateActions.resetCreateStore()),
  // }
}

export default connect(null, null)(PostCardScreen)
