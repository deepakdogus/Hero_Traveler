import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {RightTitle, RightModalCloseX} from './Shared'

import ModalTogglebar from '../ModalTogglebar'
import HorizontalDivider from '../HorizontalDivider'
import SocialMediaRow from '../Signup/SocialMediaRow'

const toggleBarTabs = [
  { text: 'Account', isActive: false, isLast: false },
  { text: 'Services', isActive: true, isLast: false },
  { text: 'Notifications', isActive: false, isLast: false },
  { text: 'Password', isActive: false, isLast: true },
]

const Container = styled.div``

const ServiceContainer = styled.div`
  padding: 25px;
`

export default class SettingsServices extends React.Component {
      static propTypes = {
    toggleModal: PropTypes.func,
    closeModal: PropTypes.func,
  }

  render() {
    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <RightTitle>SETTINGS</RightTitle>
        <ModalTogglebar toggleModal={this.props.toggleModal} tabs={toggleBarTabs}/>
        <ServiceContainer>
          <HorizontalDivider color='grey'/>
          <SocialMediaRow text={'Facebook'} margin='modal' isConnected={true} />
          <HorizontalDivider color='grey'/>
          <SocialMediaRow text={'Twitter'} margin='modal' isConnected={false} />
          <HorizontalDivider color='grey'/>
          <SocialMediaRow text={'Instagram'} margin='modal' isConnected={false} />
          <HorizontalDivider color='grey'/>
        </ServiceContainer>
      </Container>
    )
  }
}
