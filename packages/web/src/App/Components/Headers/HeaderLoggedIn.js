import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link, NavLink } from 'react-router-dom'
import { Row, Col } from '../FlexboxGrid'
import ProfileMenu from './ProfileMenu'
import { mediaMax, mediaMin } from '../ContentLayout.component'
import Avatar from '../Avatar'
import RoundedButton from '../RoundedButton'
import Icon from '../Icon'
import { StyledRow, StyledRoundedButton, Logo, Divider, HamburgerIcon, MenuLink, SearchNav } from './Shared'
import logo from '../../Shared/Images/ht-logo-white.png'
import getImageUrl from '../../Shared/Lib/getImageUrl'

const LoggedInDesktopContainer = styled.div`
  ${mediaMax.desktop`display: none;`}
`

const LoggedInTabletContainer = styled.div`
  ${mediaMin.desktop`display: none;`}
  ${mediaMax.phone`display: none;`}
`

const NotificationsIcon = styled(Icon)`
  height: 18px;
  width: 18px;
`

const StyledRoundedAvatarButton = styled(RoundedButton)`
  margin-left: 10px;
  margin-right: 20px;
  position: relative;
  top: ${props => props.profileAvatar ? '4px' : '2px'};
`

const StyledRoundedCreateButton = styled(RoundedButton)`
    position: relative;
    bottom: 1px;
`

const StyledRoundedNotificationButton = styled(StyledRoundedButton)`
    position: relative;
    top: 2px;
`

class HeaderLoggedIn extends React.Component {
  static propTypes = {
    reroute: PropTypes.func,
    openModal: PropTypes.func,
    openGlobalModal: PropTypes.func,
    userId: PropTypes.string,
    attemptLogout: PropTypes.func,
    profileAvatar: PropTypes.object,
    globalModal: PropTypes.string,
    globalModalParams: PropTypes.object,
    closeGlobalModal: PropTypes.func,
  }

  toggleProfileMenu = () => {
    if (
      this.props.globalModal === 'profileMenu'
      || this.props.globalModal === 'hamburgerMenu'
    ) return
    this.props.openGlobalModal('profileMenu')
  }

  closeProfileMenu = () => {
    setTimeout(() => {
      if(
        this.props.globalModal === 'profileMenu'
        || this.props.globalModal === 'hamburgerMenu'
      ) {
          this.props.closeGlobalModal()
      }
    }, 100)
  }

  _openHamburgerMenu = () => {
    this.props.openGlobalModal('hamburgerMenu', {isHamburger: true})
  }

  render () {
    const {
      openModal,
      openGlobalModal,
      userId,
      profileAvatar,
      reroute,
      attemptLogout,
      globalModal,
      globalModalParams,
    } = this.props

    return (
      <StyledRow between="xs" middle="xs">
        <Col>
          <Link to="/">
            <Logo src={logo} alt={'Hero Traveler Logo'}/>
          </Link>
        </Col>
        <LoggedInDesktopContainer>
          <Col>
            <Row middle="xs">
              <MenuLink to='/feed/' exact>
                My Feed
              </MenuLink>
              <Divider>&nbsp;</Divider>
              <span>&nbsp;</span>
              <MenuLink to='/' exact>
                Explore
              </MenuLink>
            </Row>
          </Col>
        </LoggedInDesktopContainer>
        <Col smOffset={2} lg={5}>
          <Row end='xs' middle='xs'>
            <SearchNav />
            <Divider>&nbsp;</Divider>
            <LoggedInDesktopContainer>
              <NavLink
                to='/editStory/new'
              >
                <StyledRoundedCreateButton text='Create'/>
              </NavLink>
              <StyledRoundedNotificationButton
                type='headerButton'
                height='32px'
                width='32px'
                name='notifications'
                onClick={openModal}
              >
                <NotificationsIcon name='cameraFlash' />
              </StyledRoundedNotificationButton>
                <StyledRoundedAvatarButton
                  type='headerButton'
                  height='32px'
                  width='32px'
                  profileAvatar={profileAvatar}
                  onClick={this.toggleProfileMenu}
                >
                  <Avatar
                    type='avatar'
                    size={profileAvatar ? 'avatar' : 'mediumSmall'}
                    avatarUrl={getImageUrl(profileAvatar)}
                  />
                </StyledRoundedAvatarButton>
                  {globalModal === 'profileMenu' &&
                    <ProfileMenu
                      closeMyself={this.closeProfileMenu}
                      openModal={openModal}
                      openGlobalModal={openGlobalModal}
                      userId={userId}
                      reroute={reroute}
                      attemptLogout={attemptLogout}
                      globalModalParams={globalModalParams}
                    />
                  }
            </LoggedInDesktopContainer>
            <LoggedInTabletContainer>
              <NavLink
                to='/editStory/new'
              >
                <StyledRoundedButton text='Create'/>
              </NavLink>
            </LoggedInTabletContainer>
            <HamburgerIcon
              name='hamburger'
              onClick={this._openHamburgerMenu}
            />
            {globalModal === 'hamburgerMenu' &&
              <ProfileMenu
                closeMyself={this.closeProfileMenu}
                openModal={openModal}
                openGlobalModal={openGlobalModal}
                userId={userId}
                reroute={reroute}
                attemptLogout={attemptLogout}
                globalModalParams={globalModalParams}
              />
            }
          </Row>
        </Col>
      </StyledRow>
    )
  }
}

function mapStateToProps(state, ownProps) {
  let {users} = state.entities
  const profileAvatar =  users.entities[ownProps.userId].profile.avatar
  return {
    profileAvatar,
    globalModal: state.ux.modalName,
    globalModalParams: state.ux.params,
  }
}

export default connect(mapStateToProps)(HeaderLoggedIn)
