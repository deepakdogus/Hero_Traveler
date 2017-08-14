import React from 'react'
import styled from 'styled-components'

import InputRow from '../InputRow'
import {RightTitle, StyledInput} from './Shared'

import VerticalCenter from '../VerticalCenter'
import ServiceIconRow from '../ServiceIconRow'
import ModalTogglebar from '../ModalTogglebar'
import HorizontalDivider from '../HorizontalDivider'

const toggleBarTabs = [
  { text: 'Account', isActive: false, isLast: false },
  { text: 'Services', isActive: true, isLast: false },
  { text: 'Notifications', isActive: false, isLast: false },
  { text: 'Password', isActive: false, isLast: true },
]

const serviceTypes = [
  { iconName: 'facebook-blue', text: 'Facebook', isConnected: true },
  { iconName: 'twitter-blue', text: 'Twitter', isConnected: false },
  { iconName: 'instagram', text: 'Instagram', isConnected: true },
]

const Container = styled.div``

const ServiceContainer = styled.div`
  padding: 25px;
`

export default class SettingsServices extends React.Component {

  renderServiceRows(notificationTypes) {
    return notificationTypes.map((el) => {
      return (
        <ServiceIconRow
          key={el.text}
          iconName={el.iconName}
          text={el.text}
          isConnected={el.isConnected}
        />
      )
    })
  }

  render() {
    return (
      <Container>
        <RightTitle>SETTINGS</RightTitle>
        <ModalTogglebar tabs={toggleBarTabs}/>
        <ServiceContainer>
          <HorizontalDivider color='light-grey'/>
        </ServiceContainer>
        <ServiceContainer>
          {this.renderServiceRows(serviceTypes)}
        </ServiceContainer>
      </Container>
    )
  }
}
