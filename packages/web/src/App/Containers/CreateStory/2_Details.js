import React, { Component } from 'react'
import {connect} from 'react-redux'

import StoryDetails from '../../Components/CreateStory/StoryDetails'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'

class CreateStoryCoverContent extends Component {
  onInputChange = (update) => {
    this.props.updateWorkingDraft(update)
  }

  render() {
    return (
      <StoryDetails
        onInputChange={this.onInputChange}
        workingDraft={this.props.workingDraft}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    workingDraft: state.storyCreate.workingDraft
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateWorkingDraft: (story) => dispatch(StoryCreateActions.updateWorkingDraft(story)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateStoryCoverContent)
