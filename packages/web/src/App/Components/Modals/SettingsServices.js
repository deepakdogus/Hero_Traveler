import React from 'react'
import styled from 'styled-components'

import InputRow from '../InputRow'
import {RightTitle, StyledInput} from './Shared'

import VerticalCenter from '../VerticalCenter'
import ServiceIconRow from '../ServiceIconRow'
import ModalTogglebar from '../ModalTogglebar'
import HorizontalDivider from '../HorizontalDivider'

const toggleBarTabs = [
  { text: 'Account', isActive: true, isLast: false },
  { text: 'Services', isActive: false, isLast: false },
  { text: 'Notifications', isActive: false, isLast: false },
  { text: 'Password', isActive: false, isLast: true },
]

const Container = styled.div``

const ServiceContainer = styled.div`
  padding: 25px;
`

export default class SettingsServices extends React.Component {
  render() {
    return (
      <Container>
        <RightTitle>SETTINGS</RightTitle>
        <ModalTogglebar tabs={toggleBarTabs}/>
        <ServiceContainer>
          <HorizontalDivider color='light-grey'/>
        </ServiceContainer>
        <ServiceContainer>
          <ServiceIconRow iconName='facebook-blue' text='Facebook' isConnected={true}/>
        </ServiceContainer>
        <ServiceContainer>
          <ServiceIconRow iconName='twitter-blue' text='Twitter' isConnected={false}/>
        </ServiceContainer>
        <ServiceContainer>
          <ServiceIconRow iconName='instagram' text='Instagram' isConnected={true}/>
        </ServiceContainer>
      </Container>
    )
  }
}
