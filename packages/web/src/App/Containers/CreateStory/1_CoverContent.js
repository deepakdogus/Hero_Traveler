import React, { Component } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import AddCoverTitles from '../../Components/CreateStory/AddCoverTitles'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'

class CreateStoryCoverContent extends Component {
  static propTypes = {
    workingDraft: PropTypes.object,
    updateWorkingDraft: PropTypes.func,
  }

  onInputChange = (update) => {
    this.props.updateWorkingDraft(update)
  }

  render() {
    return (
      <AddCoverTitles
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
