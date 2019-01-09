import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import UserActions from '../../Shared/Redux/Entities/Users'
import {
  ActivityTypes,
  isActivityIncomplete,
  getPopulatedActivity,
} from '../../Shared/Lib/NotificationHelpers'
import NotificationRow from '../NotificationRow'
import { RightTitle, RightModalCloseX } from './Shared'

const Container = styled.div``

const NotificationRowsContainer = styled.div``

class NotificationsThread extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func,
    activitiesById: PropTypes.array,
    activities: PropTypes.object,
    markSeen: PropTypes.func,
    stories: PropTypes.object,
    users: PropTypes.object,
    guides: PropTypes.object,
    reroute: PropTypes.func,
  }

  renderNotificationRows = () => {
    const {
      activities,
      activitiesById,
      closeModal,
      reroute,
      markSeen,
    } = this.props

    return activitiesById.map(id => {
      const activity = activities[id]
      const populatedActivity = getPopulatedActivity(id, this.props)

      if (isActivityIncomplete(populatedActivity)) return null

      return (
        <NotificationRow
          key={id}
          activity={populatedActivity}
          isFeedItem={this.isFeedItem(activity)}
          reroute={reroute}
          closeModal={closeModal}
          markSeen={markSeen}
        />
      )
    })
  }

  isFeedItem = activity => {
    return activity.kind !== ActivityTypes.follow
  }

  render() {
    return (
      <Container>
        <RightModalCloseX
          name="closeDark"
          onClick={this.props.closeModal}
        />
        <RightTitle>NOTIFICATIONS</RightTitle>
        <NotificationRowsContainer>
          {this.renderNotificationRows()}
        </NotificationRowsContainer>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  const users = state.entities.users
  return {
    activitiesById: users.activitiesById,
    activities: users.activities,
    users: users.entities,
    stories: state.entities.stories.entities,
    guides: state.entities.guides.entities,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    reroute: route => dispatch(push(route)),
    markSeen: activityId => dispatch(UserActions.activitySeen(activityId)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationsThread)
