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

export default class Settings extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      modalContent: 'account',
      toggleBarTabs: [
        { text: 'Account', isActive: true, isLast: false },
        { text: 'Services', isActive: false, isLast: false },
        { text: 'Notifications', isActive: false, isLast: false },
        { text: 'Password', isActive: false, isLast: true },
      ],
    }
  }  

  toggleModal = (event) => {
    let target = event.target.innerHTML.split(' ')[0];
    let newTabs = [];
    this.state.toggleBarTabs.forEach(function(tab){
      let newTab = Object.assign({}, tab)
      newTab.isActive = tab.text === target ? true : false;
      newTabs.push(newTab)
    })
    this.setState({ modalContent: target.toLowerCase(), toggleBarTabs: newTabs })
  }
 
  render() {
    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <RightTitle>SETTINGS</RightTitle>
        <ModalTogglebar toggleModal={this.toggleModal} tabs={this.state.toggleBarTabs}/>
        {this.state.modalContent === 'account' ? <EditAccount/> : null }
        {this.state.modalContent === 'services' ? <EditServices/> : null }
        {this.state.modalContent === 'notifications' ? <EditNotifications/> : null }
        {this.state.modalContent === 'password' ? <EditPassword/> : null }
      </Container>
    )
  }
}
