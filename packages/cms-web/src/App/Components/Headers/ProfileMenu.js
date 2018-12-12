import React from 'react'
import onClickOutside from 'react-onclickoutside'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Sidebar = styled.div`
  position: absolute;
  right: 10px;
  top: 75px;
  background-color: ${props => props.theme.Colors.white};
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
    userId: PropTypes.string,
    attemptLogout: PropTypes.func,
    globalModalParams: PropTypes.object,
    openSaveEditsModal: PropTypes.func,
  }

  handleClickOutside = () => {
      this.props.closeMyself()
  }

  rerouteAndClose = (routePath) => {
    this.props.closeMyself()
    this.props.reroute(routePath)
  }

  openUsers = () => {
    this.rerouteAndClose('/users')
  }

  attemptLogout = () => {
    this.props.attemptLogout()
    this.props.closeMyself()
  }

  render(){
    const {globalModalParams} = this.props

    return(
      <Sidebar>
        {globalModalParams.isHamburger &&
          <ExtraLinks>
            <SidebarDemiLink onClick={this.openUsers}>
              Users
            </SidebarDemiLink>
          </ExtraLinks>
        }
        <SidebarDemiLink onClick={this.attemptLogout}>
          Log Out
        </SidebarDemiLink>
      </Sidebar>
    )
  }
}

export default onClickOutside(ProfileMenu)
