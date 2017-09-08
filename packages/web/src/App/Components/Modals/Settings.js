import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {RightTitle, RightModalCloseX} from './Shared'
import ModalTogglebar from '../ModalTogglebar'

import EditAccount from './EditAccount'
import EditNotifications from './EditNotifications'
import EditPassword from './EditPassword'
import EditServices from './EditServices'

const Container = styled.div``

const toggleBarTabs = ['Account', 'Services', 'Notifications', 'Password']

export default class Settings extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'Account'
    }
  }  

  toggleModal = (event) => {
    let target = event.target.innerHTML.split(' ')[0];
    if(toggleBarTabs.indexOf(target) > -1){
      this.setState({ activeTab: target })  
    }
  }
 
  render() {
    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <RightTitle>SETTINGS</RightTitle>
        <ModalTogglebar toggleModal={this.toggleModal} isActive={this.state.activeTab} tabs={toggleBarTabs}/>
        {this.state.activeTab === 'Account' && <EditAccount/>}
        {this.state.activeTab === 'Services' && <EditServices/>}
        {this.state.activeTab === 'Notifications' && <EditNotifications/>}
        {this.state.activeTab === 'Password' && <EditPassword/>}
      </Container>
    )
  }
}
