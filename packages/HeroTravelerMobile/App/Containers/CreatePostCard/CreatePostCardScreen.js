import { connect } from 'react-redux'
import PostCardCreate from '../../Components/PostCard/PostCardCreate'

function mapDispatchToProps(dispatch) {
  // return {
  //   addLocalDraft: (draft) => dispatch(StoryCreateActions.addLocalDraft(draft)),
  //   loadDraft: (draftId, story) => dispatch(StoryCreateActions.editStory(draftId, story)),
  //   setWorkingDraft: (story) => dispatch(StoryCreateActions.editStorySuccess(story)),
  //   discardDraft: (draftId) => dispatch(StoryCreateActions.discardDraft(draftId)),
  //   resetCreateStore: () => dispatch(StoryCreateActions.resetCreateStore()),
  // }
}

export default connect(null, null)(PostCardCreate)
