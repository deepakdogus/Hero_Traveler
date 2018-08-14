import React from 'react'
import onClickOutside from 'react-onclickoutside'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Sidebar = styled.div`
  position: absolute;
  right: 5px;
  top: 70px;
  background-color: ${props => props.theme.Colors.white};
  box-shadow: 3px 3px 5px -1px ${props => props.theme.Colors.background};
  padding: 20px 0px 20px 40px;
  animation-name: fadeIn;
  animation-duration: .1s;
  overflow: hidden;
`

const SidebarDemiLink = styled.p`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  color: ${props =>  props.theme.Colors.background};
  font-weight: 400;
  letter-spacing: .7px;
  font-size: 16px;
  max-width: 80%;
  text-align: start;
  cursor: pointer;
`

class ProfileMenu extends React.Component{
  static propTypes = {
    reroute: PropTypes.func,
    closeMyself: PropTypes.func,
    openModal: PropTypes.func,
    openGlobalModal: PropTypes.func,
    userId: PropTypes.string,
    attemptLogout: PropTypes.func
  }

  handleClickOutside = () => {
      this.props.closeMyself()
  }

  rerouteToProfile = ()=> {
    this.rerouteAndClose(`/profile/${this.props.userId}/view`)
  }

  rerouteToCustomizeInterests = () => {
    this.rerouteAndClose('/signup/topics')
  }

  rerouteAndClose = (routePath) => {
    this.props.closeMyself()
    this.props.reroute(routePath)
  }

  openFAQ = () => {
    this.openGlobalModalAndClose('faqTermsAndConditions')
  }

  openSettings = () => {
    this.openGlobalModalAndClose('settings')
  }

  handleLogout = () =>{
    this.props.attemptLogout(this.props.userId)
  }

  openGlobalModalAndClose = (modalName) => {
    this.props.closeMyself()
    this.props.openGlobalModal(modalName)
  }

  render(){

    return(
      <Sidebar>
        <SidebarDemiLink onClick={this.rerouteToProfile}>
          My Profile
        </SidebarDemiLink>
        <SidebarDemiLink onClick={this.openSettings}>
          Settings
        </SidebarDemiLink>
        <SidebarDemiLink onClick={this.rerouteToCustomizeInterests}>
          Customize Interests
        </SidebarDemiLink>
        <SidebarDemiLink onClick={this.openFAQ}>
          FAQ
        </SidebarDemiLink>
        <SidebarDemiLink onClick={this.handleLogout}>
          Logout
        </SidebarDemiLink>
      </Sidebar>
    )
  }
}

export default onClickOutside(ProfileMenu)