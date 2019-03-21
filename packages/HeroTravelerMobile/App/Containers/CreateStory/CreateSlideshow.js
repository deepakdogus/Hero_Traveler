import _ from 'lodash'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import SlideshowCover from './SlideshowCover'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import createLocalDraft from '../../Shared/Lib/createLocalDraft'
import isLocalDraft from '../../Shared/Lib/isLocalDraft'

class CreateSlideshowScreen extends Component {
  static propTypes = {
    storyId: PropTypes.string,
    story: PropTypes.object,
    userId: PropTypes.string,
    addLocalDraft: PropTypes.func,
    loadDraft: PropTypes.func,
    discardDraft: PropTypes.func,
    publish: PropTypes.func,
    resetCreateStore: PropTypes.func,
    reroute: PropTypes.func,
    setWorkingDraft: PropTypes.func,
  }

  componentWillMount() {
    const {
      storyId, userId, story,
      addLocalDraft, loadDraft, setWorkingDraft,
    } = this.props
    if (!storyId) {
      addLocalDraft(createLocalDraft(userId))
    }
    // should only load publish stories since locals do not exist in DB
    else if (isLocalDraft(storyId)) {
      loadDraft(storyId, story)
    }
    else {
      setWorkingDraft(story)
    }
  }

  render () {
    return (
      <SlideshowCover {...this.props}/>
    )
  }
}

function mapStateToProps(state, props) {
  const accessToken = _.find(state.session.tokens, {type: 'access'})

  const pendingDraft = _.get(state, `pendingUpdates.pendingUpdates[${props.storyId}].story`)
  const savedStory = state.entities.stories.entities[props.storyId]

  return {
    userId: state.session.userId,
    story: savedStory || pendingDraft,
    accessToken: accessToken.value,
    draft: state.storyCreate.draft,
    workingDraft: state.storyCreate.workingDraft,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addLocalDraft: (draft) => dispatch(StoryCreateActions.addLocalDraft(draft)),
    loadDraft: (draftId, story) => dispatch(StoryCreateActions.editStory(draftId, story)),
    setWorkingDraft: (story) => dispatch(StoryCreateActions.editStorySuccess(story)),
    discardDraft: (draftId) => dispatch(StoryCreateActions.discardDraft(draftId)),
    resetCreateStore: () => dispatch(StoryCreateActions.resetCreateStore()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateSlideshowScreen)
