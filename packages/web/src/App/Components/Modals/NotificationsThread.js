import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import NotificationRow from '../NotificationRow'
import {RightTitle, RightModalCloseX} from './Shared'

const Container = styled.div``

const NotificationRowsContainer = styled.div``

export default class NotificationsThread extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func,
    activitiesById: PropTypes.array,
    activities: PropTypes.object,
    markSeen: PropTypes.func,
    stories: PropTypes.object,
    users: PropTypes.object,
    reroute: PropTypes.func,
  }

  renderNotificationRows = () => {
    const {
      activities,
      activitiesById,
      closeModal,
      stories,
      users,
      reroute,
      markSeen,
    } = this.props

    return activitiesById.map(id => {
      const userId = activities[id].fromUser
      const userProfile = users[userId]
      const activity = activities[id]
      const story = stories[activity.story]
      return (
        <NotificationRow
          key={id}
          user={userProfile}
          activityKind={activity.kind}
          isFeedItem={this.isFeedItem(activity)}
          story={story}
          reroute={reroute}
          closeModal={closeModal}
          seen={activity.seen}
          markSeen={markSeen}
          activityId={activity.id}
        />
      )
    })
  }

  isFeedItem = (activity) => {
    return activity.kind === 'ActivityStoryComment' || activity.kind === 'ActivityStoryLike'
  }

  render() {
    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <RightTitle>NOTIFICATIONS</RightTitle>
          <NotificationRowsContainer>
            {this.renderNotificationRows()}
          </NotificationRowsContainer>
      </Container>
    )
  }
}
