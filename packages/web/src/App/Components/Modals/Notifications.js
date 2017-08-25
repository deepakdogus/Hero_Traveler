import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {usersExample} from '../../Containers/Feed_TEST_DATA'
import {feedExample} from '../../Containers/Feed_TEST_DATA'
import NotificationRow from '../NotificationRow'
import {RightTitle, RightModalCloseX} from './Shared'
import {randomDate} from './Shared/RandomDate'

const Container = styled.div``

const NotificationRowsContainer = styled.div`
  padding: 25px;
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
const tripsExample = feedExample[Object.keys(feedExample)[0]].categories
let tripsExampleSliced = {};
for (var i=0; i<3; i++)
    tripsExampleSliced[i] = tripsExample[i];

export default class Notifications extends React.Component {
  static PropTypes = {
    profile: PropTypes.object,
    users: PropTypes.object,
    closeModal: PropTypes.func,
  }

  renderNotificationRows(userKeys) {
    return userKeys.map((key, index) => {
      console.log("key: ", key)

      return (
        <NotificationRow
          key={key}
          user={usersExample[key]}
          notification={notificationTypes[index].notificationText}
          comment={notificationTypes[index].commentText}
          trip={tripsExampleSliced[index]}
          isTrip={notificationTypes[index].isTrip}
          timestamp={randomDate(new Date(2017,7,1), new Date())}
          margin='0 0 25px'
        />
      )
    })
  }

  render() {
    const {profile} = this.props
    const userKeys = Object.keys(usersExample).filter((key, index) => {
      return key !== profile.id
    })

    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <RightTitle>NOTIFICATIONS</RightTitle>
          <NotificationRowsContainer>
            {this.renderNotificationRows(userKeys)}
          </NotificationRowsContainer>
      </Container>
    )
  }
}
