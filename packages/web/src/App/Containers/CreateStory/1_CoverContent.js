import React, { Component } from 'react'
import {connect} from 'react-redux'

import AddCoverPhotoBox from '../../Components/CreateStory/AddCoverPhotoBox'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'

class CreateStoryCoverContent extends Component {
  onInputChange = (event) => {
    const update = {}
    update[event.target.name] = event.target.value
    this.props.updateWorkingDraft(update)
  }

  render() {
    return (
      <AddCoverPhotoBox
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
