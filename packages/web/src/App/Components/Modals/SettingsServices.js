import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {RightTitle, RightModalCloseX} from './Shared'

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
  { iconName: 'facebook-blue', text: 'Facebook', service: 'facebook', isConnected: true },
  { iconName: 'twitter-blue', text: 'Twitter', service: 'twitter', isConnected: false },
  { iconName: 'instagram', text: 'Instagram', service: 'instagram', isConnected: true },
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

  renderServiceRows(serviceTypes) {
    return serviceTypes.map((el, index) => {
      return (
        <ServiceIconRow
          index={index}
          key={el.text}
          iconName={el.iconName}
          text={el.text}
          service={el.service}
          isConnected={el.isConnected}
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
        <ServiceContainer>
          {this.renderServiceRows(serviceTypes)}
        </ServiceContainer>
      </Container>
    )
  }
}
