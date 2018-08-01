import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {RightTitle, RightModalCloseX} from './Shared'
import TabBar from '../TabBar'

import EditNotifications from './EditNotifications'
import EditServices from './EditServices'
import EditSettings from './EditSettings'

const Container = styled.div``

const tabBarTabs = ['Account', 'Services', 'Notifications', 'Password']

export default class Settings extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func,
    attemptChangePassword: PropTypes.func,
    loginReduxFetching: PropTypes.bool,
    loginReduxError: PropTypes.object,
    userId: PropTypes.string,
    userProfile: PropTypes.object,
    userEmail: PropTypes.string,
    attemptUpdateUser: PropTypes.func,
    userEntitiesUpdating: PropTypes.bool,
    userEntitiesError: PropTypes.object,
    userNotificationTypes: PropTypes.arrayOf(PropTypes.string),
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
    const {
      loginReduxError,
      loginReduxFetching,
      attemptChangePassword,
      userId,
      userProfile,
      userEmail,
      userNotificationTypes = [],
      attemptUpdateUser,
      userEntitiesUpdating,
      userEntitiesError
    } = this.props

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
        {this.state.activeTab === 'Account' &&
          <EditSettings
            updateAccountOrPassword={attemptUpdateUser}
            userProfile={userProfile}
            userEmailOrId={userEmail}
            isUpdating={userEntitiesUpdating}
            errorObj={userEntitiesError}
            type={'account'}
          />
        }
        {this.state.activeTab === 'Services' && <EditServices/>}
        {this.state.activeTab === 'Notifications' &&
          <EditNotifications
            attemptUpdateUser={attemptUpdateUser}
            userEntitiesUpdating={userEntitiesUpdating}
            userEntitiesError={userEntitiesError}
            userNotificationTypes={userNotificationTypes}
          />
        }
        {this.state.activeTab === 'Password' &&
          <EditSettings
            updateAccountOrPassword={attemptChangePassword}
            userProfile={userProfile}
            userEmailOrId={userId}
            isUpdating={loginReduxFetching}
            errorObj={loginReduxError}
            type={'password'}
          />
        }
      </Container>
    )
  }
}