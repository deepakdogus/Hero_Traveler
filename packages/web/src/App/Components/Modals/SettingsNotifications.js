import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {RightTitle, RightModalCloseX} from './Shared'
import SettingsNotificationRow from '../SettingsNotificationRow'
import ModalTogglebar from '../ModalTogglebar'

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
    static propTypes = {
    toggleModal: PropTypes.func,
    closeModal: PropTypes.func,
  }

  toggleNotificationSwitch = (e, f) => {console.log("toggleNotificationSwitch: ", e, f)}

  logOnChange = (e) => {console.log("logOnChange: ", e)}

  renderSettingsNotificationRows(notificationTypes) {
    return notificationTypes.map((el,index) => {
      return (
        <SettingsNotificationRow
          index={index}
          key={el.text}
          text={el.text}
          isNotifying={el.isNotifying}
          toggleNotificationSwitch={this.toggleNotificationSwitch}
          logOnChange={this.logOnChange}
        />
      )
    })
  }

  render() {
    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <RightTitle>SETTINGS</RightTitle>
        <ModalTogglebar toggleModal={this.props.toggleModal} tabs={toggleBarTabs}/>
        <NotificationContainer>
          {this.renderSettingsNotificationRows(notificationTypes)}
        </NotificationContainer>
      </Container>
    )
  }
}
