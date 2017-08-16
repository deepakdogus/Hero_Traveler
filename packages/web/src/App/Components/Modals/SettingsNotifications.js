import React from 'react'
import styled from 'styled-components'

import InputRow from '../InputRow'
import {RightTitle, StyledInput} from './Shared'

import VerticalCenter from '../VerticalCenter'
import SettingsNotificationRow from '../SettingsNotificationRow'
import ModalTogglebar from '../ModalTogglebar'
import HorizontalDivider from '../HorizontalDivider'

const toggleBarTabs = [
  { text: 'Account', isActive: false, isLast: false },
  { text: 'Services', isActive: false, isLast: false },
  { text: 'Notifications', isActive: true, isLast: false },
  { text: 'Password', isActive: false, isLast: true },
]

const notificationTypes = [
  { text: 'New Followers', isNotifying: true },
  { text: 'Story Published', isNotifying: false },
  { text: 'Newsletter', isNotifying: true },
  { text: 'Suggested Authors', isNotifying: false },
  { text: 'Story of the Day', isNotifying: true },
]

const Container = styled.div``

const NotificationContainer = styled.div`
  padding: 25px;
`
export default class SettingsNotifications extends React.Component {

  renderSettingsNotificationRows(notificationTypes) {
    return notificationTypes.map((el) => {
      return (
        <SettingsNotificationRow
          key={el.text}
          text={el.text}
          isNotifying={el.isNotifying}
        />
      )
    })
  }

  render() {
    return (
      <Container>
        <RightTitle>SETTINGS</RightTitle>
        <ModalTogglebar tabs={toggleBarTabs}/>
        <NotificationContainer>
          <HorizontalDivider color='light-grey'/>
        </NotificationContainer>
        <NotificationContainer>
          {this.renderSettingsNotificationRows(notificationTypes)}
        </NotificationContainer>
      </Container>
    )
  }
}
