import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {usersExample} from '../../Containers/Feed_TEST_DATA'
import {feedExample} from '../../Containers/Feed_TEST_DATA'
import NotificationRow from '../NotificationRow'
import {RightTitle, RightModalCloseX} from './Shared'
import {randomDate} from './Shared/RandomDate'

const ActivityTypes = {
  like: 'ActivityStoryLike',
  follow: 'ActivityFollow',
  comment: 'ActivityStoryComment'
}

const Container = styled.div``

const NotificationRowsContainer = styled.div`
`

const notificationTypes = [
  {
    notificationText: 'commented on your trip to Africa.',
    commentText: 'lorem ipsum',
    isTrip: true,
  },
  {
    notificationText: 'is now following you.',
    commentText: 'lorem ipsum',
    isTrip: false,
  },
  {
    notificationText: 'earned 100pts for creating a story. Keep up the good work!',
    commentText: 'lorem ipsum',
    isTrip: false,
  },
]

//test trip images
const tripsExample = feedExample['59d59ac574b3840010a1d6f3'].categories
let tripsExampleSliced = {};
for (var i=0; i<3; i++)
    tripsExampleSliced[i] = tripsExample[i];

export default class NotificationsThread extends React.Component {
  static PropTypes = {
    profile: PropTypes.string,
    users: PropTypes.object,
    closeModal: PropTypes.func,
    activitiesById: PropTypes.array,
    activities: PropTypes.object,
    markSeen: PropTypes.func,
    stories: PropTypes.object,
    reroute: PropTypes.func,
    users: PropTypes.object,
  }

  renderNotificationRows = () => {
    const { profile,
            activities,
            activitiesById,
            closeModal,
            stories,
            users,
            reroute,} = this.props
    return activitiesById.map(id => {
      const userId = activities[id].fromUser
      const userProfile = users[userId]
      const activity = activities[id]
      const story = stories[activity.story]
      return (
        <NotificationRow
          key={id}
          user={userProfile}
          notification={this.getDescription(activity, story)}
          isFeedItem={this.isFeedItem(activity)}
          story={story}
          reroute={reroute}
          closeModal={closeModal}
          //add comments
          //add timestamp
        />
      )
    })
  }

  getDescription = (activity, story) => {
    switch (activity.kind) {
      case ActivityTypes.follow:
        return `is now following you.`
      case ActivityTypes.comment:
        return  `commented on your story ${story.title}.`
      case ActivityTypes.like:
        return `liked your story ${story.title}.`
    }
  }

  isFeedItem = (activity) => {
    return activity.kind === 'ActivityStoryComment' || activity.kind === 'ActivityStoryLike'
  }

  render() {
    const {profile} = this.props
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
