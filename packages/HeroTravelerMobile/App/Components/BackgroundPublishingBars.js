import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ProgressBar from './ProgressBar'
import FailureBar from './FailureBar'

class BackgroundPublishingBars extends Component {
  static propTypes = {
    sync: PropTypes.object,
    failure: PropTypes.object,
    updateDraft: PropTypes.func,
    saveLocalDraft: PropTypes.func,
    discardUpdate: PropTypes.func,
    resetFailCount: PropTypes.func,
  }

  render() {
    const {
      sync,
      failure,
      updateDraft,
      saveLocalDraft,
      discardUpdate,
      resetFailCount,
    } = this.props

    const hideProgressBar = sync.syncProgressSteps === 0
      || sync.syncProgressSteps === sync.syncProgress
      || sync.error
      || failure
    if (!hideProgressBar) {
      return ( <ProgressBar {...sync} /> )
    }
    else if (failure) {
      return (
        <FailureBar
          failure={failure}
          updateDraft={updateDraft}
          saveLocalDraft={saveLocalDraft}
          discardUpdate={discardUpdate}
          resetFailCount={resetFailCount}
        />
      )
    }
    else return null
  }
}

export default BackgroundPublishingBars
