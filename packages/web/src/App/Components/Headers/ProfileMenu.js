import React from 'react'
import onClickOutside from 'react-onclickoutside'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { haveFieldsChanged } from '../../Shared/Lib/draftChangedHelpers'

const Sidebar = styled.div`
  position: absolute;
  right: 10px;
  top: 75px;
  background-color: ${props => props.theme.Colors.snow};
  box-shadow: ${props => `0px 2px 6px 0px ${props.theme.Colors.backgroundTintLow}`};
  border: ${props => `1px solid ${props.theme.Colors.dividerGrey}`};
  padding: 20px 0px 20px 40px;
  animation-name: fadeIn;
  animation-duration: .2s;

  overflow: hidden;
`

const SidebarDemiLink = styled.p`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  color: ${props => props.theme.Colors.background};
  font-weight: 400;
  letter-spacing: .2px;
  font-size: 16px;
  max-width: 80%;
  text-align: start;
  cursor: pointer;
`

const ExtraLinks = styled.div`
  margin: 0;
`

class ProfileMenu extends React.Component{
  static propTypes = {
    reroute: PropTypes.func,
    closeMyself: PropTypes.func,
    openGlobalModal: PropTypes.func,
    userId: PropTypes.string,
    user: PropTypes.object,
    attemptLogout: PropTypes.func,
    globalModalParams: PropTypes.object,
    workingDraft: PropTypes.object,
    originalDraft: PropTypes.object,
    openSaveEditsModal: PropTypes.func,
    pathname: PropTypes.string,
  }

  handleClickOutside = () => {
      this.props.closeMyself()
  }

  rerouteToProfile = ()=> {
    this.rerouteAndClose(`/${this.props.user.username}`)
  }

  rerouteToExplore = () => {
    this.rerouteAndClose('/')
  }

  rerouteToFeed = () => {
    this.rerouteAndClose('/feed/')
  }

  rerouteToCustomizeInterests = () => {
    this.rerouteAndClose('/profile/editTopics')
  }

  rerouteAndClose = (routePath) => {
    this.props.closeMyself()
    this.props.reroute(routePath)
  }

  _openSaveEditsModalToProfile = () => {
    this._saveEditsModalHelper(this.rerouteToProfile, `/${this.props.user.username}`)
  }

  _openSaveEditsModalToLogout = () => {
    this._saveEditsModalHelper(this.handleLogout, 'logout')
  }

  _openSaveEditsModalToCustomizeInterests = () => {
    this._saveEditsModalHelper(this.rerouteToCustomizeInterests, '/profile/editTopics')
  }

  _openSaveEditsModalToExplore = () => {
    this._saveEditsModalHelper(this.rerouteToExplore, '/')
  }

  _openSaveEditsModalToFeed = () => {
    this._saveEditsModalHelper(this.rerouteToFeed, '/feed/')
  }

  _saveEditsModalHelper = (rerouteFunc, pathname) => {
    const {workingDraft, originalDraft, openSaveEditsModal} = this.props
    if (this._shouldOpenSaveEditsModal()){
      rerouteFunc()
    }
    else if (haveFieldsChanged(workingDraft, originalDraft)) {
      openSaveEditsModal(pathname)
    }
  }

  _shouldOpenSaveEditsModal = () => {
    const {workingDraft, originalDraft} = this.props
    return !this.props.pathname.includes('editStory')
      || !haveFieldsChanged(workingDraft, originalDraft)
  }

  openFAQ = () => {
    this.openGlobalModalAndClose('documentation')
  }

  openSettings = () => {
    this.openGlobalModalAndClose('settings')
  }

  openNotifications = () => {
    this.openGlobalModalAndClose('notificationsThread')
  }

  handleLogout = () =>{
    this.props.attemptLogout(this.props.userId)
  }

  openGlobalModalAndClose = (modalName) => {
    this.props.closeMyself()
    this.props.openGlobalModal(modalName)
  }

  render(){
    const {globalModalParams} = this.props

    return(
      <Sidebar>
        <SidebarDemiLink onClick={this._openSaveEditsModalToProfile}>
          My Profile
        </SidebarDemiLink>
        {globalModalParams.isHamburger && (
          <ExtraLinks>
            <SidebarDemiLink onClick={this.openNotifications}>
              Notifications
            </SidebarDemiLink>
            <SidebarDemiLink onClick={this._openSaveEditsModalToExplore}>
              Explore
            </SidebarDemiLink>
            <SidebarDemiLink onClick={this._openSaveEditsModalToFeed}>
              My Feed
            </SidebarDemiLink>
          </ExtraLinks>
        )}
        <SidebarDemiLink onClick={this.openSettings}>
          Settings
        </SidebarDemiLink>
        <SidebarDemiLink onClick={this._openSaveEditsModalToCustomizeInterests}>
          Customize Interests
        </SidebarDemiLink>
        <SidebarDemiLink onClick={this.openFAQ}>
          FAQ
        </SidebarDemiLink>
        <SidebarDemiLink onClick={this._openSaveEditsModalToLogout}>
          Log Out
        </SidebarDemiLink>
      </Sidebar>
    )
  }
}

export default onClickOutside(ProfileMenu)
