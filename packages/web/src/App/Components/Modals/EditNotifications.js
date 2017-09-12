import React from 'react'
import styled from 'styled-components'

import EditNotificationRow from '../EditNotificationRow'

const notificationTypes = [
  { text: 'New Followers', isNotifying: true },
  { text: 'Story Published', isNotifying: false },
  { text: 'Newsletter', isNotifying: true },
  { text: 'Suggested Authors', isNotifying: false },
  { text: 'Story of the Day', isNotifying: true },
]

const Container = styled.div`
  padding: 25px;
`
export default class EditNotifications extends React.Component {

  toggleNotificationSwitch = () => {}

  renderEditNotificationRows(notificationTypes) {
    return notificationTypes.map((element,index) => {
      return (
        <EditNotificationRow
          index={index}
          key={element.text}
          text={element.text}
          isNotifying={element.isNotifying}
          toggleNotificationSwitch={this.toggleNotificationSwitch}
          logOnChange={this.logOnChange}
        />
      )
    })
  }

  render() {
    return (
      <Container>
        {this.renderEditNotificationRows(notificationTypes)}
      </Container>
    )
  }
}
