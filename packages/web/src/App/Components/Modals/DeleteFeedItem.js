import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { push } from 'react-router-redux'

import StoryActions from '../../Shared/Redux/Entities/Stories'
import GuideActions from '../../Shared/Redux/Entities/Guides'
import PendingUpdatesActions from '../../Shared/Redux/PendingUpdatesRedux'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import RoundedButton from '../../Shared/Web/Components/RoundedButton'
import {
  Container,
  Title,
  Text,
} from './Shared'
import {Row} from '../../Shared/Web/Components/FlexboxGrid'

class DeleteFeedItem extends React.Component {
  static propTypes = {
    reroute: PropTypes.func,
    closeModal: PropTypes.func,
    deleteStory: PropTypes.func,
    discardPendingUpdate: PropTypes.func,
    deleteGuide: PropTypes.func,
    resetCreateStore: PropTypes.func,
    userId: PropTypes.string,
    globalModalParams: PropTypes.object,
  }

  storyDeleteAndReroute = () => {
    const { reroute, closeModal, resetCreateStore, discardPendingUpdate } = this.props
    const { feedItemId } = this.props.globalModalParams
    if (feedItemId.includes('local')) {
      resetCreateStore()
      discardPendingUpdate(feedItemId)
    }
    else {
      this._deleteStory()
    }
    reroute('/')
    closeModal()
  }

  guideDeleteAndReroute = () => {
    this._deleteGuide()
    this.props.globalModalParams.rerouteOverride()
    this.props.closeModal()
  }

  _deleteStory = () => {
    const { feedItemId } = this.props.globalModalParams
    this.props.deleteStory(this.props.userId, feedItemId)
  }

  _deleteGuide = () => {
    const { feedItemId } = this.props.globalModalParams
    this.props.deleteGuide(feedItemId, this.props.userId)
  }

  isStory = () => {
    return this.props.globalModalParams.type === 'story'
  }

  render() {
    const isStory = this.isStory()
    return (
      <Container>
        <Title>Delete {isStory ? 'Story' : 'Guide'}:</Title>
        <Text>Are you sure you want to delete this {isStory ? 'story' : 'guide'}?</Text>
        <Row center="xs">
        <RoundedButton
            text='No'
            margin='small'
            type='blackWhite'
            onClick={this.props.closeModal}
          />
          <RoundedButton
            text='Yes'
            margin='small'
            onClick={isStory ? this.storyDeleteAndReroute : this.guideDeleteAndReroute}
          />
        </Row>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {
    globalModalParams: state.ux.params,
    userId: state.session.userId,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    reroute: (route) => dispatch(push(route)),
    deleteStory: (userId, storyId) => dispatch(StoryActions.deleteStory(userId, storyId)),
    discardPendingUpdate: (storyId) => dispatch(PendingUpdatesActions.removePendingUpdate(storyId)),
    deleteGuide: (guideId, userId) => dispatch(GuideActions.deleteGuideRequest(guideId, userId)),
    resetCreateStore: () => dispatch(StoryCreateActions.resetCreateStore()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteFeedItem)
