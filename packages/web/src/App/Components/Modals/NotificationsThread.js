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
    users: PropTypes.object,
  }

  // renderNotificationRows(userKeys) {
  //   userKeys.pop()
  //   return userKeys.map((key, index) => {
  //     return (
  //       <NotificationRow
  //         key={key}
  //         user={usersExample[key]}
  //         notification={notificationTypes[index].notificationText}
  //         comment={notificationTypes[index].commentText}
  //         trip={tripsExampleSliced[index]}
  //         isTrip={notificationTypes[index].isTrip}
  //         timestamp={randomDate(new Date(2017,7,1), new Date())}
  //       />
  //     )
  //   })
  // }

  renderNotificationRows = () => {
    const {profile, activities, activitiesById, users} = this.props
    return activitiesById.map(id => {
      const userId = activities[id].fromUser
      const userProfile = users[userId]
      const activity = activities[id]
      return (
        <NotificationRow
          key={id}
          user={userProfile}
          notification={this.getDescription(activity)}
          //add comments
          //add trips
          //add timestamp
        />
      )
    })
  }

  getDescription(activity) {
    switch (activity.kind) {
      case ActivityTypes.follow:
        return `is now following you.`
      case ActivityTypes.comment:
        return  `commented on your story ${activity.story.title}.`
      case ActivityTypes.like:
        return `liked your story ${activity.story.title}.`
    }
  }

  render() {
    const {profile} = this.props
    // const userKeys = Object.keys(users).filter((key, index) => {
    //   return key !== profile
    // })
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
