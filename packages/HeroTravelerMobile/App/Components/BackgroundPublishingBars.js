import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ProgressBar from './ProgressBar'
import FailureBar from './FailureBar'

class BackgroundPublishingBars extends Component {
  static propTypes = {
    sync: PropTypes.object,
    failure: PropTypes.object,
    updateDraft: PropTypes.func,
    publishLocalDraft: PropTypes.func,
    discardUpdate: PropTypes.func,
  }

  render() {
    const {sync, failure, updateDraft, publishLocalDraft, discardUpdate} = this.props
    const hideProgressBar = sync.syncProgressSteps === 0
      || sync.syncProgressSteps === sync.syncProgress
      || sync.error

    if (!hideProgressBar) {
      return ( <ProgressBar {...sync} /> )
    }
    else if (failure) {
      return (
        <FailureBar
          failure={failure}
          updateDraft={updateDraft}
          publishLocalDraft={publishLocalDraft}
          discardUpdate={discardUpdate}
        />
      )
    }
    else return null
  }
}

export default BackgroundPublishingBars
