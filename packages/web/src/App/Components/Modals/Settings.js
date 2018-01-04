import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {RightTitle, RightModalCloseX} from './Shared'
import TabBar from '../TabBar'

import EditAccount from './EditAccount'
import EditNotifications from './EditNotifications'
import EditPassword from './EditPassword'
import EditServices from './EditServices'

const Container = styled.div``

const tabBarTabs = ['Account', 'Services', 'Notifications', 'Password']

export default class Settings extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func,
    attemptChangePassword: PropTypes.func,
    loginReduxFetching: PropTypes.bool,
    loginReduxError: PropTypes.object,
    userId: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'Account'
    }
  }

  onClickTab = (event) => {
    let tab = event.target.innerHTML
    if (this.state.activeTab !== tab) this.setState({ activeTab: tab })
  }

  render() {
    const { loginReduxError, loginReduxFetching, attemptChangePassword, userId } = this.props
    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <RightTitle>SETTINGS</RightTitle>
        <TabBar
          activeTab={this.state.activeTab}
          onClickTab={this.onClickTab}
          tabs={tabBarTabs}
          isModal
          whiteBG
        />
        {this.state.activeTab === 'Account' && <EditAccount/>}
        {this.state.activeTab === 'Services' && <EditServices/>}
        {this.state.activeTab === 'Notifications' && <EditNotifications/>}
        {this.state.activeTab === 'Password' && 
          <EditPassword
            attemptChangePassword={attemptChangePassword}
            loginReduxFetching={loginReduxFetching}
            loginReduxError={loginReduxError}
            userId={userId}
          />
        }
      </Container>
    )
  }
}
