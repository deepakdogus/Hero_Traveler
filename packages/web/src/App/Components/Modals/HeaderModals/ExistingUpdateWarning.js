import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import _ from 'lodash'

import RoundedButton from '../../RoundedButton'
import {
  Container,
  Title,
  Text,
} from '../Shared'
import {Row} from '../../FlexboxGrid'
import StoryCreateActions from '../../../Shared/Redux/StoryCreateRedux'

class ExistingUpdateWarning extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func,
    setWorkingDraft: PropTypes.func,
    pendingUpdate:PropTypes.object,
  }

  componentDidMount = () => {
    // there should always be a pendingUpdate but Im adding a failsafe
    if (!this.props.pendingUpdate) this.props.closeModal()
  }

  override = () => {
    this.props.closeModal()
  }

  usePendingDraft = () => {
    this.props.setWorkingDraft(this.props.pendingUpdate)
    this.props.closeModal()
  }

  render(){
    return(
      <Container>
        <Title>You have an existing edit to this story.</Title>
        <Text>Do you want to discard these changes or continue from your last edit?</Text>
        <Row center='xs'>
          <RoundedButton
            text='Discard'
            margin='small'
            type='blackWhite'
            onClick={this.override}
          />
          <RoundedButton
            text='Continue'
            margin='small'
            onClick={this.usePendingDraft}
          />
        </Row>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  const { storyId } = state.ux.params

  return {
    pendingUpdate: _.get(state, `pendingUpdates.pendingUpdates[${storyId}].story`),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setWorkingDraft: (story) => dispatch(StoryCreateActions.editStorySuccess(story, true)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExistingUpdateWarning)
